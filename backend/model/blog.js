const mongoose = require('mongoose');

const Blog = mongoose.model('blog',{
    blog_name:{type:String},
    blog_related_to:{type:String},
    blog_content:{type:String},
    blog_date:{type:Date},
    image:
    {
        filename: String,
        path: String
    }
})

module.exports = Blog;