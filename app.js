require('dotenv').config();
const path = require('path');
const fs = require('fs'); 
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const compression = require('compression');
const morgan = require('morgan');

const fileUpload = require('./middleware/fileUpload');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

const MongoStoreDefault = MongoStore.default || MongoStore;

const store = MongoStoreDefault.create({
  mongoUrl: MONGODB_URI,
  collectionName: 'sessions',
  mongoOptions: {
    tls: true,  // Ensure TLS is used
  }
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload.single('image'));  
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  User.findById(req.session.userId)
    .then(user => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch(err => {
      next(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log("GLOBAL Error", error);
  res.status(error.httpStatusCode || 500).render('500', {
    pageTitle: 'Error!',
    path: '/500'
  });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
  })
  .catch(err => console.log("Error connecting to MongoDB:", err));