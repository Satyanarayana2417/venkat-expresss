import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { ProductShowcase } from '@/components/ProductShowcase';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Hero />

      {/* Featured Products with Carousels */}
      <FeaturedProducts />

      {/* Sourcing CTA Banner - Desktop Only */}
      <section className="hidden md:block container mx-auto px-4 lg:px-6 py-4">
        <div className="w-full bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[180px]">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {t('home.cantFind')}
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {t('home.sourcingDescription')}
            </p>
          </div>
          <Link to="/services">
            <Button 
              variant="outline" 
              className="bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-transparent hover:border-orange-600 hover:text-orange-700 font-semibold px-6 py-5 text-sm whitespace-nowrap transition-all duration-300"
            >
              {t('home.makeRequest')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Product Showcase - Categories and Featured Products */}
      <ProductShowcase />

      {/* Sourcing CTA Banner - Mobile Only (After Flash Deals on Decor) */}
      <section className="md:hidden container mx-auto px-4 lg:px-6 py-4">
        <div className="w-full bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[180px]">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {t('home.cantFind')}
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              {t('home.sourcingDescription')}
            </p>
          </div>
          <Link to="/services">
            <Button 
              variant="outline" 
              className="bg-transparent border-2 border-orange-500 text-orange-600 hover:bg-transparent hover:border-orange-600 hover:text-orange-700 font-semibold px-6 py-5 text-sm whitespace-nowrap transition-all duration-300"
            >
              {t('home.makeRequest')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">{t('home.howItWorks')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.howItWorksDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">{t('home.step1Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('home.step1Description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">{t('home.step2Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('home.step2Description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">{t('home.step3Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('home.step3Description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">{t('home.step4Title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('home.step4Description')}
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10 bg-transparent rounded-none">
                {t('home.learnMore')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
