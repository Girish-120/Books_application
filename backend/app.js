const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('./db.js');
const app = express();  
const route = require('../backend/routes.js');
app.use(bodyParser.json());

app.use(cors({origin:'http://localhost:4200'}));

app.listen(8080,()=>{
    console.log("Server is started on 8080");
})

app.use(route);