const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/registrationDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  address: { type: String },
  phoneNumber: { type: String }
});

const Registration = mongoose.model('Registration', registrationSchema);

// CRUD Operations
// Create Registration - API
app.post('/api/registration', async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    res.status(201).send(registration);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read all Registrations- API
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find();
    res.status(200).send(registrations);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update Registration- API
app.put('/api/registration/:id', async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!registration) {
      return res.status(404).send();
    }
    res.status(200).send(registration);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete Registration- API
app.delete('/api/registration/:id', async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).send();
    }
    res.status(200).send(registration);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
