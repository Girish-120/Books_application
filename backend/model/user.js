const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  mobile: { type: Number, unique: true },
  profilePhoto:
  {
    filename: String,
    path: String
  },
  cart: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  address: [{
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    }
  }]
})


module.exports = mongoose.model('User', userSchema);