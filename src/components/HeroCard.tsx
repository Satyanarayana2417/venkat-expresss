import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface HeroCardProps {
  title: string;
  linkText?: string;
  linkUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  tag?: string;
  image?: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
  noGradient?: boolean;
  smallText?: boolean;
  useYellowGradient?: boolean;
  imagePosition?: 'left' | 'center' | 'left-center';
}

export const HeroCard = ({
  title,
  linkText,
  linkUrl = '#',
  buttonText,
  buttonUrl = '#',
  tag,
  image,
  className,
  bgColor = 'bg-card',
  textColor = 'text-card-foreground',
  noGradient = false,
  smallText = false,
  useYellowGradient = false,
  imagePosition = 'center',
}: HeroCardProps) => {
  const getImagePositionClass = () => {
    if (imagePosition === 'left') return 'object-left';
    if (imagePosition === 'left-center') return 'object-[35%]';
    return 'object-cover';
  };
  const CardContent = () => (
    <div
      className={cn(
        'relative h-full rounded-xl overflow-hidden shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg group',
        useYellowGradient 
          ? 'bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 border border-yellow-200'
          : 'border border-gray-100 hover:border-gray-200',
        !useYellowGradient && bgColor,
        className
      )}
    >
      {image && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className={cn(
              "w-full h-full object-cover transition-transform duration-300 group-hover:scale-105",
              getImagePositionClass()
            )}
          />
          {!noGradient && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          )}
        </div>
      )}
      
      <div className={cn('relative h-full p-6 flex flex-col justify-end', textColor)}>
        {tag && (
          <Badge className="mb-3 w-fit bg-accent text-accent-foreground border-0 font-medium">
            {tag}
          </Badge>
        )}
        
        <h3 className={cn(
          "font-heading font-bold mb-4 leading-tight",
          smallText ? "text-base md:text-lg" : "text-xl md:text-2xl"
        )}>
          {title}
        </h3>
        
        {buttonText && (
          <Link to={buttonUrl}>
            <Button 
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 w-fit transition-all duration-300 inline-flex items-center gap-2"
              size="lg"
            >
              {buttonText}
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Button>
          </Link>
        )}
        
        {linkText && (
          <Link 
            to={linkUrl}
            className="font-semibold hover:underline inline-flex items-center gap-2 w-fit transition-all duration-300"
          >
            {linkText}
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        )}
      </div>
    </div>
  );

  return <CardContent />;
};
