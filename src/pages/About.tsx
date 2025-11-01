import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Award, Globe, Package, Users, Heart, Shield, Clock, TrendingUp, 
  Leaf, Handshake, Sprout, CheckCircle, Truck, HeadphonesIcon, 
  BadgeCheck, Linkedin, ChevronDown, MapPin, Star, Box
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });

  // Real-time story images from Firestore
  const [storyImages, setStoryImages] = useState({
    storyImageUrl1: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    storyImageUrl2: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop',
    storyImageUrl3: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=600&fit=crop'
  });

  // Set up real-time listener for story images
  useEffect(() => {
    const docRef = doc(db, 'pageContent', 'aboutUs');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setStoryImages({
          storyImageUrl1: data.storyImageUrl1 || storyImages.storyImageUrl1,
          storyImageUrl2: data.storyImageUrl2 || storyImages.storyImageUrl2,
          storyImageUrl3: data.storyImageUrl3 || storyImages.storyImageUrl3
        });
      }
    }, (error) => {
      console.error('Error fetching story images:', error);
    });

    return () => unsubscribe();
  }, []);

  // Animated Stats Data
  const stats = [
    { 
      icon: Award, 
      label: t('about.stats.yearsExperience'), 
      value: 10,
      suffix: '+',
      color: 'from-orange-500 to-red-500'
    },
    { 
      icon: Globe, 
      label: t('about.stats.countriesServed'), 
      value: 50,
      suffix: '+',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Users, 
      label: t('about.stats.happyCustomers'), 
      value: 15000,
      suffix: '+',
      format: (val: number) => `${(val / 1000).toFixed(0)}K`,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: Package, 
      label: t('about.stats.safeDelivery'), 
      value: 99,
      suffix: '%',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  // Core Values
  const values = [
    {
      icon: Leaf,
      title: t('about.values.authenticity.title'),
      description: t('about.values.authenticity.description'),
      gradient: 'from-green-50 to-emerald-50',
      iconColor: 'text-green-600'
    },
    {
      icon: Shield,
      title: t('about.values.trust.title'),
      description: t('about.values.trust.description'),
      gradient: 'from-blue-50 to-cyan-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Globe,
      title: t('about.values.globalReach.title'),
      description: t('about.values.globalReach.description'),
      gradient: 'from-purple-50 to-pink-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Sprout,
      title: t('about.values.community.title'),
      description: t('about.values.community.description'),
      gradient: 'from-orange-50 to-amber-50',
      iconColor: 'text-orange-600'
    },
  ];

  // Journey Timeline
  const milestones = [
    {
      year: '2014',
      title: t('about.journey.milestones.2014.title'),
      description: t('about.journey.milestones.2014.description'),
      icon: Star
    },
    {
      year: '2017',
      title: t('about.journey.milestones.2017.title'),
      description: t('about.journey.milestones.2017.description'),
      icon: Globe
    },
    {
      year: '2019',
      title: t('about.journey.milestones.2019.title'),
      description: t('about.journey.milestones.2019.description'),
      icon: Box
    },
    {
      year: '2022',
      title: t('about.journey.milestones.2022.title'),
      description: t('about.journey.milestones.2022.description'),
      icon: TrendingUp
    },
    {
      year: '2024',
      title: t('about.journey.milestones.2024.title'),
      description: t('about.journey.milestones.2024.description'),
      icon: Award
    },
  ];

  // Why Choose Us
  const advantages = [
    {
      icon: Truck,
      title: t('about.advantages.expressShipping.title'),
      description: t('about.advantages.expressShipping.description')
    },
    {
      icon: Shield,
      title: t('about.advantages.secureHandling.title'),
      description: t('about.advantages.secureHandling.description')
    },
    {
      icon: CheckCircle,
      title: t('about.advantages.authenticProducts.title'),
      description: t('about.advantages.authenticProducts.description')
    },
    {
      icon: HeadphonesIcon,
      title: t('about.advantages.support.title'),
      description: t('about.advantages.support.description')
    },
    {
      icon: BadgeCheck,
      title: t('about.advantages.customs.title'),
      description: t('about.advantages.customs.description')
    },
    {
      icon: Heart,
      title: t('about.advantages.competitive.title'),
      description: t('about.advantages.competitive.description')
    },
  ];

  // Team Members
  // Team Members - Dynamic from Firestore
  const [team, setTeam] = useState<Array<{
    id: string;
    name: string;
    role: string;
    image: string;
    linkedin: string;
    order?: number;
  }>>([]);

  // Fetch team members in real-time
  useEffect(() => {
    const teamRef = collection(db, 'teamMembers');
    const q = query(teamRef, orderBy('order', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const members = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Array<{
        id: string;
        name: string;
        role: string;
        image: string;
        linkedin: string;
        order?: number;
      }>;
      setTeam(members);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section - Full Screen Immersive */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/10 z-10" />
          <video 
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto px-4 lg:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-orange-500 via-white to-green-500 bg-clip-text text-transparent">{t('about.hero.title1')}</span><span className="text-white" style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>{t('about.hero.title2')}</span>
            </h1>
            <p className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-8 font-semibold" style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
              {t('about.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="pt-16 md:pt-20 pb-12 md:pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('about.ourStory.title')}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.ourStory.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-16">
            {/* Story Paragraph 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="font-heading text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t('about.ourStory.founded.title')}
                </h3>
                <p className="text-base text-gray-700 leading-relaxed mb-3">
                  {t('about.ourStory.founded.para1')}
                </p>
                <p className="text-base text-gray-700 leading-relaxed">
                  {t('about.ourStory.founded.para2')}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="relative h-64 rounded-xl overflow-hidden shadow-xl"
              >
                <img 
                  src={storyImages.storyImageUrl1} 
                  alt="Hyderabad cityscape"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Story Paragraph 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="relative h-64 rounded-xl overflow-hidden shadow-xl lg:order-first"
              >
                <img 
                  src={storyImages.storyImageUrl2} 
                  alt="Happy customer receiving package"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="lg:order-last"
              >
                <h3 className="font-heading text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t('about.ourStory.growth.title')}
                </h3>
                <p className="text-base text-gray-700 leading-relaxed mb-3">
                  {t('about.ourStory.growth.para1')}
                </p>
                <p className="text-base text-gray-700 leading-relaxed">
                  {t('about.ourStory.growth.para2')}
                </p>
              </motion.div>
            </div>

            {/* Story Paragraph 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="font-heading text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {t('about.ourStory.today.title')}
                </h3>
                <p className="text-base text-gray-700 leading-relaxed mb-3">
                  {t('about.ourStory.today.para1')}
                </p>
                <p className="text-base text-gray-700 leading-relaxed">
                  {t('about.ourStory.today.para2')}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
                className="relative h-64 rounded-xl overflow-hidden shadow-xl"
              >
                <img 
                  src={storyImages.storyImageUrl3} 
                  alt="Indian spices and products"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('about.values.title')}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className={`h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${value.gradient}`}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-6 w-6 ${value.iconColor}`} />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-gray-900 mb-3">
                        {value.title}
                      </h3>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section - Animated Counters */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => {
              const { count, elementRef } = useCountUp({ end: stat.value, duration: 2500 });
              const Icon = stat.icon;
              
              return (
                <motion.div
                  key={index}
                  ref={elementRef as any}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 rounded-2xl border-3 flex items-center justify-center`} style={{
                    borderColor: stat.color.includes('orange') ? '#EA580C' : 
                                 stat.color.includes('blue') ? '#3B82F6' :
                                 stat.color.includes('purple') ? '#A855F7' :
                                 stat.color.includes('green') ? '#10B981' : '#000'
                  }}>
                    <Icon className={`h-7 w-7 md:h-8 md:w-8`} style={{
                      color: stat.color.includes('orange') ? '#EA580C' : 
                             stat.color.includes('blue') ? '#3B82F6' :
                             stat.color.includes('purple') ? '#A855F7' :
                             stat.color.includes('green') ? '#10B981' : '#000'
                    }} />
                  </div>
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                    {stat.format ? stat.format(count) : count}{stat.suffix}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('about.journey.title')}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.journey.subtitle')}
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400 via-orange-500 to-yellow-400 transform md:-translate-x-1/2 hidden sm:block" />

              <div className="space-y-10">
                {milestones.map((milestone, index) => {
                  const Icon = milestone.icon;
                  const isEven = index % 2 === 0;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.6 }}
                      className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                    >
                      {/* Year Badge */}
                      <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 z-10 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                          <span className="text-sm font-bold text-gray-900">{milestone.year}</span>
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className={`w-full md:w-5/12 ml-20 md:ml-0 ${isEven ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
                                  {milestone.title}
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {milestone.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach Visualization */}
      <section className="relative w-full overflow-hidden bg-gray-900">
        <div 
          className="relative w-full aspect-video"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/doxwyrp8n/image/upload/v1760546160/pxmrmzfckhy9pexj8fto.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Slight gradient overlay (20% opacity) */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/100 via-transparent to-white/20" />
          
          <div className="container mx-auto px-4 lg:px-6 relative z-10 h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                {t('about.hero.worldToIndia')}
              </h2>
              <p className="text-base md:text-lg text-white max-w-2xl mx-auto" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
                {t('about.hero.worldToIndiaSubtitle')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Venkat Express */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('about.advantages.title')}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.advantages.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-gray-900 mb-2">
                        {advantage.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {advantage.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('about.team.title')}
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-5 text-center">
                    <h3 className="font-heading text-lg font-bold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{member.role}</p>
                    <a 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="text-xs font-medium">{t('about.team.connect')}</span>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&h=600&fit=crop" 
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 lg:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {t('about.cta.title1')}<br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {t('about.cta.title2')}
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              {t('about.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="default" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-8 py-5 text-base">
                  {t('about.cta.shopBtn')}
                </Button>
              </Link>
              <Link to="/services">
                <Button size="default" className="bg-white text-black hover:bg-yellow-400 hover:text-black font-semibold px-8 py-5 text-base border-2 border-white">
                  {t('about.cta.quoteBtn')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
