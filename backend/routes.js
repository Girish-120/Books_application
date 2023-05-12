const express = require('express');
const router = express.Router();

const mongoType = require('mongoose').Types;

const Post = require('../backend/model/post.js');


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

    if(mongoType.ObjectId.isValid(req.params.id)){
        Post.findByIdAndUpdate(req.params.id,{$set:book},{new:true}).then((books,err)=>{
            if(books){
                res.send({success:true,message:'record updated successfully',books});
            }else{
                res.status(400).send('Internal Error!'+err);
            }
        }).catch(err=>{
            res.status(400).send('Internal Error!');
        })
    }
})

module.exports = router;