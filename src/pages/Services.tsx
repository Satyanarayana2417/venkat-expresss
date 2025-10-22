import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { CheckCircle, MapPin, LogIn, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { toast as sonnerToast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { QuoteTimeline } from '@/components/QuoteTimeline';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    serviceType: 'you-give-we-ship',
    itemName: '',
    weight: '',
    packageType: '',
    destinationCountry: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Detailed shipping address fields
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    additionalNotes: '',
  });

  // 🔐 SECURE: Load active quote from user's Firestore profile on auth state change
  // This ensures each user only sees their own timeline, even after login/logout
  useEffect(() => {
    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is logged in - fetch their active quote from Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const activeQuoteId = userData.activeQuoteId;
            
            if (activeQuoteId) {
              // Set the quote ID to display timeline
              setSubmittedQuoteId(activeQuoteId);
              console.log('✅ Loaded active quote from user profile:', activeQuoteId);
            } else {
              // No active quote for this user
              setSubmittedQuoteId(null);
            }
          }
        } catch (error) {
          console.error('Error fetching user active quote:', error);
          setSubmittedQuoteId(null);
        }
      } else {
        // User logged out - clear timeline immediately
        setSubmittedQuoteId(null);
        console.log('🔒 User logged out - timeline cleared');
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array - runs once and sets up persistent listener

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated - REQUIRED by security rules
    if (!user) {
      sonnerToast.error(t('services.authenticationRequired'), {
        description: t('services.pleaseLogin'),
        duration: 5000,
        action: {
          label: 'Login',
          onClick: () => navigate('/auth')
        }
      });
      
      // Redirect to auth page after 2 seconds
      setTimeout(() => {
        navigate('/auth', { state: { from: '/services', message: 'Please log in to submit a quote request' } });
      }, 2000);
      return;
    }
    
    // Validate required fields
    if (!formData.serviceType || !formData.itemName || !formData.weight || !formData.packageType || 
        !formData.destinationCountry || !formData.firstName || !formData.lastName || 
        !formData.email || !formData.phone || !formData.addressLine1 || 
        !formData.city || !formData.state || !formData.postalCode || !formData.country) {
      toast({
        title: t('services.missingInformation'),
        description: t('services.fillAllFields'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save quote request to Firestore with userId - REQUIRED by security rules
      const quoteRequestsRef = collection(db, 'quote_requests');
      
      // Construct the data payload that complies with security rules
      const quoteData = {
        serviceType: formData.serviceType,
        itemName: formData.itemName,
        weight: parseFloat(formData.weight),
        packageType: formData.packageType,
        destinationCountry: formData.destinationCountry,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        // Detailed shipping address
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        additionalNotes: formData.additionalNotes,
        // Combined address for display purposes
        address: `${formData.addressLine1}${formData.addressLine2 ? ', ' + formData.addressLine2 : ''}, ${formData.city}, ${formData.state} ${formData.postalCode}, ${formData.country}`,
        userId: user.uid,  // CRITICAL: Required by security rule - must match request.auth.uid
        status: 'Pending',
        createdAt: serverTimestamp(),
      };
      
      // Add document and get the reference with the new ID
      const docRef = await addDoc(quoteRequestsRef, quoteData);
      
      // 🔐 SECURE: Store active quote ID in user's Firestore profile
      // This replaces sessionStorage and ties the timeline to the authenticated user
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        activeQuoteId: docRef.id,
        lastQuoteSubmittedAt: serverTimestamp()
      });
      
      // Update local state to show the timeline
      setSubmittedQuoteId(docRef.id);
      
      console.log('✅ Quote created and linked to user profile:', docRef.id);

      // Show success message with Sonner toast for better visibility
      sonnerToast.success(t('services.quoteSentSuccess'), {
        description: t('services.trackRequestBelow'),
        duration: 6000,
      });

      // Reset form
      setFormData({
        serviceType: 'you-give-we-ship',
        itemName: '',
        weight: '',
        packageType: '',
        destinationCountry: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        additionalNotes: '',
      });
      
      // Scroll to timeline after a short delay
      setTimeout(() => {
        const timelineElement = document.getElementById('quote-timeline');
        if (timelineElement) {
          timelineElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    } catch (error: any) {
      console.error('Error submitting quote request:', error);
      
      // Provide specific error message based on error type
      let errorMessage = t('services.errorOccurred');
      
      if (error?.code === 'permission-denied') {
        errorMessage = t('services.permissionDenied');
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      sonnerToast.error(t('services.failedToSubmit'), {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      title: t('services.youGiveWeShip'),
      description: t('services.youGiveWeShipDesc'),
      features: [
        t('services.pickupFromLocation'),
        t('services.professionalPackaging'),
        t('services.insuranceAvailable'),
        t('services.realTimeTracking'),
      ],
      pricing: t('services.startingFrom2100'),
    },
    {
      title: t('services.weBuyForYou'),
      description: t('services.weBuyForYouDesc'),
      features: [
        t('services.personalShopping'),
        t('services.qualityVerification'),
        t('services.bulkConsolidation'),
        t('services.expressShippingFeature'),
      ],
      pricing: t('services.serviceFeeItemCost'),
    },
    {
      title: t('services.expressShipping'),
      description: t('services.expressShippingDesc'),
      features: [
        t('services.threeTo7Days'),
        t('services.premiumPackaging'),
        t('services.fullInsurance'),
        t('services.priorityHandling'),
      ],
      pricing: t('services.startingFrom3800'),
    },
  ];

  const packageTypes = [
    t('services.packageTypes.documents'),
    t('services.packageTypes.foodItems'),
    t('services.packageTypes.decorativeItems'),
    t('services.packageTypes.clothingTextiles'),
    t('services.packageTypes.electronics'),
    t('services.packageTypes.booksMedia'),
    t('services.packageTypes.other'),
  ];

  const countries = [
    'AFGHANISTAN',
    'ALBANIA',
    'ALGERIA',
    'ANDORRA',
    'ANGOLA',
    'ARGENTINA',
    'ARMENIA',
    'AUSTRALIA',
    'AUSTRIA',
    'AZERBAIJAN',
    'BAHAMAS',
    'BAHRAIN',
    'BANGLADESH',
    'BARBADOS',
    'BELARUS',
    'BELGIUM',
    'BELIZE',
    'BENIN',
    'BHUTAN',
    'BOLIVIA',
    'BOSNIA AND HERZEGOVINA',
    'BOTSWANA',
    'BRAZIL',
    'BRUNEI',
    'BULGARIA',
    'BURKINA FASO',
    'BURUNDI',
    'CAMBODIA',
    'CAMEROON',
    'CANADA',
    'CAPE VERDE',
    'CENTRAL AFRICAN REPUBLIC',
    'CHAD',
    'CHILE',
    'CHINA',
    'COLOMBIA',
    'COMOROS',
    'CONGO',
    'COSTA RICA',
    'CROATIA',
    'CUBA',
    'CYPRUS',
    'CZECH REPUBLIC',
    'DENMARK',
    'DJIBOUTI',
    'DOMINICA',
    'DOMINICAN REPUBLIC',
    'ECUADOR',
    'EGYPT',
    'EL SALVADOR',
    'EQUATORIAL GUINEA',
    'ERITREA',
    'ESTONIA',
    'ETHIOPIA',
    'FIJI',
    'FINLAND',
    'FRANCE',
    'GABON',
    'GAMBIA',
    'GEORGIA',
    'GERMANY',
    'GHANA',
    'GREECE',
    'GRENADA',
    'GUATEMALA',
    'GUINEA',
    'GUINEA-BISSAU',
    'GUYANA',
    'HAITI',
    'HONDURAS',
    'HONG KONG',
    'HUNGARY',
    'ICELAND',
    'INDONESIA',
    'IRAN',
    'IRAQ',
    'IRELAND',
    'ISRAEL',
    'ITALY',
    'JAMAICA',
    'JAPAN',
    'JORDAN',
    'KAZAKHSTAN',
    'KENYA',
    'KIRIBATI',
    'KUWAIT',
    'KYRGYZSTAN',
    'LAOS',
    'LATVIA',
    'LEBANON',
    'LESOTHO',
    'LIBERIA',
    'LIBYA',
    'LIECHTENSTEIN',
    'LITHUANIA',
    'LUXEMBOURG',
    'MADAGASCAR',
    'MALAWI',
    'MALAYSIA',
    'MALDIVES',
    'MALI',
    'MALTA',
    'MARSHALL ISLANDS',
    'MAURITANIA',
    'MAURITIUS',
    'MEXICO',
    'MICRONESIA',
    'MOLDOVA',
    'MONACO',
    'MONGOLIA',
    'MONTENEGRO',
    'MOROCCO',
    'MOZAMBIQUE',
    'MYANMAR',
    'NAMIBIA',
    'NAURU',
    'NEPAL',
    'NETHERLANDS',
    'NEW ZEALAND',
    'NICARAGUA',
    'NIGER',
    'NIGERIA',
    'NORTH KOREA',
    'NORTH MACEDONIA',
    'NORWAY',
    'OMAN',
    'PAKISTAN',
    'PALAU',
    'PALESTINE',
    'PANAMA',
    'PAPUA NEW GUINEA',
    'PARAGUAY',
    'PERU',
    'PHILIPPINES',
    'POLAND',
    'PORTUGAL',
    'QATAR',
    'ROMANIA',
    'RUSSIA',
    'RWANDA',
    'SAINT KITTS AND NEVIS',
    'SAINT LUCIA',
    'SAINT VINCENT AND THE GRENADINES',
    'SAMOA',
    'SAN MARINO',
    'SAO TOME AND PRINCIPE',
    'SAUDI ARABIA',
    'SENEGAL',
    'SERBIA',
    'SEYCHELLES',
    'SIERRA LEONE',
    'SINGAPORE',
    'SLOVAKIA',
    'SLOVENIA',
    'SOLOMON ISLANDS',
    'SOMALIA',
    'SOUTH AFRICA',
    'SOUTH KOREA',
    'SOUTH SUDAN',
    'SPAIN',
    'SRI LANKA',
    'SUDAN',
    'SURINAME',
    'SWEDEN',
    'SWITZERLAND',
    'SYRIA',
    'TAIWAN',
    'TAJIKISTAN',
    'TANZANIA',
    'THAILAND',
    'TIMOR-LESTE',
    'TOGO',
    'TONGA',
    'TRINIDAD AND TOBAGO',
    'TUNISIA',
    'TURKEY',
    'TURKMENISTAN',
    'TUVALU',
    'UGANDA',
    'UKRAINE',
    'UNITED ARAB EMIRATES',
    'UNITED KINGDOM',
    'UNITED STATES',
    'URUGUAY',
    'UZBEKISTAN',
    'VANUATU',
    'VATICAN CITY',
    'VENEZUELA',
    'VIETNAM',
    'YEMEN',
    'ZAMBIA',
    'ZIMBABWE',
  ];

  return (
    <div>
      {/* Hero Section - Dark Professional */}
      <section className="bg-[#101B2D] text-white py-10 md:py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto relative">
            {/* Mobile Back Button - Positioned on the left */}
            <button
              onClick={() => navigate(-1)}
              className="md:hidden absolute left-0 top-0 flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {t('services.pageTitle')}
            </h1>
            {/* Mobile text */}
            <p className="text-base md:hidden text-white/90 leading-relaxed">
              {t('services.pageSubtitleMobile')}
            </p>
            {/* Desktop text */}
            <p className="hidden md:block text-base md:text-lg text-white/90 leading-relaxed">
              {t('services.pageSubtitleDesktop')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Services Section - Three Cards */}
      <section className="container mx-auto px-4 lg:px-6 pt-8 pb-16 md:pt-10 md:pb-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            {t('services.ourServices')}
          </h2>
          <p className="hidden md:block text-muted-foreground text-lg max-w-2xl mx-auto">
            {t('services.chooseService')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-6 md:p-8">
                <h3 className="font-heading text-xl md:text-2xl font-bold mb-3 text-gray-900">
                  {service.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-lg font-bold text-gray-900">
                    {service.pricing}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Get Shipping Quote Form */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              {t('services.getShippingQuote')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('services.calculateShipping')}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="bg-white shadow-md">
              <CardContent className="p-6 md:p-10">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Service Type */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold text-gray-900">
                          {t('services.selectServiceType')} *
                        </Label>
                        <RadioGroup 
                          value={formData.serviceType}
                          onValueChange={(value) => handleInputChange('serviceType', value)}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                            <RadioGroupItem value="you-give-we-ship" id="service1" />
                            <Label htmlFor="service1" className="cursor-pointer flex-1 font-medium">
                              {t('services.youGiveWeShip')}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                            <RadioGroupItem value="we-buy-for-you" id="service2" />
                            <Label htmlFor="service2" className="cursor-pointer flex-1 font-medium">
                              {t('services.weBuyForYou')}
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Item Name */}
                      <div className="space-y-2">
                        <Label htmlFor="itemName" className="text-base font-semibold text-gray-900">
                          {t('services.itemName')} *
                        </Label>
                        <Input
                          id="itemName"
                          type="text"
                          placeholder={t('services.itemNamePlaceholder')}
                          value={formData.itemName}
                          onChange={(e) => handleInputChange('itemName', e.target.value)}
                          className="text-base"
                          required
                        />
                      </div>

                      {/* Package Weight */}
                      <div className="space-y-2">
                        <Label htmlFor="weight" className="text-base font-semibold text-gray-900">
                          {t('services.packageWeight')} *
                        </Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder={t('services.weightPlaceholder')}
                          value={formData.weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          className="text-base"
                          required
                        />
                      </div>

                      {/* Package Type */}
                      <div className="space-y-2">
                        <Label htmlFor="packageType" className="text-base font-semibold text-gray-900">
                          {t('services.packageType')} *
                        </Label>
                        <Select 
                          value={formData.packageType}
                          onValueChange={(value) => handleInputChange('packageType', value)}
                        >
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder={t('services.selectPackageType')} />
                          </SelectTrigger>
                          <SelectContent>
                            {packageTypes.map((type) => (
                              <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Destination Country */}
                      <div className="space-y-2">
                        <Label htmlFor="destinationCountry" className="text-base font-semibold text-gray-900">
                          {t('services.destinationCountry')} *
                        </Label>
                        <Select 
                          value={formData.destinationCountry}
                          onValueChange={(value) => handleInputChange('destinationCountry', value)}
                        >
                          <SelectTrigger className="text-base uppercase">
                            <SelectValue placeholder={t('services.selectDestinationCountry')} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {countries.map((country) => (
                              <SelectItem 
                                key={country} 
                                value={country.toLowerCase().replace(/\s+/g, '-')}
                                className="uppercase"
                              >
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {t('services.contactInformation')}
                        </h3>
                        <div className="space-y-4">
                          {/* First Name */}
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                              {t('services.firstName')} *
                            </Label>
                            <Input
                              id="firstName"
                              type="text"
                              placeholder={t('services.firstNamePlaceholder')}
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              required
                            />
                          </div>

                          {/* Last Name */}
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                              {t('services.lastName')} *
                            </Label>
                            <Input
                              id="lastName"
                              type="text"
                              placeholder={t('services.lastNamePlaceholder')}
                              value={formData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              required
                            />
                          </div>

                          {/* Email */}
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                              {t('services.emailAddress')} *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder={t('services.emailPlaceholder')}
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              required
                            />
                          </div>

                          {/* Phone */}
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                              {t('services.phoneNumber')} *
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder={t('services.phonePlaceholder')}
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address Section */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-gray-600" />
                          {t('services.shippingAddress')}
                        </h3>
                        <div className="space-y-4">
                          {/* Address Line 1 */}
                          <div className="space-y-2">
                            <Label htmlFor="addressLine1" className="text-sm font-medium text-gray-700">
                              {t('services.addressLine1')} *
                            </Label>
                            <Input
                              id="addressLine1"
                              type="text"
                              placeholder={t('services.addressLine1Placeholder')}
                              value={formData.addressLine1}
                              onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                              required
                            />
                          </div>

                          {/* Address Line 2 */}
                          <div className="space-y-2">
                            <Label htmlFor="addressLine2" className="text-sm font-medium text-gray-700">
                              {t('services.addressLine2')}
                            </Label>
                            <Input
                              id="addressLine2"
                              type="text"
                              placeholder={t('services.addressLine2Placeholder')}
                              value={formData.addressLine2}
                              onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                            />
                          </div>

                          {/* City and State (Grid) */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                                {t('services.city')} *
                              </Label>
                              <Input
                                id="city"
                                type="text"
                                placeholder={t('services.cityPlaceholder')}
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                                {t('services.stateProvince')} *
                              </Label>
                              <Input
                                id="state"
                                type="text"
                                placeholder={t('services.statePlaceholder')}
                                value={formData.state}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          {/* Postal Code and Country (Grid) */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
                                {t('services.postalZipCode')} *
                              </Label>
                              <Input
                                id="postalCode"
                                type="text"
                                placeholder={t('services.postalPlaceholder')}
                                value={formData.postalCode}
                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                                {t('services.country')} *
                              </Label>
                              <Input
                                id="country"
                                type="text"
                                placeholder={t('services.countryPlaceholder')}
                                value={formData.country}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          {/* Additional Notes */}
                          <div className="space-y-2">
                            <Label htmlFor="additionalNotes" className="text-sm font-medium text-gray-700">
                              {t('services.additionalDeliveryInstructions')}
                            </Label>
                            <Textarea
                              id="additionalNotes"
                              placeholder={t('services.additionalNotesPlaceholder')}
                              value={formData.additionalNotes}
                              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Authentication Notice */}
                  {!user && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <LogIn className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">{t('services.loginRequired')}</p>
                          <p className="text-xs text-blue-700 mt-1">
                            {t('services.loginRequiredDesc')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="mt-8">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-[#212529] hover:bg-[#2c3136] text-white text-base py-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {t('services.submittingQuote')}
                        </span>
                      ) : !user ? (
                        <span className="flex items-center justify-center gap-2">
                          <LogIn className="h-5 w-5" />
                          {t('services.loginToGetQuote')}
                        </span>
                      ) : (
                        t('services.getQuote')
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Real-Time Quote Status Timeline - Shows after submission */}
            {submittedQuoteId && user && (
              <div id="quote-timeline">
                <QuoteTimeline 
                  quoteId={submittedQuoteId} 
                  onClose={async () => {
                    // 🔐 SECURE: Remove activeQuoteId from user's Firestore profile
                    if (user) {
                      try {
                        const userDocRef = doc(db, 'users', user.uid);
                        await updateDoc(userDocRef, {
                          activeQuoteId: null
                        });
                        console.log('✅ Active quote cleared from user profile');
                      } catch (error) {
                        console.error('Error clearing active quote:', error);
                      }
                    }
                    // Clear local state
                    setSubmittedQuoteId(null);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
