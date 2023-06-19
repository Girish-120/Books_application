const mongoose = require('mongoose');

const allCoupons = mongoose.model('coupons',{
    code: { type: String, required: true },
    discount: { type: Number, required: true },
    expiryDate: { type: Date, required: true }
})

module.exports = allCoupons;