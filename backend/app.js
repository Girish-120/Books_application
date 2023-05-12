const express = require('express');
const bodyParser = require('body-parser');
const app = express();  

const route = require('./routes');
const cors = require('cors');
const mongoose = require('./db.js');

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cors());

// app.use(route);

app.listen(8080,()=>{
    console.log("Server is started on 8080");
})

app.use(route);
