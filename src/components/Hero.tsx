import { HeroCard } from './HeroCard';
import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section className="container mx-auto px-4 lg:px-6 py-8">
      {/* Masonry Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 auto-rows-[200px]">
        
        {/* Row 1 */}
        {/* Card 1 - Top Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 lg:col-span-3 row-span-1"
        >
          <HeroCard
            title="Shop from India, we deliver to your doorstep"
            linkText="Learn more"
            linkUrl="/services"
            image="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&q=80"
            textColor="text-white"
          />
        </motion.div>

        {/* Card 2 - Large Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 lg:col-span-6 row-span-2"
        >
          <HeroCard
            title="Global Shipping in as fast as 5-7 days"
            buttonText="Get a Quote"
            buttonUrl="/services"
            tag="⚡️ Express Shipping"
            image="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&q=80"
            textColor="text-white"
            className="h-full"
          />
        </motion.div>

        {/* Card 3 - Top Right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 lg:col-span-3 row-span-1"
        >
          <HeroCard
            title="Hot New Arrivals in Decor"
            linkText="Shop now"
            linkUrl="/products"
            image="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80"
            textColor="text-white"
          />
        </motion.div>

        {/* Row 2 */}
        {/* Card 4 - Mid Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-2 lg:col-span-3 row-span-2"
        >
          <HeroCard
            title="Shop Top Categories: Food & Decor"
            linkText="Shop All"
            linkUrl="/products"
            image="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80"
            textColor="text-white"
            className="h-full"
          />
        </motion.div>

        {/* Card 5 - Mid Middle Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="md:col-span-2 lg:col-span-3 row-span-1"
        >
          <HeroCard
            title="New Artisan Collection"
            linkText="Shop now"
            linkUrl="/products"
            image="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80"
            textColor="text-white"
          />
        </motion.div>

        {/* Card 6 - Flash Sale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="md:col-span-2 lg:col-span-3 row-span-1"
        >
          <HeroCard
            title="Up to 30% Off"
            tag="Flash Deals"
            linkText="Shop now"
            linkUrl="/products"
            bgColor="bg-accent/10"
            textColor="text-foreground"
          />
        </motion.div>

        {/* Card 7 - Festival Gift Catalog */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="md:col-span-2 lg:col-span-3 row-span-1"
        >
          <HeroCard
            title="Introducing our Festival Gift Catalog"
            linkText="Shop now"
            linkUrl="/products"
            image="https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80"
            textColor="text-white"
          />
        </motion.div>

        {/* Card 8 - Indian Sweets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="md:col-span-2 lg:col-span-3 row-span-2"
        >
          <HeroCard
            title="Authentic Indian Sweets, Delivered Fresh"
            tag="Express Delivery"
            linkText="Shop now"
            linkUrl="/products"
            image="https://images.unsplash.com/photo-1606763750531-55f94e0498f3?w=800&q=80"
            textColor="text-white"
            className="h-full"
          />
        </motion.div>

        {/* Row 3 */}
        {/* Card 9 - Mango Pickle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="md:col-span-2 lg:col-span-3 row-span-1"
        >
          <HeroCard
            title="New: Malabar Black Peppercorns"
            linkText="Shop now"
            linkUrl="/products"
            image="https://images.unsplash.com/photo-1596040033229-a0b3b684e2e8?w=800&q=80"
            textColor="text-white"
          />
        </motion.div>

        {/* Card 10 - Wide Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="md:col-span-4 lg:col-span-6 row-span-1"
        >
          <HeroCard
            title="Can't find it? Let us source it for you."
            buttonText="Make a Request"
            buttonUrl="/services"
            bgColor="bg-accent/20"
            textColor="text-foreground"
          />
        </motion.div>
      </div>
    </section>
  );
};
