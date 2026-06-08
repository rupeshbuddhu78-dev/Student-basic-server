require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares (Yeh frontend se aane wale data ko handle karenge)
app.use(express.json()); 
app.use(cors()); 

// Frontend ki HTML file ko serve karne ke liye
app.use(express.static(path.join(__dirname, 'index.html')));

// ==========================================
// 1. MONGODB ONLINE DATABASE CONNECTION
// ==========================================
// Yeh line tumhari .env file se MONGO_URI le rahi hai
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🔥 MongoDB Online Database Connected Successfully!'))
    .catch((err) => console.log('🚨 Database connection error:', err));

// ==========================================
// 2. MONGOOSE SCHEMA & MODEL (Data Structure)
// ==========================================
const studentSchema = new mongoose.Schema({
    name: String,
    className: String, 
    roll: Number,
    city: String
});

// Collection ka naam 'students' ban jayega autoamtically
const Student = mongoose.model('Student', studentSchema);

// ==========================================
// 3. CRUD API ROUTES
// ==========================================

// CREATE: Naya student add karna
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json({ message: "Student Successfully Added!" });
    } catch (error) {
        res.status(500).json({ error: "Data save nahi hua bhai" });
    }
});

// READ: Saare students ko fetch karna
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: "Data fetch karne mein error" });
    }
});

// UPDATE: Student ka data edit karna
app.put('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: "Student Data Updated!" });
    } catch (error) {
        res.status(500).json({ error: "Update mein error aaya" });
    }
});

// DELETE: Student ko database se udana
app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: "Student Deleted!" });
    } catch (error) {
        res.status(500).json({ error: "Delete karne mein error aaya" });
    }
});

// ==========================================
// 4. SERVER START
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server badhiya chal raha hai: http://localhost:${PORT}`);
});
