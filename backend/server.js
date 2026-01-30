const express = require("express")
require('dotenv').config();
const connectDB = require("./config/db")
const path = require("path");
const app = express();
const api = require('./routes/AuthRoutes')
const art = require('./routes/ArtRoutes')
const cart = require('./routes/CartRoutes')

app.use(express.json());
app.use((req, res, next) => {
    console.log(`[REAL SERVER] ${req.method} ${req.url}`);
    next();
});

connectDB();
app.get('/', (req, res) => {
    res.status(200).send({ message: "Welcome to ART GALLERY" });
})

app.use('/verify', api);
app.use('/art', art);
app.use('/cart', cart);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(process.env.PORT, () => {
    console.log("Server Listening");

})