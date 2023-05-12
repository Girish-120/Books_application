const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/books_collection',{useNewUrlParser: true,
useUnifiedTopology: true}).then(()=>{
    console.log("mongoDB is connected...........!");
}).catch(err=>{
    console.log("mongoDB is connected to failed...........!");
})

module.exports = mongoose;