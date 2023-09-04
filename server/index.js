require('dotenv').config();
const ejs = require('ejs');
const express = require('express');
const app = express();
const port = 3000; // Change this to the desired port number
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const User = require('./models/user'); // Replace with your user model file
const { EventEmitter } = require('events');
const mongoose = require('mongoose');
const { log } = require('console');
const Notice = require('./models/notice');
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const methodOverride = require('method-override');
passport.use(new LocalStrategy(User.authenticate()));


// MongoDb connection
const uri = process.env.DB_URI;
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true });

// const db = mongoose.connection;
// db.on('error',console.error.bind(console, 'MongoDB connection error'));
// db.once('open', ()=>{
//   console.log('Connected to MongoDB');
// });

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

 
// Configuring Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the directory where uploaded files should be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname); // Rename the file to prevent name conflicts
  },
});

const upload = multer({ storage: storage }); // Creating multer middleware instance.


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'harshit', // Replace with your secret key
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/uploads', express.static('uploads'));

app.use(methodOverride('_method'));

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));


// Passport.js configuration
// require('passport'); // Import the passport configuration file
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ensureAuthenticated middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login'); // Redirect to the login page if not authenticated
}

// Sample notices data (Replace this with your actual data)
const notices = [
  {
    title: 'Notice Title 1',
    description: 'Provide a description and any important details about the notice.',
  },
  {
    title: 'Notice Title 2',
    description: 'Provide a description and any important details about the notice.',
  },
  // Add more notices as needed
];

app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.get('/', async (req, res) => {
  try {
    // Fetch all notices from the database
    const notices = await Notice.find();

    // Render the index1.ejs template and pass the notices data to it
    res.render('index1', { notices });
  } catch (err) {
    // Handle error if database fetch fails
    res.status(500).send('Error fetching notices from the database');
  }
});

app.get('/profile', ensureAuthenticated, (req, res) => {
  res.send('Welcome to the profile page!'); // Replace with your profile page content
});

function ensureAdminAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.redirect('/admin/login'); // Redirect to the admin login page if not authenticated as an admin
}

// Routes
// Add your routes here

// Protect admin routes
app.get('/admin/notices/upload', ensureAdminAuthenticated, (req, res) => {
  // Render the notice upload form view for authenticated admins only
  res.render('notice-upload-form', { action: '/admin/notices/upload' });
});

// Handle notice upload form submission
app.post('/admin/notices/upload', ensureAdminAuthenticated, upload.single('file'), async(req, res) => {
  // Process the notice upload form submission for authenticated admins only
  // Save the notice details to the database
  // Redirect to the admin panel or display a success message
  const { title, description } = req.body;
  const fileUrl = req.file.filename;
  
  try{

    const notice = new Notice({title, description, fileUrl});
    await notice.save();
    console.log('Notice uploaded',notice);
    res.redirect('/notices');

  }catch(error){

    console.error('Error uploading Notice', error);
    // Handle the error appropriately, e.g., display an error message or redirect to an error page.
  }

});


// Admin Login route
app.post('/admin/login', passport.authenticate('local', {
  successRedirect: '/notices', // Replace with your profile page route
  failureRedirect: '/admin/login', // Replace with your login page route
}));


// // In your Express server code
app.get('/admin/login', (req, res) => {
  // Render the admin login page (assuming you have an adminLogin.ejs file)
  res.render('admin-login');
});


// Registration route
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  User.register(new User({ username }), password, (err, user) => {
    if (err) {
      console.error(err);
      res.redirect('/register'); // Replace with your registration page route
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/profile'); // Replace with your profile page route
      });
    }
  });
});


// Updated Registration route
app.post('/register', (req, res) => {
  const { username, password, isAdmin } = req.body;
  User.register(new User({ username, isAdmin }), password, (err, user) => {
    if (err) {
      console.error(err);
      res.redirect('/register'); // Replace with your registration page route
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/profile'); // Replace with your profile page route
      });
    }
  });
});

// Registration route
app.get('/register', (req, res) => {
  res.render('registration'); // Render the registration form view
});

// Serve admin login page
app.get('/admin/login', (req, res) => {
  // Render the admin login view
  res.render('admin-login'); // Replace with the appropriate file or template engine syntax
});

// Fetch notices data
app.get('/admin/notices/upload', ensureAdminAuthenticated, async (req, res) => {
  try {
    const notices = await Notice.find({});
    res.render('notice-upload-form', { notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    // Handle the error appropriately, e.g., display an error message or redirect to an error page.
  }
});


// Use the upload middleware for handling file uploads
app.post('/admin/notices/upload', ensureAdminAuthenticated, upload.single('file'), async (req, res) => {
  // Process the notice upload form submission
  // Access the uploaded file via req.file
  // Save the notice details to the database
  // Redirect to the admin panel or display a success message

  // Example code to access the file details
  if (req.file) {
    const fileUrl = req.file.filename;
  }
});

// Handle admin login form submission
app.post('/admin/login', passport.authenticate('local', {
  successRedirect: '/admin/notices/upload', // Redirect to the notice upload form on successful login
  failureRedirect: '/admin/login', // Redirect to the login page on failed login
}));

// Handle notice upload form submission
app.post('/admin/notices/upload', ensureAuthenticated, (req, res) => {
  // Process the notice upload form submission
  // Save the notice details to the database
  // Redirect to the admin panel or display a success message
});

// Fetch notices data and render the notice upload form
app.get('/admin/notices/upload', ensureAdminAuthenticated, async (req, res) => {
  try {
    // Retrieve the notices from the database
    const notices = await Notice.find({});
    res.render('notices', { notices: notices }); // Pass the notices variable to the template
  } catch (error) {
    console.error('Error fetching notices:', error);
    // Handle the error appropriately, e.g., display an error message or redirect to an error page.
  }
});




// Handle the notices to display
app.get('/notices', async (req, res) => {
  try {
    // Retrieve the notices from the database
    const notices = await Notice.find({});
    res.render('notices', { notices });
  } catch (error) {
    console.error('Error retrieving notices:', error);
    // Handle the error appropriately, e.g., display an error message or redirect to an error page
  }
});

// Handle notice deletion
// Handle notice deletion
app.get('/notices/:id', ensureAdminAuthenticated, async (req, res) => {
  const noticeId = req.params.id;

  try {
    // Find the notice in the database by ID
    const notice = await Notice.findById(noticeId);

    if (!notice) {
      // Handle the case when the notice is not found
      return res.status(404).send('Notice not found');
    }

    // Render the notice deletion confirmation view
    res.render('notice-delete', { notice });
  } catch (error) {
    console.error('Error finding notice:', error);
    // Handle the error appropriately, e.g., display an error message or redirect to an error page
  }
});


// DELETE route for deleting a notice
app.delete('/notices/:id', ensureAdminAuthenticated, (req, res) => {
  const noticeId = req.params.id;
  Notice.findByIdAndDelete(noticeId)
    .then(() => {
      console.log('Notice deleted successfully');
      res.redirect('/notices');
    })
    .catch((error) => {
      console.error('Error deleting notice:', error);
      res.redirect('/notices');
    });
});


// Logout route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
});




// Create a new route to fetch and display notices
app.get('/noticesNews', async (req, res) => {
  try {
    // Fetch all notices from the database
    const notices = await Notice.find({});

    // Render the 'noticesNews' EJS file and pass the 'notices' data to it
    res.render('noticesNews', { notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    // Handle the error appropriately, e.g., display an error message or redirect to an error page.
    res.status(500).send('Internal Server Error');
  }
});


// View Profile Routes
app.get('/faculty/:id', (req, res) => {
  const facultyId = req.params.id; // Get the faculty ID from the route parameter
  res.render(`faculty${facultyId}`); // Assuming the faculty files are named faculty1.ejs, faculty2.ejs, etc.
});




const bus = new EventEmitter();
bus.setMaxListeners(15); // Increase the limit to 15 listeners


app.listen(port, () => {
  console.log(`Server is started at http://localhost:${port}`);
});
