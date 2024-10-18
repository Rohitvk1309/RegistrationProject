import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [registrations, setRegistrations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/registrations');
      setRegistrations(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/registration/${editId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/registration', formData);
      }
      fetchRegistrations();
      setFormData({ name: '', email: '', dateOfBirth: '', address: '', phoneNumber: '' });
      setEditId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    const registration = registrations.find(reg => reg._id === id);
    setFormData({
      name: registration.name,
      email: registration.email,
      dateOfBirth: registration.dateOfBirth.split('T')[0], 
      address: registration.address,
      phoneNumber: registration.phoneNumber,
    });
    setEditId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/registration/${id}`);
      fetchRegistrations();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
        <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
        <button type="submit">{editId ? 'Update' : 'Submit'}</button>
      </form>

      <h2>Registrations List</h2>
      <ul>
        {registrations.map((registration) => (
          <li key={registration._id}>
            {registration.name} - {registration.email}
            <div>
              <button className="edit-button" onClick={() => handleEdit(registration._id)}>Edit</button>
              <button onClick={() => handleDelete(registration._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
