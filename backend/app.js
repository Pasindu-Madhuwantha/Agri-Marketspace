const express =require('express');
const app = express();

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const path = require('path')

const errorMiddleware = require('./middlewares/errors')



app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(fileUpload());



//import all routes
const products = require('./routes/product');
const auth = require('./routes/authSeller');
const order = require('./routes/orderSeller');

app.use('/api/v1', products)
app.use('/api/v1',auth)
app.use('/api/v1', order)

if(process.env.NODE_ENV === 'PRODUCTION'){
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    } )
}




//Middleware to handle errors
app.use(errorMiddleware);




module.exports = app
