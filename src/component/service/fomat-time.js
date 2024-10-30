import React from 'react';

const FormatTime = ({ date }) => {
    if (!date) return null;

    // Tạo một đối tượng Date từ chuỗi ngày tháng
    const dateObj = new Date(date);

    // Lấy ngày, tháng và năm, sau đó định dạng lại thành "dd/mm/yyyy"
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Tháng trong JS bắt đầu từ 0
    const year = dateObj.getFullYear();

    return <span>{`${day}-${month}-${year}`}</span>;
};

export default FormatTime;