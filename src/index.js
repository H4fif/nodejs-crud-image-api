const express = require('express');
const FileUpload = require('express-fileupload');
const cors = require('cors');
const ProductRoute = require('./routes/ProductRoute');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(FileUpload());
app.use(express.static(path.resolve() + '/src/public'));
app.use(ProductRoute);

app.listen(3000, () => console.log('Server up and running...'));