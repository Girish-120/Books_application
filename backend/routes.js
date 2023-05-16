const router = require("express").Router();
const User = require('./model/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const checkAuth = require('./middleware/check-auth');
const Post = require('../backend/model/post.js');
const multer = require('multer');
const path = require('path');
const mongoType = require('mongoose').Types;


//upload book image
const upload = multer({
    storage: multer.diskStorage({
        destination:(req, file, cb)=>{
            console.log(req.file);
            cb(null,'upload/images')
        },
        filename:(req,file,cb)=>{
            cb(null,file.originalname+"-"+Date.now()+".jpg");
            global.imageName = file.originalname;
            return imageName;
        }
    })
}).single("user_file");

router.post('/upload',upload,(req,res)=>{
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }else{
        res.send({success:true,message:"File uploaded successfully."});
    }
})

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
                console.log(err);
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


//create book
router.post('/createbook',(req,res)=>{
    let book = new Post({
        book_name:req.body.book_name,
        book_description:req.body.book_description,
        author_name:req.body.author_name,
        publish_date:req.body.publish_date,
        price:req.body.price
    })

    book.save().then((books,err)=>{
        if(books){
            res.send({success:true,message:'Books created successfully'});
        }else{
            res.status(400).send({success:false,message:'Internal Error!'});
        }
    }).catch(err=>{
        console.log("Internal Error!");
        res.status(400).send({success:false,message:'Internal Error!',err});
    })
})

//get all books
router.get('/getallbooks',(req,res)=>{
    Post.find().then((books,err)=>{
        const bookLength = books.length;
        console.log(bookLength);
        if(books){
            res.send({success:true,message:'Books fetch successfully',books});
        }else{
            res.status(400).send({success:false,message:'Internal Error!'})
        }
    }).catch(err=>{
        console.log("Internal Error!");
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
            console.log("Internal Error!");
            res.status(400).send({success:false,message:'Internal Error!',err});
        })
    }else{
        console.log("hello");
    }
})

//get data by id
router.get("/getbook/:id",(req,res)=>{
    if(mongoType.ObjectId.isValid(req.params.id)){
        Post.findById(req.params.id).then((books,err)=>{
            if(books){
                res.send({success:true,message:'book fetch successfully',books});
            }else{
                console.log('Internal Error' + err);
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

    console.log(book);

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

module.exports = router;
