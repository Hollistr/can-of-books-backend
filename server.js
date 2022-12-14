'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const axios = require('axios');

// bring in mongoose
const mongoose = require('mongoose');

// start express server
const app = express();

// middleware
app.use(cors());
//  ***DO NOT FORGET*** if req.body is undefined, make sure to use express.json middleware!
app.use(express.json());


// access mongoose
mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));
db.once('open', function() {
    console.log('Mongoose is connected to Mongo');
});

const Book = require('./models/book.js');
// const postBook = require('./models/book.js');
// const deleteBook = require('./models/book.js');

// declare port
const PORT = process.env.PORT || 3003
app.listen(PORT, () => console.log(`listening on ${PORT}`));


// endpoints
app.get('/test', (req, res) => {

  // response.send('test request received')
    res.status(200).send('Welcome Book Lovers!')
});

app.get('/book', getBook);

async function getBook(req, res, next) {
  try {
    // queries mongo book-db database
    const results = await Book.find();
    res.status(200).send(results);

  } catch (error) {
    next(error);
  }
}


// POST endpoint, will trigger a CREATE action on our DB
app.post('/book', postBook);

async function postBook(req, res, next) {
  // double check what's added to DB
  console.log(req.body);
  try {
    // 'Book' is the name of model, .create() is the mongoose method, req.body is the book info
    const newBook = await Book.create(req.body);
    res.status(200).send(newBook);
  } catch (error) {
      next(error);
  }
}


// DELETE endpoint, will trigger a DELETE action on DB
app.delete('/book/:id', deleteBook);

async function deleteBook(req, res, next) {
  const id = req.params.id;
  console.log(id);
  try {
      await  Book.findByIdAndDelete(id);
      res.status(204).send('Book Deleted');
  } catch (error) {
      next(error);
  }
}

//  PUT endpoint, will trigger a PUT action on DB
app.put('/book/:id', putBook);

async function putBook(req, res, next) {
  const id = req.params.id;
  console.log(id);
  try {
      const data = req.body;

      // .findByIdAndUpdate method takes 3 arguements
      // 1. id of the thing (document) to update
      // 2. update data object
      // 3. mongoose options object {  new: true, overwrite: true}
      const options = {
        new: true,
        overwrite: true,
      };

      // represents the updated document
      const updatedBook = await Book.findByIdAndUpdate(id, data, options);
      res.status(201).send(updatedBook);
  } catch (error) {
      next(error);
  }
}

app.get('/*', (req, res) => {
  res.status(404).send('Not available');
});


// last app.use()!
app.use((error, req, res, ) => {
  res.status(500).send(error.message);
});
