const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());


//Database connection to my mongodbatlas Database:Party1
const uri = "mongodb+srv://yun12348:Yun051245@cluster0.xyrqju1.mongodb.net/Party1?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

  //User collection 
  //limitation: using mongodbatlas as a userId is very inconvenient for large scale web app
  const UserSchema = new mongoose.Schema({  
    email: { type: String, required: true, unique: true },
    password: {type: String, required: true},
    surveyCompleted: { type: Boolean, default: false },
    gender: String,
    relationshipStatus: String,
    musicTypes: [String]
  }, { collection: 'User' });

const User = mongoose.model('User', UserSchema);



//booking collection
const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    eventId: String,
    amount: Number,
    specialRequest: String,
    date: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', BookingSchema);

//event collection which we have sendData.js to push those
const EventSchema = new mongoose.Schema({
    name: String,
    match: Number,
    status: String,
    image: String,
    location: String
});

const Event = mongoose.model('Event', EventSchema);

const JWT_SECRET = '1234';


//verifying token for jwt
//limitation: cannot make the token refresh on its own and if the token expired it require us to clear cache on our browser
//since we save it using localstorage

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Auth header:', authHeader);
  if (!authHeader) return res.status(401).send('Access Denied: No Authorization header');
  
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).send('Access Denied: No token provided');
  
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    console.log('Verified token:', verified);
    req.userId = verified.userId;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).send('Invalid Token');
  }
};
  module.exports = verifyToken;




//sign up method. User will input only email and password in the signup page and the rest will be update on the survey page
//password must contain atleast 6 characters and must contain special character namely !@#$%^&*(){}?
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const specialChars = /[!@#$%^&*()_+{}?]/;
    if (password.length < 6 || !specialChars.test(password)) {
      return res.status(400).send('Password must be at least 6 characters long and contain a special character');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      surveyCompleted: false,  
      gender: null,
      relationshipStatus: null,
      musicTypes: []
    });
    await user.save();
    res.status(201).send('User created');
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).send('Internal Server Error');
  }
});


//a function to update user profile so they can select gender, relationship and their prefer music types
//This is why mongodb object id is very inconvinient since we have to pass userId
app.put('/survey', verifyToken, async (req, res) => {
  console.log('Survey update request received');
  console.log('User Id from token:', req.userId);
  const { gender, relationshipStatus, musicTypes } = req.body;
  
  console.log('Received survey data:', { gender, relationshipStatus, musicTypes });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        surveyCompleted: true,
        gender,
        relationshipStatus,
        musicTypes
      },
      { new: true }
    );

    console.log('User updated:', updatedUser ? 'Yes' : 'No');
    
    if (!updatedUser) {
      console.log('User not found for update');
      return res.status(404).send('User not found');
    }

    console.log('Updated user data:', updatedUser);
    res.status(200).send('Survey stored');
  } catch (error) {
    console.error('Error during survey submission:', error);
    res.status(500).send('An error occurred during survey submission');
  }
});

//apply limited login attemt per ip address by using express-rate-limit 
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1000h' });
    const surveyCompleted = user.surveyCompleted;
    res.json({ token, surveyCompleted });
  } else {
    res.status(400).send('Invalid credentials');
  }
});


// function to display events in database collection:events
app.get('/events', verifyToken, async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (error) {
        console.error('Fetch events error:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});
// display each events seperately so user can see details of each events
app.get('/events/:id', verifyToken, async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error('Fetch event details error:', error);
        res.status(500).json({ error: 'Failed to fetch event details' });
    }
});

//this function is to call events detail when user want to see their booking details.
//so we need to use Userid to find in events collection (this function takes longest) because it return as an array inside array
  app.get('/calleventhistory', verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.userId });
        const eventIds = bookings.map(booking => booking.eventId);
        const events = await Event.find({ _id: { $in: eventIds } });
        const eventMap = events.reduce((acc, event) => {
            acc[event._id.toString()] = event;
            return acc;
        }, {});

        const historyWithEventDetails = bookings.map(booking => ({
            _id: booking._id,
            amount: booking.amount,
            specialRequest: booking.specialRequest,
            date: booking.date,
            event: eventMap[booking.eventId.toString()] || null
        }));

        res.json(historyWithEventDetails);
    } catch (error) {
        console.error('Error fetching event history:', error);
        res.status(500).json({ message: 'Failed to fetch event history', error: error.message });
    }
  });

  // Fetch user history of booking
app.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await Booking.find({ userId: req.userId });
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error); 
    res.status(500).send('Failed to fetch history');
  }
});

//this function is to add booking to collection:bookings
app.post('/book', verifyToken, async (req, res) => {
    try {
        const { eventId, amount, specialRequest } = req.body;

        const booking = new Booking({
            userId: req.userId,
            eventId,
            amount,
            specialRequest,
            date: new Date()
        });

        await booking.save();

        res.status(201).send('Booking confirmed');
    } catch (error) {
        console.error('Error confirming booking:', error);
        res.status(500).send('Failed to confirm booking');
    }
});



//this function is used to display user profile 
app.get('/profile', verifyToken, async (req, res) => {
  console.log('Profile request received');
  console.log('User Id from token:', req.userId);
  try {
    const user = await User.findById(req.userId);
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json({ profile: user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Failed to fetch profile');
  }
});

//function to delete booking but there are no bookingid, we've tried to delete eventId but it cannot be used  
app.delete('/deletebooking/:eventId', verifyToken, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const result = await Booking.deleteOne({ eventId: eventId, userId: req.userId });
    if (result.deletedCount === 0) {
      return res.status(404).send('failed');
    }
    res.status(200).send('Booking deleted successfully');
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).send('Internal Server Error');
  }
}); 

//update profile function so user can edit their preferences
app.put('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
    res.json({ profile: user });
  } catch (error) {
    console.error('Error updating profile:', error); 
    res.status(500).send('Failed to update profile');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
