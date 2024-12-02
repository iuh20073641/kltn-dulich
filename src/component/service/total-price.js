import React from 'react';

const TotalDisplay = ({ originalPrice, discountPercent, numberOfPeople }) => {
    // Hàm tính giá đã giảm
    const calculateDiscountedPrice = (originalPrice, discountPercent) => {
      if (!originalPrice || !discountPercent) {
        return originalPrice; // Nếu không có giá gốc hoặc tỷ lệ giảm giá, trả về giá gốc
      }
      const discountAmount = (originalPrice * discountPercent) / 100; // Tính số tiền giảm giá
      return originalPrice - discountAmount; // Trả về giá sau khi đã giảm
    };
  
    // Tính giá đã giảm
    const discountedPrice = calculateDiscountedPrice(originalPrice, discountPercent);
    
    // Tính giá cuối cùng dựa trên số lượng người
    const finalPrice = discountedPrice * (numberOfPeople );
  
    // Định dạng giá cuối cùng
    const formattedFinalPrice = finalPrice.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });

  return (
    <div>
      <p>{formattedFinalPrice}</p>
    </div>
  );
};

export default TotalDisplay;