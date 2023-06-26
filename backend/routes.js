const router = require("express").Router();
const User = require('./model/user');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const checkAuth = require('./middleware/check-auth');
const Post = require('../backend/model/post.js');
const Blog = require("../backend/model/blog.js");
const Orders = require("../backend/model/orders.js");
const allCoupons = require("../backend/model/coupons.js");
const Payment = require("../backend/model/payment.js");
const mongoType = require('mongoose').Types;
const svgCaptcha = require('svg-captcha');

// const stripe = require('stripe')('sk_test_51NIsILSJr3Tp8j6wbD6GVBz3wnUKsvTRHjkkXI4o0IRjr580NDzcnH1HvH3z26wbSfykhtbDeeRZkbfJE9RgxtH000vOnU49F2');

const stripe = require('stripe')('sk_test_tR3PYbcVNZZ796tH88S4VQ2u');

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


var quantity = [];
var totalPrice = 0;
let captchaText = '';


// Register
router.post('/register', (req, res) => {

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.json({ success: false, message: "Hash Error!" })
        } else {
            const user = new User({
                userName: req.body.userName,
                email: req.body.email,
                password: hash,
                mobile: req.body.mobile,
            })

            user.save().then((_) => {
                res.json({ success: true, message: "Account has been Created!" })
            }).catch((err) => {

                if (err.code === 11000) {
                    return res.json({ success: false, message: 'Email is Already Exist!' })
                }
                res.json({ success: false, message: 'Authentication Failed!' })
            })
        }
    })

})

// Login
router.post('/login', (req, res) => {
    User.find({ email: req.body.email }).exec().then((result) => {
        if (result.length < 1) {
            return res.json({ success: false, message: 'User Not Found!' })
        } else {
            const user = result[0]
            bcrypt.compare(req.body.password, user.password, (err, ret) => {
                if (ret) {
                    const payload = {
                        userId: user._id,
                    }
                    const token = jwt.sign(payload, "bookAuth")
                    return res.json({ success: true, token: token, message: 'Login Successfull !' })
                } else {
                    return res.json({ success: false, message: 'Password does not match!' })
                }
            })
        }
    }).catch(err => {
        res.json({ success: false, message: 'Authentication Failed!' })
    })
})

// Profile
router.get('/profile', checkAuth, (req, res) => {
    const userId = req.userData.userId;
    quantity = []
    User.findById(userId).exec().then((result) => {

        for (let i = 0; i < result.cart.length; i++) {
            quantity.push(result.cart[i])
        }

        res.json({ success: true, data: result })
    }).catch(err => {
        res.json({ success: false, message: 'Authentication Failed!' })
    })
})

// Upload Profile Image
router.post('/upload-photo', upload.single('profilePhoto'), checkAuth, async (req, res) => {
    const { originalname, path } = req.file;

    const userId = req.userData.userId;

    const oneData = await User.findByIdAndUpdate(userId, { profilePhoto: { filename: originalname, path } }, { new: true });
    if (!oneData) {
        return res.status(404).json({ success: false, message: 'Record not found!' });
    } else {
        return res.status(200).json({ success: true, message: 'Profile Image Updated Successfully !', data: oneData });
    }

})

//create book
router.post('/createbook', upload.array('image', 5), (req, res) => {
    const images = req.files.map((file) => {
        return {
          filename: file.originalname,
          path: file.path
        };
      });


    let book = new Post({
        book_name: req.body.book_name,
        book_description: req.body.book_description,
        author_name: req.body.author_name,
        publish_date: req.body.publish_date,
        price: req.body.price,
        image: images
    })

    book.save().then((books, err) => {
        if (books) {
            res.send({ success: true, message: 'Books created successfully', books });
        } else {
            res.status(400).send({ success: false, message: 'Internal Error!' });
        }
    }).catch(err => {
        res.status(400).send({ success: false, message: 'Internal Error!', err });
    })
})

//create blog
router.post('/createblog', upload.single('image'), (req, res) => {
    const { originalname, path } = req.file;

    let blog = new Blog({
        blog_name: req.body.blog_name,
        blog_related_to: req.body.blog_related_to,
        blog_content: req.body.blog_content,
        blog_date: req.body.blog_date,
        image: {
            filename: originalname, path
        }
    })

    blog.save().then((blogs, err) => {
        if (blogs) {
            res.send({ success: true, message: 'blog created successfully', blogs });
        } else {
            res.status(400).send({ success: false, message: 'Internal Error!' });
        }
    }).catch(err => {
        res.status(400).send({ success: false, message: 'Internal Error!', err });
    })
})

//get all books
router.get('/getallbooks', (req, res) => {
    try {
        Post.find().then((books) => {
            const booklength = books.length;

            const booksWithRatings = books.map((book) => {
                const ratings = book.ratings.map((rating) => ({
                    ratingId: rating._id,
                    value: rating.ratingValue,
                    userId: rating.userId
                }));

                const values = ratings.map(rating => rating.value);
                const totalRatings = values.length;
                const sumRatings = values.reduce((acc, rating) => acc + rating, 0);
                const average = Math.round(sumRatings / totalRatings);

                const bookWithRatings = Object.assign({}, book._doc, {
                    averageRating: average
                });

                return bookWithRatings;
            });

            const avg = booksWithRatings.map(book => book.averageRating)
            const ratingCounts = {
                Five: avg.filter(value => value === 5).length,
                Four: avg.filter(value => value === 4).length,
                Three: avg.filter(value => value === 3).length,
                Two: avg.filter(value => value === 2).length,
                One: avg.filter(value => value === 1).length
              };

            res.send({ success: true, message: 'Books fetch successfully', book_length: booklength, books: booksWithRatings, ratingCounts });
        })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', err: error });
    }

})

// get all authors name
router.get('/getAllAuthors', async (req, res) => {
    try {
        const books = await Post.find();
        const authors = [...new Set(books.map(book => book.author_name))];
        res.send({ success: true, message: 'All Authors fetched successfully!', authors });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', err: error });
    }
})

//get all blogs
router.get('/getallblogs', (req, res) => {
    Blog.find().then((blogs, err) => {
        const bloglength = blogs.length;
        if (blogs) {
            res.send({ success: true, message: 'Blog fetch successfully', blog_length: bloglength, blogs });
        } else {
            res.status(400).send({ success: false, message: 'Internal Error!' })
        }
    }).catch(err => {
        res.status(400).send({ success: false, message: 'Internal Error!', err });
    })

})

//delete book 
router.delete('/deletebook/:id', (req, res) => {
    if (mongoType.ObjectId.isValid(req.params.id)) {
        Post.findByIdAndDelete(req.params.id).then((books, err) => {
            if (books) {
                res.send({ success: true, message: 'book delete successfully' });
            } else {
                res.status(400).send({ success: false, message: 'Internal Error!' });
            }
        }).catch(err => {
            res.status(400).send({ success: false, message: 'Internal Error!', err });
        })
    }
})

//get data by id
router.get("/getbook/:id", (req, res) => {
    if (mongoType.ObjectId.isValid(req.params.id)) {
        Post.findById(req.params.id).then((books, err) => {
            if (books) {
                const values = books.ratings.map(rating => rating.ratingValue);
                const totalRatings = values.length;
                const sumRatings = values.reduce((acc, rating) => acc + rating, 0);
                const average = Math.round(sumRatings / totalRatings);
                const bookData = {
                    ...books._doc,
                    averageRating: average
                  };

                res.send({ success: true, message: 'book fetch successfully', books:bookData });
            } else {
                res.status(400).send('Internal Error' + err);
            }
        }).catch(err => {   
            res.status(500).json({ success: false, message: 'Internal server error', err: err });
        })
    }
})

//edit data in book
router.put('/editbookbyid/:id', (req, res) => {
    let book = {
        book_name: req.body.book_name,
        book_description: req.body.book_description,
        author_name: req.body.author_name,
        publish_date: req.body.publish_date,
        price: req.body.price
    }

    if (mongoType.ObjectId.isValid(req.params.id)) {
        Post.findByIdAndUpdate(req.params.id, { $set: book }, { new: true }).then((books, err) => {
            if (books) {
                res.send({ error: 0, message: 'record updated successfully', books });
            } else {
                res.status(400).send('Internal Error!' + err);
            }
        }).catch(err => {
            res.status(400).send('Internal Error!');
        })
    }
})

// Search Api
router.get('/search', (req, res) => {
    const { query } = req.query;

    const searchQuery = {
        $or: [
            { book_name: { $regex: new RegExp(query, 'i') } },
            { author_name: { $regex: new RegExp(query, 'i') } }
        ]
    };

    Post.find(searchQuery).then((books) => {
        res.send({ success: true, message: 'Books fetch successfully', books });
    }).catch((error) => {
        res.status(500).json({ error: 'An error occurred while searching for products', error });
    });
})

// add to cart || Add 1 qty to cart
router.post('/add-to-cart', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const user = await User.findById(userId);
        const product = await Post.findById(productId);

        if (!user || !product) {
            return res.status(404).json({ error: 'User or product not found' });
        }

        const existingProduct = user.cart.find(item => item.productId.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            user.cart.push({ productId, quantity: 1 });
        }

        await user.save();

        res.status(200).json({ success: true, message: 'Product added to cart' });

    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
})

// Get multiple books by IDs
router.get('/getCartList', async (req, res) => {
    const bookIds = req.query.ids.split(',');
    totalPrice = 0;
    try {
        const books = await Post.find({
            _id: { $in: bookIds }
        });

        const matchedProducts = quantity.map(product => {
            const book = books.find(book => book._id.equals(product.productId));
            if (book) {
                const totalPrice = book.price * product.quantity;
                return { totalPrice };
            }
        });
        const totalPrice = matchedProducts.reduce((sum, product) => sum + product.totalPrice, 0);

        res.status(200).json({ success: true, message: 'Cart List Fetched Successfully!', books, totalPrice });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete Cart
router.delete('/deleteCart/:userId/:itemId', async (req, res) => {
    const { userId, itemId } = req.params;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const itemIndex = user.cart.findIndex(item => item.productId.toString() === itemId);

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, error: 'Item not found in cart' });
        }

        user.cart.splice(itemIndex, 1);

        await user.save();

        res.status(200).json({ success: true, message: 'Item removed from cart' });

    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
})

// Delete 1 Qty from Cart
router.delete('/deleteQty/:userId/:itemId', async (req, res) => {
    const { userId, itemId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User or product not found' });
        }

        const existingProduct = user.cart.find(item => item.productId.toString() === itemId);
        if (!existingProduct) {
            return res.status(404).json({ success: false, error: 'Product not found in the cart' });
        }

        const quantityToDelete = 1;
        existingProduct.quantity -= quantityToDelete;

        if (existingProduct.quantity === 0) {
            user.cart = user.cart.filter(item => item.productId.toString() !== itemId);
        }

        await user.save();
        return res.status(200).json({ success: true, message: 'Quantity deleted from cart' });

    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
})

// Add User Address
router.post('/addAddress', async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        } else {
            user.address.push({
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                postalCode: req.body.postalCode
            });
        }

        await user.save();
        res.status(200).json({ success: true, message: 'Address Added Successfully!' });

    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }

})

// Filter Api
router.get('/filter', async (req, res) => {
    var queryHit = req.query;

    if (queryHit.query == "asc") {
        var filteredBooks = await Post.find().exec();
        filteredBooks.sort((a, b) => a.price - b.price);
        res.json(filteredBooks);
    } else if (queryHit.query == "desc") {
        var filteredBooks = await Post.find().exec();
        filteredBooks.sort((a, b) => b.price - a.price);
        res.json(filteredBooks);
    } else if (queryHit.query == "newness") {
        var filteredBooks = await Post.find().exec();
        filteredBooks.sort((a, b) => {
            const dateA = new Date(b.publish_date);
            const dateB = new Date(a.publish_date);
            return dateB.getTime() - dateA.getTime();
        });
        res.json(filteredBooks);
    }
});

// Captcha API
router.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create();
    captchaText = captcha.text;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.status(200).json({ data: captcha.data });
});

// Place order
router.post("/place-order", async (req, res) => {
    const { userId, address, totalPrice, coupons, subTotal, orderNumber } = req.body;

    try {
        const user = await User.findById(userId);

        // if (!captchaText || captchaText.toLowerCase() !== captchaTxt.toLowerCase()) {
        //     return res.status(400).json({ message: 'Invalid CAPTCHA' });
        // } else {
        if (!orderNumber) {
            let order = new Orders({
                userId,
                products: user.cart,
                address,
                totalPrice,
                coupons,
                subTotal,
                orderNumber: Math.floor(1000 + Math.random() * 9000).toString(),
                createdAt: new Date(),
            })
            order.save().then((orders, err) => {
                if (orders) {
                    res.send({ success: true, message: 'Order Placed successfully', userId: order.userId, orderNumber: orders.orderNumber });
                } else {
                    res.status(400).send({ success: false, message: 'Order Failed!' });
                }
            }).catch(err => {
                res.status(400).send({ success: false, message: 'Internal Error!', err });
            })
        } else {
            let order = new Orders({
                userId,
                products: user.cart,
                address,
                totalPrice,
                coupons,
                subTotal,
                orderNumber,
                createdAt: new Date(),
            })
            order.save().then((orders, err) => {
                if (orders) {
                    res.send({ success: true, message: 'Order Placed successfully', userId: order.userId, orderNumber: orders.orderNumber });
                } else {
                    res.status(400).send({ success: false, message: 'Order Failed!' });
                }
            }).catch(err => {
                res.status(400).send({ success: false, message: 'Internal Error!', err });
            })
        }

        // }   


    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
})

// Get Order api
router.get('/getOrder/:orderNumber/:userId', async (req, res) => {
    try {
        const orderNumber = req.params.orderNumber;
        const user = await User.findById(req.params.userId);
        const order = await Orders.findOne({ orderNumber });
        if (!order) {
            res.status(404).json({ error: 'Order not found.' });
            return;
        } else {

            const getAllProductIds = () => {
                const productIds = order.products.map(product => product.productId);
                return productIds;
            };
            const ids = getAllProductIds().map(objectId => objectId.toString());

            const books = await Post.find({
                _id: { $in: ids }
            });

            const newArray = books.map((item) => {
                const matchingData = user.cart.find(
                    (data) => data.productId.equals(item._id)
                );
                if (matchingData) {
                    return { ...item._doc, quantity: matchingData.quantity };
                }
                return item;
            });

            if (order) {
                user.cart = [];
                await user.save();
            }

            res.status(200).json({ books: newArray, totalPrice: order.totalPrice, subTotal: order.subTotal, orderNumber: order.orderNumber, address: order.address, coupon: order.coupons, createdAt: order.createdAt });

        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error', err: error });
    }
})

// Get all orders
router.get('/getAllOrders/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const order = await Orders.find({ userId });

        if (!order) {
            res.status(404).json({ error: 'Order not found.' });
            return;
        } else {

            const getAllProductIds = () => {
                const productIds = order.flatMap(order => order.products.map(product => product.productId));
                return productIds;
            };
            const ids = getAllProductIds().map(objectId => objectId.toString());

            const books = await Post.find({
                _id: { $in: ids }
            });

            // Loop through each order
            const updatedOrders = order.map(order => {
                const updatedProducts = order.products.map(product => {

                    const matchingBook = books.find((data) => data._id.equals(product.productId));
                    return {
                        ...matchingBook._doc,
                        quantity: product.quantity
                    };
                });
                // Date Format
                const formattedDate = formatDate(order.createdAt);
                return {
                    ...order._doc,
                    date: formattedDate,
                    products: updatedProducts
                };
            });

            res.status(200).json({ success: true, message: "All Orders Fetched Successfully!", allOrders: updatedOrders });
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error', err: error });
    }
})

// Genarate coupons by Admin
router.get('/generateCoupons', async (req, res) => {
    try {
        // Generate the specified number of coupons with expiry times
        const coupons = generateCoupons('3');

        allCoupons.find().then((item) => {
            if (item.length < 3) {
                allCoupons.create(coupons)
                    .then(() => {
                        res.json({ message: `${coupons.length} coupons generated and saved to the database` });
                    })
                    .catch((error) => {
                        res.status(500).json({ error: 'Failed to generate and save coupons' });
                    });
            } else {
                res.status(500).json({ error: 'Limit Exceed' });
            }
        }).catch((error) => {
            res.status(500).json({ error: 'Failed to fetch coupons' });
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error', err: error });
    }
})

// getAll Coupons
router.get('/getAllCoupons', (req, res) => {
    try {
        allCoupons.find().then((item) => {
            res.json({ coupons: item });
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', err: error });
    }
})

// Validate and Discount Coupon
router.post('/validateCoupon', async (req, res) => {
    try {
        const code = req.body.code
        const coupon = await allCoupons.findOne({ code });

        if (!coupon) {
            res.status(404).json({ error: 'Coupon not found.' });
            return;
        } else {
            res.json(coupon)
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error', err: error });
    }
})

// Payment Gatway
router.post('/payment', async (req, res) => {
    try {
        const { cardNumber, expiryMonth, expiryYear, cvc, amount, customerName, customerAddress, description } = req.body;

        if (!cardNumber || !expiryMonth || !expiryYear || !cvc || !amount || !customerName || !customerAddress || !description) {
            res.status(400).json({ error: 'Missing required payment details' });
        }

        // Generate a test token using Stripe.js or the Stripe API
        const token = await stripe.tokens.create({
            card: {
                number: cardNumber,
                exp_month: expiryMonth,
                exp_year: expiryYear,
                cvc: cvc,
            },
        });

        // Process the payment with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'inr',
            payment_method_types: ['card'],
            payment_method_data: {
                type: 'card',
                card: {
                    token: token.id,
                },
            },
            confirm: true,
            description: description,
            metadata: {
                customerName: customerName, // Include customer name in metadata
                customerAddress: customerAddress, // Include customer address in metadata
            },
        });

        // Save payment details to the database
        const payment = new Payment({
            amount: paymentIntent.amount,
            orderNumber: Math.floor(1000 + Math.random() * 9000).toString(),
            currency: paymentIntent.currency,
            paymentMethod: paymentIntent.payment_method_types[0],
            status: paymentIntent.status,
            customerName: paymentIntent.metadata.customerName,
            customerAddress: paymentIntent.metadata.customerAddress,
            paymentID: paymentIntent.id
        });
        await payment.save();

        // Payment successful
        res.status(200).json({ success: true, message: "Payment Successfull!", paymentDetails: payment })



    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', err: error });
    }
})

router.post("/star-rating", (req, res) => {
    try {
        const { id } = req.body;
        const { ratingValue } = req.body;
        const { userId } = req.body;

        Post.findByIdAndUpdate(id, { $push: { ratings: { userId: userId, ratingValue: ratingValue } } }, { new: true })
            .then((updatedBook) => {
                if (!updatedBook) {
                    return res.status(404).json({ error: 'Book not found' });
                }
                res.json(updatedBook);
            })
            .catch((error) => {
                res.status(500).json({ error: 'Failed to update book rating' });
            });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', err: error });
    }
})



// Change Date Format
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const day = `0${date.getUTCDate()}`.slice(-2);
    const hours = `0${date.getUTCHours()}`.slice(-2);
    const minutes = `0${date.getUTCMinutes()}`.slice(-2);
    const seconds = `0${date.getUTCSeconds()}`.slice(-2);

    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
}

// Generate Coupons
function generateCoupons(quantity) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 8;
    const coupons = [];

    for (let i = 0; i < quantity; i++) {
        let couponCode = '';

        const expiryDate = new Date();
        // for one day
        expiryDate.setDate(expiryDate.getDate() + 1);

        for (let j = 0; j < length; j++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            couponCode += characters[randomIndex];
        }

        const coupon = {
            code: couponCode,
            discount: Math.floor(Math.random() * 30) + 1,
            expiryDate: expiryDate
        };

        coupons.push(coupon);
    }

    return coupons;
}

// Function to delete expired coupons
async function deleteExpiredCoupons() {
    const currentDate = new Date();
    const expiredCoupons = await allCoupons.find({ expiryDate: { $lte: currentDate } });
    if (expiredCoupons.length > 0) {
        const result = await allCoupons.deleteMany({ _id: { $in: expiredCoupons.map(coupon => coupon._id) } });
        console.log('Deleted expired coupons:', result.deletedCount);
    } else {
        console.log('No expired coupons to delete');
    }
}
// Schedule automatic deletion of expired coupons
// setInterval(() => {
//     deleteExpiredCoupons()
// }, 10000);
// setInterval(deleteExpiredCoupons, 24 * 60 * 60 * 1000);


module.exports = router;
