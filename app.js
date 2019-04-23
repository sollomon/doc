const express = require('express');
const cors = require('cors');
const models = require('./model/model');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());

app.use(bodyParser.json());
mongoose.connect(`mongodb+srv://sollomon:patapotea@cluster0-mykdj.mongodb.net/test?retryWrites=true`);
mongoose.connection.once('open', () =>{
  console.log('database connected');
})

const indexRouter = require('./router/index');

app.use('/',indexRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

app.listen(process.env.PORT || 4001, ()=> console.log(' George server'));
