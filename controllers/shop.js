const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');
const authHelper = require('../helpers/auth');

const ITEMS_PER_PAGE = 3;

exports.getProducts = (req, res, next) => {
 const page = +req.query.page || 1;
let totalItems;

  Product.find()
  .countDocuments()
  .then(numProducts =>{
    totalItems = numProducts;
    return Product.find()
      .skip((page - 1 )* ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
  })
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)

      });
    })
  .catch(err => authHelper.handleError(err, next));

};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
  .catch(err => authHelper.handleError(err, next));

};

exports.getIndex = (req, res, next) => {
const page = +req.query.page || 1;
let totalItems;

  Product.find()
  .countDocuments()
  .then(numProducts =>{
    totalItems = numProducts;
    return Product.find()
      .skip((page - 1 )* ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
  })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)

      });
    })
  .catch(err => authHelper.handleError(err, next));

};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.filter(i => i.productId != null);

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => authHelper.handleError(err, next));
};


exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
  .catch(err => authHelper.handleError(err, next));

};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const validItems = user.cart.items.filter(i => i.productId != null);
      const products = validItems.map(i => {
        return { 
          quantity: i.quantity, 
          product: { ...i.productId._doc } 
        };
      });

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save().then(() => {
        return req.user.clearCart();
      });
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => authHelper.handleError(err, next));
};


exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
  .catch(err => authHelper.handleError(err, next));

};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized.'));
      }

      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join(__dirname, '..', 'data', 'invoice', invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text('Invoice', {
        underline: true
      });
      pdfDoc.text('---------------------');

      let totalPrice = 0;
      order.products.forEach(prod =>{
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc.fontSize(14).text(
        prod.product.title + '-' + prod.quantity + 'X' + '$' + prod.product.price
      );
      });
      pdfDoc.text('---------------');
      pdfDoc.fontSize(20).text('Text Price: $' + totalPrice);
    
      pdfDoc.end();

      // fs.access(invoicePath, fs.constants.F_OK, (err) => {
      //   if (err) {
      //     return next(new Error('Invoice file not found.'));
      //   }

      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');

      //   res.sendFile(invoicePath, (err) => {
      //     if (err) {
      //       return next(err);
      //     }
      //   });
      // });

      const file = fs.createReadStream(invoicePath);

      file.pipe(res);
    })
    .catch(err => next(err));
};
