const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());

// Allow the service to be utilised for all the origins
app.use(cors());

mongoose.connect("mongodb+srv://gagan:W7aocAriylB9ysl1@my-app-backend.04hq2bu.mongodb.net/?retryWrites=true&w=majority&appName=my-app-backend")
    .then(() => console.log('Database has been connected successfully'))
        .catch((err) => console.log('Failed to connect to Database', err))


app.use('/api/users', userRoutes)

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log('Server is running on PORT: ', port);
})