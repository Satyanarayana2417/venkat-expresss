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
}: HeroCardProps) => {
  const CardContent = () => (
    <div
      className={cn(
        'relative h-full rounded-xl overflow-hidden shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg group',
        bgColor,
        className
      )}
    >
      {image && (
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}
      
      <div className={cn('relative h-full p-6 flex flex-col justify-end', textColor)}>
        {tag && (
          <Badge className="mb-3 w-fit bg-accent text-accent-foreground border-0 font-medium">
            {tag}
          </Badge>
        )}
        
        <h3 className="font-heading font-bold text-xl md:text-2xl mb-4 leading-tight">
          {title}
        </h3>
        
        {buttonText && (
          <Link to={buttonUrl}>
            <Button 
              className="gradient-gold hover:shadow-gold w-fit transition-all duration-300"
              size="lg"
            >
              {buttonText}
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
