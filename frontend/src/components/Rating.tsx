import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface RatingProps {
  value: number;
  text: string;
}

const Rating = ({ value, text }: RatingProps) => {
  return (
    <div className="m-[1.6px] flex flex-row">
      <span>
        {value >= 1 ? (
          <FaStar className="text-rating-star" />
        ) : value >= 0.5 ? (
          <FaStarHalfAlt className="text-rating-star" />
        ) : (
          <FaRegStar className="text-rating-star" />
        )}
      </span>
      <span>
        {value >= 2 ? (
          <FaStar className="text-rating-star" />
        ) : value >= 1.5 ? (
          <FaStarHalfAlt className="text-rating-star" />
        ) : (
          <FaRegStar className="text-rating-star" />
        )}
      </span>
      <span>
        {value >= 3 ? (
          <FaStar className="text-rating-star" />
        ) : value >= 2.5 ? (
          <FaStarHalfAlt className="text-rating-star" />
        ) : (
          <FaRegStar className="text-rating-star" />
        )}
      </span>
      <span>
        {value >= 4 ? (
          <FaStar className="text-rating-star" />
        ) : value >= 3.5 ? (
          <FaStarHalfAlt className="text-rating-star" />
        ) : (
          <FaRegStar className="text-rating-star" />
        )}
      </span>
      <span>
        {value >= 5 ? (
          <FaStar className="text-rating-star" />
        ) : value >= 4.5 ? (
          <FaStarHalfAlt className="text-rating-star" />
        ) : (
          <FaRegStar className="text-rating-star" />
        )}
      </span>
      <span className="text-sm font-semibold pl-[8px]">{text && text}</span>
    </div>
  );
};

export default Rating;
