"use client";

import React from "react";
import { TbStarFilled, TbStarHalfFilled } from "react-icons/tb";

export interface StarRatingProps {
  rating?: number;
  count?: number;
}

const StarRating = React.memo(
  ({ rating = 0, count = 0 }: StarRatingProps) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;

    return (
      <div className="dir-ltr text-secondary inline-flex items-center gap-1.5 text-xs sm:text-sm">
        <div className="flex items-center">
          {[...Array(fullStars)].map((_, i) => (
            <TbStarFilled key={i} />
          ))}
          {hasHalf && <TbStarHalfFilled />}
        </div>
        <span className="text-tertiary font-medium">({count})</span>
      </div>
    );
  },
);

StarRating.displayName = "StarRating";

export { StarRating };
export default StarRating;