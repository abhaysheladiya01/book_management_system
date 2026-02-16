const { validationResult } = require("express-validator");
const Product = require("../models/product");

const {
  hasValidationErrors,
  renderFormWithValidationErrors,
} = require("../helpers/form");
const { mapProductData } = require("../helpers/product");

exports.showAddProductForm = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
    product: {
      title: "",
      imageUrl: "",
      price: "",
      description: "",
    },
  });
};

exports.listProducts = (req, res, next) => {
  const errors = hasValidationErrors(req);
  if (errors) {
    return renderFormWithValidationErrors(
      res,
      "admin/edit-product",
      { pageTitle: "Add Product", path: "/admin/add-product", editing: false },
      req.body,
      errors,
    );
  }

  const productData = mapProductData(req.body, req.user);
  const product = new Product(productData);
  product
    .save()
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => console.log(err));
};

exports.updateProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const errors = hasValidationErrors(req);

  if (errors) {
    return renderFormWithValidationErrors(
      res,
      "admin/edit-product",
      { pageTitle: "Edit Product", path: "/admin/edit-product", editing: true },
      req.body,
      errors,
    );
  }

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      Object.assign(product, mapProductData(req.body, req.user));
      return product.save();
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.createProduct = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
