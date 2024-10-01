import React from 'react';

const DiscountDisplay = ({ originalPrice, discountPercent }) => {
  const calculateDiscountedPrice = (originalPrice, discountPercent) => {
    if (!originalPrice || !discountPercent) {
      return originalPrice;
    }
    const discountAmount = (originalPrice * discountPercent) / 100;
    return originalPrice - discountAmount;
  };

  const finalPrice = calculateDiscountedPrice(originalPrice, discountPercent).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  return (
    <div>
      <p>{finalPrice}</p>
    </div>
  );
};

export default DiscountDisplay;