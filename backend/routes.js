const express = require('express');
const router = express.Router();

const mongoType = require('mongoose').Types;

const Post = require('../backend/model/post.js');