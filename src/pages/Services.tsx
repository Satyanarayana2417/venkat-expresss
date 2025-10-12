import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { CheckCircle, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Services = () => {
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    serviceType: 'you-give-we-ship',
    weight: '',
    packageType: '',
    destinationCountry: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.serviceType || !formData.weight || !formData.packageType || 
        !formData.destinationCountry || !formData.firstName || !formData.lastName || 
        !formData.email || !formData.phone || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    
    toast({
      title: "Quote Request Received!",
      description: "We'll send you a detailed quote within 24 hours.",
    });

    // Reset form
    setFormData({
      serviceType: 'you-give-we-ship',
      weight: '',
      packageType: '',
      destinationCountry: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
    });
  };

  const services = [
    {
      title: 'You Give, We Ship',
      description: 'Already have products? Bring them to our Hyderabad branch or schedule a pickup.',
      features: [
        'Pickup from your location',
        'Professional packaging',
        'Insurance available',
        'Real-time tracking',
      ],
      pricing: 'Starting from ₹2,100',
    },
    {
      title: 'We Buy for You',
      description: 'Select products from our catalog or request specific items from India.',
      features: [
        'Personal shopping service',
        'Quality verification',
        'Bulk consolidation',
        'Express shipping',
      ],
      pricing: 'Service fee + item cost',
    },
    {
      title: 'Express Shipping',
      description: 'Need it fast? Our premium express service gets your items delivered quickly.',
      features: [
        '3-7 day delivery',
        'Premium packaging',
        'Full insurance',
        'Priority handling',
      ],
      pricing: 'Starting from ₹3,800',
    },
  ];

  const packageTypes = [
    'Documents',
    'Food Items',
    'Decorative Items',
    'Clothing & Textiles',
    'Electronics',
    'Books & Media',
    'Other',
  ];

  const countries = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Singapore',
    'UAE',
    'Saudi Arabia',
    'Other',
  ];

  return (
    <div>
      {/* Hero Section - Dark Professional */}
      <section className="bg-[#101B2D] text-white py-10 md:py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Courier Services
            </h1>
            {/* Mobile text */}
            <p className="text-base md:hidden text-white/90 leading-relaxed">
              Your personal courier and shopper, from India to the world.
            </p>
            {/* Desktop text */}
            <p className="hidden md:block text-base md:text-lg text-white/90 leading-relaxed">
              Professional courier services from India to the world. Whether you want to send personal items or need us to shop on your behalf, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Our Services Section - Three Cards */}
      <section className="container mx-auto px-4 lg:px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the service that best fits your needs
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
              Get Shipping Quote
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Calculate your shipping cost and get an instant quote
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
                          Select Service Type *
                        </Label>
                        <RadioGroup 
                          value={formData.serviceType}
                          onValueChange={(value) => handleInputChange('serviceType', value)}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                            <RadioGroupItem value="you-give-we-ship" id="service1" />
                            <Label htmlFor="service1" className="cursor-pointer flex-1 font-medium">
                              You Give, We Ship
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                            <RadioGroupItem value="we-buy-for-you" id="service2" />
                            <Label htmlFor="service2" className="cursor-pointer flex-1 font-medium">
                              We Buy for You
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Package Weight */}
                      <div className="space-y-2">
                        <Label htmlFor="weight" className="text-base font-semibold text-gray-900">
                          Package Weight (kg) *
                        </Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.1"
                          min="0"
                          placeholder="Enter weight in kg"
                          value={formData.weight}
                          onChange={(e) => handleInputChange('weight', e.target.value)}
                          className="text-base"
                          required
                        />
                      </div>

                      {/* Package Type */}
                      <div className="space-y-2">
                        <Label htmlFor="packageType" className="text-base font-semibold text-gray-900">
                          Package Type *
                        </Label>
                        <Select 
                          value={formData.packageType}
                          onValueChange={(value) => handleInputChange('packageType', value)}
                        >
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Select package type" />
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
                          Destination Country *
                        </Label>
                        <Select 
                          value={formData.destinationCountry}
                          onValueChange={(value) => handleInputChange('destinationCountry', value)}
                        >
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Select destination country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country.toLowerCase().replace(/\s+/g, '-')}>
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
                          Contact Information
                        </h3>
                        <div className="space-y-4">
                          {/* First Name */}
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                              First Name *
                            </Label>
                            <Input
                              id="firstName"
                              type="text"
                              placeholder="Enter first name"
                              value={formData.firstName}
                              onChange={(e) => handleInputChange('firstName', e.target.value)}
                              required
                            />
                          </div>

                          {/* Last Name */}
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                              Last Name *
                            </Label>
                            <Input
                              id="lastName"
                              type="text"
                              placeholder="Enter last name"
                              value={formData.lastName}
                              onChange={(e) => handleInputChange('lastName', e.target.value)}
                              required
                            />
                          </div>

                          {/* Email */}
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                              Email Address *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter email address"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              required
                            />
                          </div>

                          {/* Phone */}
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                              Phone Number *
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="Enter phone number"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          Delivery Address *
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </Label>
                        <Textarea
                          id="address"
                          placeholder="Enter complete delivery address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          rows={4}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-8">
                    <Button 
                      type="submit" 
                      className="w-full bg-[#212529] hover:bg-[#2c3136] text-white text-base py-6 font-semibold"
                    >
                      Get Quote
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
