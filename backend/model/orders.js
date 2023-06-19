const mongoose = require('mongoose');

const Orders = mongoose.model('orders',{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post',
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
      address:{type:String, required:true},
      totalPrice: {type:Number},
      orderNumber: {type:Number},
      coupons: {type:String},
      subTotal: {type:Number},
      createdAt: {
        type: Date,
        default: Date.now,
      },
})

module.exports = Orders;