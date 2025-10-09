import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { ProductShowcase } from '@/components/ProductShowcase';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const Home = () => {
  return (
    <div>
      <Hero />

      {/* Featured Products with Carousels */}
      <FeaturedProducts />

      {/* Sourcing CTA Banner */}
      <section className="container mx-auto px-4 lg:px-6 py-4">
        <div className="w-full bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[180px]">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Can't find it? Let us source it for you.
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Looking for something specific from India? Our sourcing experts can help you find authentic products and deliver them worldwide.
            </p>
          </div>
          <Link to="/services">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-5 text-sm whitespace-nowrap">
              Make a Request →
            </Button>
          </Link>
        </div>
      </section>

      {/* Product Showcase - Categories and Featured Products */}
      <ProductShowcase />

      {/* Services Overview */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to get authentic Indian products delivered anywhere in the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Browse & Select</h3>
              <p className="text-sm text-muted-foreground">
                Choose from our curated collection or request specific items you want
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">We Purchase</h3>
              <p className="text-sm text-muted-foreground">
                Our team sources authentic products from trusted vendors in India
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Global Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Secure packaging and reliable shipping to your doorstep with tracking
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button size="lg" className="gradient-gold hover:shadow-gold">
                Learn More About Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Branch Highlight */}
      <section className="container mx-auto px-4 lg:px-6 py-16">
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 shadow-premium-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                Visit Our Hyderabad Branch
              </h2>
              <p className="text-primary-foreground/90 mb-6">
                Schedule a pickup or visit our branch for in-person assistance. Our team is ready to help with all your shipping and purchasing needs.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-accent mt-0.5" />
                  <span>In-person consultation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-accent mt-0.5" />
                  <span>Package inspection & verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-5 w-5 text-accent mt-0.5" />
                  <span>Flexible pickup scheduling</span>
                </li>
              </ul>
              <Link to="/branch">
                <Button variant="outline" size="lg" className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  View Branch Details
                </Button>
              </Link>
            </div>
            <div className="bg-primary-foreground/10 rounded-xl p-6 backdrop-blur-sm border border-primary-foreground/20">
              <h3 className="font-heading font-semibold text-xl mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-medium">Address:</span><br />
                  Hyderabad, Telangana, India
                </p>
                <p>
                  <span className="font-medium">Hours:</span><br />
                  Mon-Sat: 9:00 AM - 7:00 PM<br />
                  Sunday: Closed
                </p>
                <p>
                  <span className="font-medium">Phone:</span><br />
                  +91 XXXX XXXXXX
                </p>
                <p>
                  <span className="font-medium">Email:</span><br />
                  hyderabad@venkatexpress.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
