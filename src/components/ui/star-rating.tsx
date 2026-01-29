import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 16,
  interactive = true,
  className
}) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-1",
        className
      )}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            "cursor-pointer transition-colors",
            i < rating 
              ? "fill-yellow-400 text-yellow-400" 
              : "fill-none text-gray-300",
            interactive && "hover:text-yellow-400"
          )}
          onClick={() => interactive && onRatingChange?.(i + 1)}
        />
      ))}
    </div>
  );
};

export default StarRating;
