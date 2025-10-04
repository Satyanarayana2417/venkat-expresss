import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Award, Globe, Package, Users, Heart, TrendingUp, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const stats = [
    { icon: Package, label: 'Shipments Delivered', value: '10,000+' },
    { icon: Globe, label: 'Countries Served', value: '50+' },
    { icon: Users, label: 'Happy Customers', value: '5,000+' },
    { icon: Award, label: 'Years of Experience', value: '10+' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Reliability',
      description: 'We treat every shipment as if it were our own, ensuring safe delivery and maintaining the highest standards of integrity.',
    },
    {
      icon: Clock,
      title: 'Speed & Efficiency',
      description: 'Time is precious. We optimize every step of the process to ensure your products reach you as quickly as possible.',
    },
    {
      icon: Heart,
      title: 'Customer-Centric',
      description: 'Your satisfaction is our success. We go above and beyond to exceed expectations and build lasting relationships.',
    },
    {
      icon: TrendingUp,
      title: 'Continuous Innovation',
      description: 'We embrace technology and continuously improve our services to provide the best shipping experience.',
    },
  ];

  const milestones = [
    {
      year: '2014',
      title: 'Founded',
      description: 'Venkat Express was established with a vision to connect India with the world.',
    },
    {
      year: '2016',
      title: 'Expansion',
      description: 'Expanded services to 20+ countries across North America, Europe, and Asia.',
    },
    {
      year: '2018',
      title: 'Specialization',
      description: 'Became experts in shipping food items and decorative products internationally.',
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Launched online platform for seamless ordering and tracking.',
    },
    {
      year: '2024',
      title: 'Today',
      description: 'Serving 50+ countries with 10,000+ successful deliveries and growing.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              About Venkat Express
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Bridging continents, delivering culture. For over 10 years, we've been connecting people across the world with authentic Indian products and reliable international shipping.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Venkat Express was born from a simple observation: people living abroad deeply miss the authentic products and flavors of India. Whether it's a special spice blend, traditional decorative items, or handcrafted artifacts, these connections to home are irreplaceable.
                </p>
                <p>
                  What started as a small operation in Hyderabad has grown into a trusted international courier service, specializing in food items and decorative products. Over the past 10+ years, we've perfected the art of international shipping, navigating complex customs regulations and ensuring products arrive in perfect condition.
                </p>
                <p>
                  Our expertise lies in understanding the unique challenges of shipping food and decorative items internationally. From proper packaging to customs documentation, we handle every detail so you can enjoy authentic Indian products anywhere in the world.
                </p>
                <p>
                  Today, we're proud to serve customers in over 50 countries, delivering not just products, but pieces of home, cultural heritage, and cherished memories.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 flex items-center justify-center shadow-premium-lg">
                <div className="text-center text-primary-foreground">
                  <Package className="h-24 w-24 mx-auto mb-6 opacity-90" />
                  <h3 className="font-heading text-2xl font-bold mb-2">
                    10+ Years
                  </h3>
                  <p className="text-lg opacity-90">
                    of Excellence in International Shipping
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 lg:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Our Values
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These core principles guide everything we do at Venkat Express
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-premium-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Our Journey
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A decade of growth, innovation, and customer satisfaction
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <Card className="md:ml-20">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="absolute left-8 -translate-x-1/2 w-16 h-16 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center shadow-lg hidden md:flex">
                            {milestone.year}
                          </div>
                          <div className="md:hidden w-16 h-16 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center flex-shrink-0">
                            {milestone.year}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-heading text-xl font-semibold mb-2">
                              {milestone.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialization Section */}
      <section className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 text-orange-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-1">Food Items</h4>
                  <p className="text-sm text-muted-foreground">Spices, snacks, sweets & more</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-1">Decorative</h4>
                  <p className="text-sm text-muted-foreground">Artifacts, textiles & crafts</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200 col-span-2">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold mb-1">Expert Handling</h4>
                  <p className="text-sm text-muted-foreground">
                    Specialized packaging, customs expertise, and temperature control
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              Our Specialization
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We've spent over a decade perfecting the art of shipping food items and decorative products internationally. These categories require special expertise:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span><strong>Food Items:</strong> Proper packaging to maintain freshness, compliance with international food regulations, and temperature-sensitive handling.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span><strong>Decorative Products:</strong> Careful handling of fragile items, protection against damage, and expertise in shipping handcrafted artifacts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-1">•</span>
                  <span><strong>Customs Expertise:</strong> Navigate complex international regulations and documentation requirements seamlessly.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Experience the Venkat Express Difference
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their international shipping needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Browse Products
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent-hover">
                View Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
