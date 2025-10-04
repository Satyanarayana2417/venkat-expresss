import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Package, Plane, ShoppingBag, Truck, Shield, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Services = () => {
  const services = [
    {
      icon: ShoppingBag,
      title: 'We Buy & Ship',
      subtitle: 'Service Type 1',
      description: 'Select products from our catalog or request specific items. We purchase authentic products from trusted vendors across India and ship them to you anywhere in the world.',
      features: [
        'Access to authentic Indian products',
        'Quality verification before shipping',
        'Secure packaging and handling',
        'International shipping with tracking',
        'Customs documentation assistance',
      ],
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Truck,
      title: 'You Provide, We Ship',
      subtitle: 'Service Type 2',
      description: 'Already have products? Bring them to our Hyderabad branch or schedule a pickup. We handle all international shipping logistics, customs, and delivery to your doorstep.',
      features: [
        'Pickup service available in Hyderabad',
        'Professional packaging standards',
        'Insurance options available',
        'Real-time shipment tracking',
        'Dedicated customer support',
      ],
      color: 'from-orange-500 to-orange-600',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Your Service',
      description: 'Select whether you want us to purchase products for you, or if you have products ready to ship.',
    },
    {
      number: '02',
      title: 'Provide Details',
      description: 'Share product details or drop off/schedule pickup of your items at our Hyderabad branch.',
    },
    {
      number: '03',
      title: 'We Handle Everything',
      description: 'Our team manages procurement (if needed), quality checks, secure packaging, and customs paperwork.',
    },
    {
      number: '04',
      title: 'Track & Receive',
      description: 'Monitor your shipment in real-time and receive your products safely at your international address.',
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
              Our Services
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Two flexible service models designed to bring authentic Indian products to you, wherever you are in the world
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Types */}
      <section className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-premium-lg transition-all duration-300 border-2">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="mb-2">
                    <Badge className="mb-2 bg-muted text-muted-foreground">
                      {service.subtitle}
                    </Badge>
                  </div>
                  
                  <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                    {service.title}
                  </h2>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/products">
                    <Button className="w-full gradient-gold hover:shadow-gold">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process ensures your products reach you safely and efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="text-6xl font-bold text-accent/20 mb-4">
                      {step.number}
                    </div>
                    <h3 className="font-heading text-xl font-semibold mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 lg:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Why Choose Venkat Express?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                Trusted & Reliable
              </h3>
              <p className="text-sm text-muted-foreground">
                10+ years of experience in international shipping with thousands of satisfied customers worldwide
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                Specialized Expertise
              </h3>
              <p className="text-sm text-muted-foreground">
                Experts in shipping food items and decorative products with proper handling and documentation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">
                Transparent Pricing
              </h3>
              <p className="text-sm text-muted-foreground">
                No hidden fees. Clear pricing structure with detailed quotes before you commit
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Browse our products or contact us to discuss your shipping needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Browse Products
              </Button>
            </Link>
            <Link to="/branch">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent-hover">
                Visit Our Branch
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Import Badge component
import { Badge } from '@/components/ui/badge';

export default Services;
