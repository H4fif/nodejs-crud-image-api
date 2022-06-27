const Product = require('../models/ProductModel');
const path = require('path');
const fs = require('fs');

const getProducts = async (req, res) => {
  try {
    const response = await Product.findAll();
    res.json(response);
  } catch (error) {
    console.log('ERROR HERE >>>>>>> ', error);
  }
};

const getProductById = async (req, res) => {
  try {
    const response = await Product.findOne({ where: {id: req.params.id} });
    res.json(response);
  } catch (error) {
    console.log('ERROR HERE >>>>>>> ', error);
  }
};

const saveProduct = (req, res) => {
  try {
    if (!req.files) return res.status(400).json({ message: 'File required' });
    const name = req.body.title;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ message: 'invalid image type '});
    if (fileSize > 5000000) return res.status(422).json({ message: 'image should < 5 MB' });

    const filePath = path.resolve() + '/src/public/images/' + fileName;

    file.mv(filePath, async (error) => {
      if (error) return res.status(500).json({ message: error.message });

      try {
        await Product.create({
          name: name,
          image: fileName,
          url: url
        });

        res.status(201).json({ message: 'success' });
      } catch (error) {
        console.log('ERROR UPLOAD IMAGE >>>>>>> ', error.message);
      }
    });
  } catch (error) {
    console.log('ERROR HERE >>>>>>> ', error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ where: {id: req.params.id} });

    if (!product) return res.status(404).json({ message: 'Data not found' });

    let fileName = '';

    if (!req.files) {
      fileName = Product.image;
    } else {
      const file = req.files.file;
      const fileSize = file.data.length;
      const ext = path.extname(file.name);
      fileName = file.md5 + ext;
      const allowedType = ['.png', '.jpg', '.jpeg'];

      if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ message: 'invalid image type '});
      if (fileSize > 5000000) return res.status(422).json({ message: 'image should < 5 MB' });

      const filePath = `${path.resolve()}/src/public/images/${product.image}`;
      fs.unlinkSync(filePath);

      file.mv(`${path.resolve()}/src/public/images/${fileName}`, (error) => {
        if (error) return res.status(500).json({ message: error.message });

      });
    }

    const name = req.body.title;
    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`;

    await Product.update({
      name: name,
      image: fileName,
      url: url
    }, {
      where: {
        id: req.params.id
      }
    });

    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log('ERROR HERE >>>>>>> ', error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ where: {id: req.params.id} });

    if (!product) return res.status(404).json({ message: 'Data not found' });

    const filePath = `${path.resolve()}/src/public/images/${product.image}`;
    fs.unlinkSync(filePath);
    await Product.destroy({where: { id: req.params.id }});
    res.status(200).json({ message: 'success' });
  } catch (error) {
    console.log('ERROR HERE >>>>>>> ', error);
  }
};

module.exports = { getProducts, getProductById, saveProduct, updateProduct, deleteProduct };