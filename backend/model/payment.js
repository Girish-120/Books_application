const mongoose = require('mongoose');

const Payment = mongoose.model('payment',{
    amount: { type: Number },
    currency: { type: String },
    paymentMethod: { type: String },
    status: { type: String },
    customerName: { type: String },
    customerAddress: { type: String },
    orderNumber: { type: Number },
    paymentID: { type:String },
})

module.exports = Payment;