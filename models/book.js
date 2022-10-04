'use strict';

// define schema
const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true}
})

const BookModel = mongoose.model('book', bookSchema);

module.exports = BookModel;