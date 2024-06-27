const express = require('express');
const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const users = require('./routes/users');

// dotenv.config();

const app = express();

app.use(express.json());

// mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDb has been connected successfully'))
// .catch((err) => console.log('There is an error in connecting to MongoDB: ', err))

mongoose.connect("mongodb+srv://gagan:W7aocAriylB9ysl1@my-app-backend.04hq2bu.mongodb.net/?retryWrites=true&w=majority&appName=my-app-backend")
    .then(() => console.log('Database has been connected successfully'))
        .catch((err) => console.log('Failed to connect to Database', err))

// app.use('/api/users', users);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log('Server is running on PORT: ', port);
})