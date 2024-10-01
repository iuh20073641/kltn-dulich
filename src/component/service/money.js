import React from 'react';

const PriceDisplay = ({ price }) => {
    // Chuyển đổi chuỗi price thành số
  const numericPrice = Number(price);

  const formattedPrice = numericPrice.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  return <div>{formattedPrice}</div>;
};

export default PriceDisplay;