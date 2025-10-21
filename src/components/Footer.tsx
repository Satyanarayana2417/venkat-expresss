import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-[#101B2D] text-white mt-20">
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 font-heading font-bold text-xl mb-4">
              <Package className="h-6 w-6 text-accent" />
              <span>Venkat Express</span>
            </Link>
            <p className="text-sm text-white/70">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="text-white/80 hover:text-accent transition-colors">{t('footer.products')}</Link></li>
              <li><Link to="/services" className="text-white/80 hover:text-accent transition-colors">{t('footer.services')}</Link></li>
              <li><Link to="/branch" className="text-white/80 hover:text-accent transition-colors">{t('footer.branch')}</Link></li>
              <li><Link to="/about" className="text-white/80 hover:text-accent transition-colors">{t('footer.aboutUs')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold mb-4">{t('footer.servicesTitle')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services#purchase" className="text-white/80 hover:text-accent transition-colors">{t('footer.purchaseOnBehalf')}</Link></li>
              <li><Link to="/services#shipping" className="text-white/80 hover:text-accent transition-colors">{t('footer.internationalShipping')}</Link></li>
              <li><Link to="/services#tracking" className="text-white/80 hover:text-accent transition-colors">{t('footer.packageTracking')}</Link></li>
              <li><Link to="/services#customs" className="text-white/80 hover:text-accent transition-colors">{t('footer.customsSupport')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold mb-4">{t('footer.contactUs')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-white/80">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{t('footer.location')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:info@venkatexpress.com" className="text-white/80 hover:text-accent transition-colors">
                  {t('footer.email')}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                <a href="tel:+91XXXXXXXXXX" className="text-white/80 hover:text-accent transition-colors">
                  {t('footer.phone')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright')}</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/privacy" className="hover:text-accent transition-colors">{t('footer.privacyPolicy')}</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">{t('footer.termsOfService')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
