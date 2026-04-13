const fs = require("fs");
const path = require("path");

const Product = require("../models/product");

//
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    return res.status(200).json(products);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.getCategory = async (req, res, next) => {
  const category = req.query.category;

  try {
    const products = await Product.find({ category: category });

    return res.status(200).json(products);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.getPagination = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const count = parseInt(req.query.count) || 8;
  const category = req.query.category;
  const search = req.query.search;

  try {
    let query = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query)
      .skip((page - 1) * count)
      .limit(count);

    return res.status(200).json(products);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.getDetail = async (req, res, next) => {
  const prodId = req.params.productId;

  try {
    const product = await Product.findById(prodId);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found!" });
    }

    return res.status(200).json(product);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.postCreateProduct = async (req, res, next) => {
  try {
    const { name, category, short_desc, long_desc, price, count } = req.body;
    const images = req.files;

    if (!images || images.length !== 5) {
      return res.status(400).json({
        message: "Image must have 5 images.",
      });
    }

    const imgNames = images.map((file) => file.filename);

    const newProduct = new Product({
      name: name,
      category: category,
      short_desc: short_desc,
      long_desc: long_desc,
      price: Number(price) || 0,
      count: Number(count) || 0,
      // img1: imgNames[0] || "",
      // img2: imgNames[1] || "",
      // img3: imgNames[2] || "",
      // img4: imgNames[3] || "",
      // img5: imgNames[4] || "",
      imageUrl: imgNames,
    });

    const result = await newProduct.save();

    return res.status(201).json({
      message: "Create new product successfully!",
      productId: result._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.putUpdateProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  const { name, category, short_desc, long_desc, price, count } = req.body;

  try {
    const product = await Product.findById(prodId);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found!" });
    }

    product.name = name;
    product.category = category;
    product.short_desc = short_desc;
    product.long_desc = long_desc;
    product.price = price;
    product.count = count;

    await product.save();
    res.status(200).json({ message: "Update Product Successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const prodId = req.params.productId;

  try {
    const product = await Product.findById(prodId);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found!" });
    }

    const imageNames = [
      product.img1,
      product.img2,
      product.img3,
      product.img4,
      product.img5,
    ].filter((img) => img && img.trim() !== "");

    imageNames.forEach((fileName) => {
      const filePath = path.join(__dirname, "..", "images", fileName);

      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete image ${fileName}:`, err);
          }
        });
      }
    });

    await Product.findByIdAndDelete(prodId);

    res.status(200).json({ message: "Delete Product Successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
