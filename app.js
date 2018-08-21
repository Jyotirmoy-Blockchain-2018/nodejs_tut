
const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 

app.use(bodyParser.urlencoded({extended:true}));
require('./routes/routes')(app);
console.clear();
app.listen(2424, () => console.log('Server Listing on Port 2424!'));