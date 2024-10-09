const express = require('express');
const crypto = require('crypto');
const querystring = require('qs');
const app = express();

// Cấu hình cho phép đọc JSON từ các request body
app.use(express.json());

// Thông tin từ VNPAY
const tmnCode = 'R6ESP4JE'; // Thay bằng mã TMN của bạn từ VNPAY
const secretKey = '9BTC8526VSR4VDFO2ORFEXNUGXR9COGJ'; // Thay bằng secret key từ VNPAY
const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'; // URL của sandbox VNPAY
const returnUrl = 'http://localhost:3000/payment-success'; // URL trả về khi thanh toán xong

// Tạo API để tạo đường dẫn thanh toán
app.post('/create_payment_url', (req, res) => {
    const { amount, orderId } = req.body; // Lấy số tiền và mã đơn hàng từ request

    let vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Amount: amount * 100, // Chuyển từ VND sang đơn vị đồng
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: 'Thanh toán đơn hàng',
        vnp_Locale: 'vn',
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: req.ip,
        vnp_CreateDate: new Date().toISOString().replace(/[-T:\.Z]/g, ''),
    };

    // Sắp xếp lại các tham số trước khi tạo chữ ký
    vnp_Params = sortObject(vnp_Params);

    // Tạo chữ ký bảo mật
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    vnp_Params['vnp_SecureHash'] = signed;
    const paymentUrl = vnpUrl + '?' + querystring.stringify(vnp_Params);

    // Trả về URL thanh toán
    res.json({ paymentUrl });
});

// Hàm sắp xếp lại các tham số
const sortObject = (obj) => {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    keys.forEach(key => {
        sorted[key] = obj[key];
    });
    return sorted;
};

// Chạy server trên cổng 3001
app.listen(3001, () => console.log('Server is running on port 3001'));
