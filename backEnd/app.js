const express = require('express');
const cors = require('cors');
const fun = require('./fonction');
const app = express();
const cookieParser = require('cookie-parser')

var router = require('./router');

setInterval(async() => {  await fun.actualiserAll(); } , 30000); 



app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}))

app.use(express.json());




app.use('/', router); 









module.exports = app;