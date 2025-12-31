'use client';

import { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showCount?: boolean;
  ratingCount?: number;
}

export default function StarRating({ 
  rating, 
  maxRating = 5, 
  size = 'md',
  interactive = false,
  onRate,
  showCount = false,
  ratingCount = 0
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const sizeClasses = {
    sm: 'fs-6',
    md: 'fs-5',
    lg: 'fs-4'
  };
  
  const handleStarClick = (value: number) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };
  
  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoveredRating(value);
    }
  };
  
  const handleMouseLeave = () => {
    if (interactive) {
      setHoveredRating(0);
    }
  };
  
  const displayRating = hoveredRating || rating;
  
  return (
    <div className="d-inline-flex align-items-center gap-1">
      <div className="d-flex gap-1">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(displayRating);
          
          return (
            <span
              key={index}
              className={`${sizeClasses[size]} ${interactive ? 'cursor-pointer' : ''}`}
              style={{ 
                color: isFilled ? '#ffc107' : '#dee2e6',
                cursor: interactive ? 'pointer' : 'default',
                transition: 'color 0.2s'
              }}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
            >
              {isFilled ? <FaStar /> : <FaRegStar />}
            </span>
          );
        })}
      </div>
      
      {showCount && ratingCount > 0 && (
        <small className="text-muted">
          ({ratingCount})
        </small>
      )}
      
      {rating > 0 && !showCount && (
        <small className="text-muted ms-1">
          {rating.toFixed(1)}
        </small>
      )}
    </div>
  );
}
