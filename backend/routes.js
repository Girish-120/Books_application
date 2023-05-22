const router = require("express").Router();
const User = require('./model/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const checkAuth = require('./middleware/check-auth');
const Post = require('../backend/model/post.js');
const Blog = require("../backend/model/blog.js");
const mongoType = require('mongoose').Types;

const path = require('path');
const express = require('express');
const multer = require('multer');

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});
  
const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Register
router.post('/register', (req,res)=>{
    
    bcrypt.hash(req.body.password, 10, (err, hash)=>{
        if(err){
            return res.json({success:false, message:"Hash Error!"})
        }else{
            const user = new User({
                userName: req.body.userName,
                email: req.body.email,
                password: hash,
                mobile: req.body.mobile,
            }) 
        
            user.save().then((_)=>{
                res.json({success:true, message:"Account has been Created!"})
            }).catch((err)=>{
                
                if(err.code === 11000){
                    return res.json({success:false, message:'Email is Already Exist!'})
                }
                res.json({success:false, message:'Authentication Failed!'})
            })
        }
    })

})

// Login
router.post('/login', (req,res)=>{
    User.find({email:req.body.email}).exec().then((result)=>{
     if(result.length < 1){
         return res.json({success:false, message:'User Not Found!'})
     }else{
         const user = result[0]
         bcrypt.compare(req.body.password, user.password, (err,ret)=>{
             if(ret){
                 const payload = {
                     userId: user._id,
                 }
                 const token = jwt.sign(payload, "bookAuth")
                 return res.json({success:true, token:token, message:'Login Successfull !'})
             }else{
                 return res.json({success:false, message:'Password does not match!'})
             }
         })
     }
    }).catch(err=>{
     res.json({success:false, message:'Authentication Failed!'})
    })
})

// Profile
router.get('/profile', checkAuth, (req,res)=>{
    const userId = req.userData.userId;
    User.findById(userId).exec().then((result)=>{
        res.json({success:true, data:result})
    }).catch(err=>{
        res.json({success:false, message:'Authentication Failed!'})
    })
})

// Upload Profile Image
router.post('/upload-photo', upload.single('profilePhoto'), checkAuth, async (req,res)=>{
    const { originalname, path } = req.file;

    const userId = req.userData.userId;

    const oneData = await User.findByIdAndUpdate(userId,  { profilePhoto: {filename: originalname ,path} }, {new : true});
    if(!oneData){
        return res.status(404).json({success:false, message: 'Record not found!'});
    }else{
        return res.status(200).json({success:true, message: 'Profile Image Updated Successfully !', data:oneData});
    }
    
})


//create book
router.post('/createbook', upload.single('image'),(req,res)=>{
    const { originalname, path } = req.file;

    let book = new Post({
        book_name:req.body.book_name,
        book_description:req.body.book_description,
        author_name:req.body.author_name,
        publish_date:req.body.publish_date,
        price:req.body.price,
        image: {
            filename: originalname ,path
        }
    })

    book.save().then((books,err)=>{
        if(books){
            res.send({success:true,message:'Books created successfully', books});
        }else{
            res.status(400).send({success:false,message:'Internal Error!'});
        }
    }).catch(err=>{
        res.status(400).send({success:false,message:'Internal Error!',err});
    })
})

//create blog
router.post('/createblog',(req,res)=>{

    let blog = new Blog({
        blog_name:req.body.blog_name,
        blog_related_to:req.body.blog_related_to,
        blog_content:req.body.blog_content,
        blog_date:req.body.blog_date
    })

    blog.save().then((blogs,err)=>{
        if(blogs){
            res.send({success:true,message:'blog created successfully', blogs});
        }else{
            res.status(400).send({success:false,message:'Internal Error!'});
        }
    }).catch(err=>{
        res.status(400).send({success:false,message:'Internal Error!',err});
    })
})

//get all books
router.get('/getallbooks',(req,res)=>{
    Post.find().then((books,err)=>{
        const booklength = books.length;
        if(books){
            res.send({success:true,message:'Books fetch successfully',book_length:booklength,books});
        }else{
            res.status(400).send({success:false,message:'Internal Error!'})
        }
    }).catch(err=>{
        res.status(400).send({success:false,message:'Internal Error!',err});
    })

})

//get all blogs
router.get('/getallblogs',(req,res)=>{
    Blog.find().then((blogs,err)=>{
        const bloglength = blogs.length;
        if(blogs){
            res.send({success:true,message:'Blog fetch successfully',blog_length:bloglength,blogs});
        }else{
            res.status(400).send({success:false,message:'Internal Error!'})
        }
    }).catch(err=>{
        res.status(400).send({success:false,message:'Internal Error!',err});
    })

})


//delete book 
router.delete('/deletebook/:id',(req,res)=>{
    if(mongoType.ObjectId.isValid(req.params.id)){
        Post.findByIdAndDelete(req.params.id).then((books,err)=>{
            if(books){
                res.send({success:true,message:'book delete successfully'});
            }else{
                res.status(400).send({success:false,message:'Internal Error!'});
            }
        }).catch(err=>{
            res.status(400).send({success:false,message:'Internal Error!',err});
        })
    }
})

//get data by id
router.get("/getbook/:id",(req,res)=>{
    if(mongoType.ObjectId.isValid(req.params.id)){
        Post.findById(req.params.id).then((books,err)=>{
            if(books){
                res.send({success:true,message:'book fetch successfully',books});
            }else{
                res.status(400).send('Internal Error' + err);
            }
        }).catch(err=>{
            res.status(400).send("Not record found by this id");
        })
    }
})

//edit data in book
router.put('/editbookbyid/:id',(req,res)=>{
    let book = {
        book_name:req.body.book_name,
        book_description:req.body.book_description,
        author_name:req.body.author_name,
        publish_date:req.body.publish_date,
        price:req.body.price
    }

    if(mongoType.ObjectId.isValid(req.params.id)){
        Post.findByIdAndUpdate(req.params.id,{$set:book},{new:true}).then((books,err)=>{
            if(books){
                res.send({error:0,message:'record updated successfully',books});
            }else{
                res.status(400).send('Internal Error!'+err);
            }
        }).catch(err=>{
            res.status(400).send('Internal Error!');
        })
    }
})

// Search Api
router.get('/search',(req,res)=>{
    const { query } = req.query;

    const searchQuery = {
        $or: [
            { book_name: { $regex: new RegExp(query, 'i') } },
            { author_name: { $regex: new RegExp(query, 'i') } }
          ]
    };

    Post.find(searchQuery).then((books)=> {
        res.send({success:true,message:'Books fetch successfully',books});
    }).catch((error) => {
        res.status(500).json({ error: 'An error occurred while searching for products', error });
    });
})

router.get('/filter', async(req, res) => {
    var queryHit = req.query;

    if(queryHit.query == "asc"){
        var filteredBooks = await Post.find().exec();
        filteredBooks.sort((a,b)=>a.price - b.price);
        res.json(filteredBooks);
    }else if(queryHit.query == "desc"){
        var filteredBooks = await Post.find().exec();
        filteredBooks.sort((a,b)=>b.price - a.price);
        res.json(filteredBooks);
    }else if(queryHit.query == "newness"){
        var filteredBooks = await Post.find().exec();
        filteredBooks.sort((a,b)=>{
            const dateA = new Date(b.publish_date);
            const dateB = new Date(a.publish_date);
            return dateB.getTime() - dateA.getTime();
        });
        res.json(filteredBooks);
    }
});

module.exports = router;