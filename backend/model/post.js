const mongoose = require('mongoose');

const Post = mongoose.model('post',{
    book_name:{type:String},
    book_description:{type:String},
    author_name:{type:String},
    publish_date:{type:Date},
    price:{type:Number}
})

module.exports = Post;