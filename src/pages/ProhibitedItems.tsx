import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ShieldAlert, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProhibitedItems = () => {
  const navigate = useNavigate();

  // Category data structure with items and their images
  const prohibitedCategories = [
    {
      title: '🚫 Dangerous / Hazardous Goods',
      iconColor: 'text-red-600',
      gradient: 'from-red-50 to-orange-50',
      items: [
        { name: 'Explosives', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop&q=80' },
        { name: 'Gas Cylinders', image: 'https://images.unsplash.com/photo-1620207418302-439b387441b0?w=400&h=400&fit=crop&q=80' },
        { name: 'Paints', image: 'https://images.unsplash.com/photo-1562259929-3fbb51c26632?w=400&h=400&fit=crop&q=80' },
        { name: 'Firearms', image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=400&fit=crop&q=80' },
        { name: 'Ammunition', image: 'https://images.unsplash.com/photo-1516131206008-dd041a9764fd?w=400&h=400&fit=crop&q=80' },
        { name: 'Flammable Liquids', image: 'https://images.unsplash.com/photo-1582719366943-2e0b4eb7ab80?w=400&h=400&fit=crop&q=80' },
        { name: 'Toxic Substances', image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=400&h=400&fit=crop&q=80' },
        { name: 'Corrosive Materials', image: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=400&h=400&fit=crop&q=80' },
        { name: 'Radioactive Items', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop&q=80' },
        { name: 'Compressed Gases', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=400&fit=crop&q=80' }
      ]
    },
    {
      title: '🚫 Illegal / Restricted Substances',
      iconColor: 'text-purple-600',
      gradient: 'from-purple-50 to-pink-50',
      items: [
        { name: 'Narcotics', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&q=80' },
        { name: 'Cannabis Products', image: 'https://images.unsplash.com/photo-1605372924554-98ac6bd8a384?w=400&h=400&fit=crop&q=80' },
        { name: 'Alcoholic Beverages', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop&q=80' },
        { name: 'Tobacco Products', image: 'https://images.unsplash.com/photo-1594473501270-21e2c6629a52?w=400&h=400&fit=crop&q=80' },
        { name: 'Prescription Medicines', image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop&q=80' },
        { name: 'E-cigarettes', image: 'https://images.unsplash.com/photo-1559664228-88c92175802c?w=400&h=400&fit=crop&q=80' },
        { name: 'Vaping Products', image: 'https://images.unsplash.com/photo-1606571543707-b8ab7a3e746e?w=400&h=400&fit=crop&q=80' },
        { name: 'Controlled Substances', image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop&q=80' }
      ]
    },
    {
      title: '🚫 Perishable & Biological Items',
      iconColor: 'text-green-600',
      gradient: 'from-green-50 to-emerald-50',
      items: [
        { name: 'Rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&q=80' },
        { name: 'Salt', image: 'https://images.unsplash.com/photo-1598511757337-fe2cafc31ba1?w=400&h=400&fit=crop&q=80' },
        { name: 'Fresh Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop&q=80' },
        { name: 'Fresh Vegetables', image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&h=400&fit=crop&q=80' },
        { name: 'Meat', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop&q=80' },
        { name: 'Dairy Products', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop&q=80' },
        { name: 'Live Animals', image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=400&h=400&fit=crop&q=80' },
        { name: 'Live Plants', image: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=400&h=400&fit=crop&q=80' },
        { name: 'Seeds', image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=400&h=400&fit=crop&q=80' },
        { name: 'Biological Specimens', image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=400&fit=crop&q=80' }
      ]
    },
    {
      title: '🚫 High-Value & Restricted Items',
      iconColor: 'text-yellow-600',
      gradient: 'from-yellow-50 to-amber-50',
      items: [
        { name: 'Currency Notes', image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=400&h=400&fit=crop&q=80' },
        { name: 'Coins', image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&h=400&fit=crop&q=80' },
        { name: 'Precious Metals', image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=400&fit=crop&q=80' },
        { name: 'Gold', image: 'https://images.unsplash.com/photo-1610375228352-622d3aaa9e08?w=400&h=400&fit=crop&q=80' },
        { name: 'Silver', image: 'https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=400&h=400&fit=crop&q=80' },
        { name: 'Diamonds', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop&q=80' },
        { name: 'Jewelry (High-Value)', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop&q=80' },
        { name: 'Negotiable Instruments', image: 'https://images.unsplash.com/photo-1554224311-beee460ae6ba?w=400&h=400&fit=crop&q=80' },
        { name: 'Bearer Bonds', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=400&fit=crop&q=80' }
      ]
    },
    {
      title: '🚫 Documents & Data Restrictions',
      iconColor: 'text-blue-600',
      gradient: 'from-blue-50 to-cyan-50',
      items: [
        { name: 'Passports', image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&h=400&fit=crop&q=80' },
        { name: 'Government IDs', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=400&fit=crop&q=80' },
        { name: 'Credit/Debit Cards', image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=400&h=400&fit=crop&q=80' },
        { name: 'ATM Cards', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop&q=80' },
        { name: 'SIM Cards', image: 'https://images.unsplash.com/photo-1591290619762-c588a3706cef?w=400&h=400&fit=crop&q=80' },
        { name: 'Hard Drives with Data', image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=400&fit=crop&q=80' },
        { name: 'Confidential Documents', image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=400&fit=crop&q=80' },
        { name: 'Legal Certificates', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=400&fit=crop&q=80' }
      ]
    },
    {
      title: '🚫 Miscellaneous Prohibited Items',
      iconColor: 'text-gray-600',
      gradient: 'from-gray-50 to-slate-50',
      items: [
        { name: 'Pornographic Material', image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=400&fit=crop&q=80' },
        { name: 'Counterfeit Goods', image: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=400&h=400&fit=crop&q=80' },
        { name: 'Pirated Products', image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=400&fit=crop&q=80' },
        { name: 'Aerosols', image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop&q=80' },
        { name: 'Perfumes (Large Qty)', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&q=80' },
        { name: 'Batteries (Loose)', image: 'https://images.unsplash.com/photo-1609315067155-77445ea2d704?w=400&h=400&fit=crop&q=80' },
        { name: 'Lighters', image: 'https://images.unsplash.com/photo-1606822725672-9c5c33220b6c?w=400&h=400&fit=crop&q=80' },
        { name: 'Matches', image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&h=400&fit=crop&q=80' },
        { name: 'Sharp Objects', image: 'https://images.unsplash.com/photo-1593117022155-7eacc7644da5?w=400&h=400&fit=crop&q=80' },
        { name: 'Weapons', image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=400&h=400&fit=crop&q=80' },
        { name: 'Antiques', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=400&fit=crop&q=80' },
        { name: 'Ivory Products', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop&q=80' },
        { name: 'Animal Products', image: 'https://images.unsplash.com/photo-1535231540604-72e8fbaf8cdb?w=400&h=400&fit=crop&q=80' },
        { name: 'Hazardous Waste', image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&h=400&fit=crop&q=80' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Medium Red Background */}
      <section className="bg-red-500 text-white py-10 md:py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-4xl mx-auto relative">
            {/* Mobile Back Button - Positioned on the left */}
            <button
              onClick={() => navigate(-1)}
              className="md:hidden absolute -left-2 -top-2 flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            
            <h1 className="font-heading text-lg md:text-4xl lg:text-5xl font-bold mb-4 whitespace-nowrap">
              Prohibited & Restricted Items
            </h1>
            {/* Mobile text */}
            <p className="text-base md:hidden text-white/90 leading-relaxed">
              Items we cannot ship for safety and legal compliance.
            </p>
            {/* Desktop text */}
            <p className="hidden md:block text-base md:text-lg text-white/90 leading-relaxed">
              For the safety of our carriers and compliance with international law, please ensure your shipment does not contain any of the items listed below.
            </p>
          </div>
        </div>
      </section>

      {/* Categorized Items Section */}
      <section className="container mx-auto px-4 lg:px-6 py-12 md:py-16">
        <div className="space-y-12">
          {prohibitedCategories.map((category, categoryIndex) => {
            return (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="mb-6">
                  <h2 className="font-heading text-lg md:text-2xl lg:text-3xl font-bold text-gray-900">
                    {category.title}
                  </h2>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {category.items.map((item, itemIndex) => {
                    return (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: categoryIndex * 0.1 + itemIndex * 0.02 
                        }}
                        whileHover={{ scale: 1.05, y: -4 }}
                      >
                        <Card className="h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white group cursor-default overflow-hidden">
                          <CardContent className="p-0 flex flex-col h-full">
                            {/* Item Image */}
                            <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                loading="lazy"
                              />
                              {/* Overlay gradient for better text contrast */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            
                            {/* Item Name */}
                            <div className={`p-3 bg-gradient-to-br ${category.gradient}`}>
                              <h3 className="font-medium text-sm text-gray-900 leading-snug text-center">
                                {item.name}
                              </h3>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Important Disclaimer Section */}
      <section className="container mx-auto px-4 lg:px-6 py-8 md:py-12 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 shadow-lg">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                {/* Warning Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                
                {/* Disclaimer Text */}
                <div className="flex-1">
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    ⚠️ Important Notice
                  </h3>
                  <p className="text-base md:text-lg text-gray-800 leading-relaxed">
                    Each country and courier service has its own restricted/prohibited list. Some items (like lithium batteries, alcohol, or medicines) may require special approval or packaging, while others are completely banned.
                  </p>
                  <p className="text-sm md:text-base text-gray-700 mt-3 leading-relaxed">
                    <strong>Please contact our customer support team</strong> before shipping if you have any questions about specific items or requirements for your destination country.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 lg:px-6 py-8 md:py-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
                  Need Help Shipping Something?
                </h2>
                <p className="text-base md:text-lg text-gray-300 mb-6">
                  Our team of experts can help you navigate international shipping regulations and ensure your package arrives safely.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/services" 
                    className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Request a Quote
                  </a>
                  <a 
                    href="/products" 
                    className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold transition-all duration-300"
                  >
                    Browse Products
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
};

export default ProhibitedItems;
