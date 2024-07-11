const mongoose = require('mongoose');

// MongoDB connection URI
const uri = "mongodb+srv://yun12348:Yun051245@cluster0.xyrqju1.mongodb.net/Party1?retryWrites=true&w=majority";

// Event Schema
const EventSchema = new mongoose.Schema({
    name: String,
    match: Number,
    status: String,
    image: String,
    location: String
});

const Event = mongoose.model('Event', EventSchema);

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    // Prepopulate events
    return Event.insertMany([
        { name: 'MILEY ISC', match: 95, status: 'AVAILABLE', image: 'https://i.postimg.cc/5y0QpBj3/image-20.png', location: 'Bangkok' },
        { name: 'TRUTH OR DARE', match: 88, status: 'AVAILABLE', image: 'https://i.postimg.cc/25RvmLXk/image-19.png', location: 'Bangkok' },
        { name: 'ECHELON', match: 85, status: 'AVAILABLE', image: 'https://i.postimg.cc/cHT8Q91C/image-24.png', location: 'Pattaya' },
        { name: 'URBAN', match: 99, status: 'UNAVAILABLE', image: 'https://i.postimg.cc/L6GgBZSt/images.jpg', location: 'Chiang Mai' },
        { name: 'CITY LIGHTS', match: 90, status: 'AVAILABLE', image: 'https://via.placeholder.com/150', location: 'Phuket' },
        { name: 'NIGHT OWL', match: 80, status: 'AVAILABLE', image: 'https://i.postimg.cc/tJMZcsxH/night.jpg', location: 'Phuket' },
        { name: 'BEAT BUNKER', match: 87, status: 'AVAILABLE', image: 'https://i.postimg.cc/MpjRhm53/bunker-pub-best-pub-in.jpg', location: 'Chiang Mai' },
        { name: 'WILD NIGHTS', match: 92, status: 'AVAILABLE', image: 'https://i.postimg.cc/hjKdQWBN/hh.jpg', location: 'Bangkok' }
    ]);
}).then(() => {
    console.log('Events populated successfully');
    mongoose.disconnect();
}).catch(err => {
    console.error('Error populating events:', err);
    mongoose.disconnect();
});
