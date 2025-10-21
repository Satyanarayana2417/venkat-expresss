import { HeroCard } from './HeroCard';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="container mx-auto px-4 lg:px-6 pt-2 pb-2">
      {/* Masonry Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 md:gap-6">
        
        {/* Left Column - 3 cards stacked */}
        <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-6 md:gap-6">
          {/* Card 1 - Top Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="h-[220px] w-full shrink-0 md:h-[280px]"
          >
            <HeroCard
              title={t('hero.shopFromIndia')}
              linkText={t('hero.learnMore')}
              linkUrl="/services"
              image="https://i.ibb.co/xq9sCMrW/IMG-20250919-183525.webp"
              textColor="text-white"
              smallText={true}
            />
          </motion.div>

          {/* Card 4 - Mid Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="h-[220px] w-full shrink-0 md:h-[460px]"
          >
            <HeroCard
              title={t('hero.shopTopCategories')}
              linkText={t('hero.shopAll')}
              linkUrl="/products"
              image="https://artisanhd.com/wp-content/uploads/2017/06/Cluster4-Family.jpg"
              textColor="text-white"
              className="h-full"
              smallText={true}
            />
          </motion.div>

          {/* Card 9 - Bottom Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="hidden md:block h-[220px] w-full shrink-0 md:h-[210px]"
          >
            <HeroCard
              title={t('hero.newMangoPickle')}
              linkText={t('hero.shopNow')}
              linkUrl="/products"
              image="https://images.pexels.com/photos/28645470/pexels-photo-28645470/free-photo-of-rustic-kitchen-scene-with-preserved-vegetables-in-jars.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              textColor="text-white"
              smallText={true}
            />
          </motion.div>
        </div>

        {/* Center and Right Columns */}
        <div className="md:col-span-2 lg:col-span-9 flex flex-col md:flex-row gap-6 md:gap-6">
          {/* Center Column - Main cards */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 auto-rows-[190px]">
            {/* Card 2 - Large Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="h-[220px] w-full shrink-0 md:col-span-2 md:row-span-2 md:h-auto"
            >
              <HeroCard
                title=""
                buttonText=""
                buttonUrl="/services"
                tag=""
                image="/hero-center-card.png"
                textColor="text-white"
                className="h-full w-full"
                noGradient={true}
                imagePosition="left-center"
              />
            </motion.div>

            {/* Card 6 - Flash Sale */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="h-[220px] w-full shrink-0 md:h-[290px]"
            >
              <HeroCard
                title={t('hero.upToOff')}
                tag=""
                linkText={t('hero.shopNow')}
                 image="https://t3.ftcdn.net/jpg/01/05/94/58/360_F_105945852_XrwXKqIJAXkgz3fBFrXajFZ3nmPNmIo9.jpg"
                linkUrl="/products"
                bgColor="bg-accent/10"
                textColor="text-white"
                noGradient={true}
              />
            </motion.div>

            {/* Card 7 - Festival Gift Catalog */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="hidden md:block h-[220px] w-full shrink-0 md:h-[290px]"
            >
              <HeroCard
                title=""
                linkText=""
                linkUrl="/products"
                image="https://i.ibb.co/Q7PMmhfw/IMG-20250911-130316.webp"
                textColor="text-white"
              />
            </motion.div>

            {/* Card 10 - Wide Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="hidden md:block h-[220px] w-full shrink-0 md:col-span-2 md:h-[250px] md:mt-24"
            >
              <HeroCard
                title={t('hero.cantFindSource')}
                buttonText={t('hero.makeRequest')}
                buttonUrl="/services"
                textColor="text-foreground"
                useYellowGradient={true}
              />
            </motion.div>
          </div>

          {/* Right Column - 3 cards stacked */}
                    {/* Right Column - Hidden on mobile, visible on larger screens */}
          <div className="hidden md:flex w-full lg:w-72 flex-col gap-6 md:gap-6">

            {/* Card 3 - Top Right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="h-[220px] w-full shrink-0 md:h-[250px]"
            >
              <HeroCard
                title={t('hero.hotNewArrivals')}
                linkText={t('hero.shopNow')}
                linkUrl="/products"
                image="https://images.unsplash.com/photo-1497990571654-77aa8ec36038?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJyYXNzfGVufDB8fDB8fHww"
                textColor="text-white"
                smallText={true}
              />
            </motion.div>

            {/* Card 5 - Mid Right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="h-[220px] w-full shrink-0 md:h-[250px]"
            >
              <HeroCard
                title={t('hero.newArtisanCollection')}
                linkText={t('hero.shopNow')}
                linkUrl="/products"
                image="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80"
                textColor="text-white"
                smallText={true}
              />
            </motion.div>

            {/* Card 8 - Indian Sweets - Bottom Right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="h-[220px] w-full shrink-0 md:flex-1"
            >
              <HeroCard
                title={t('hero.indianSweets')}
                tag=""
                linkText={t('hero.shopNow')}
                linkUrl="/products"
                image="https://mithaicana.com/cdn/shop/files/collection-of-indian-sweet-boxes-and-gift-hampers.jpg?v=1715144138&width=1500"
                textColor="text-white"
                className="h-full"
                smallText={true}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
