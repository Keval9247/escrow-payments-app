const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const scheduleDelayedTransfers = require('./controllers/task');
require('dotenv').config();
const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
}));
app.use(express.json());
app.use(
    session({
        secret: `${process.env.SESSION_SECRET}`,
        resave: false, // Prevent unnecessary saves
        saveUninitialized: false, // Prevent creation of empty sessions
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions",
            ttl: 14 * 24 * 60 * 60, // 14 days session expiry
        }),
    })
);

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

app.use('/api', routes);
scheduleDelayedTransfers();



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
