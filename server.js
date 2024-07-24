const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (assuming it's running locally)
mongoose.connect('mongodb://localhost:27017/school_attendance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define MongoDB Schemas and Models
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  level: String,
  course: String,
  matricNumber: String,
});

const courseSchema = new Schema({
  name: String,
  time: String,
  venue: String,
  lecturer: String,
});

const attendanceSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  timestamp: { type: Date, default: Date.now },
});

const Student = mongoose.model('Student', studentSchema);
const Course = mongoose.model('Course', courseSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
// Student login endpoint
app.post('/login', async (req, res) => {
  const { level, course, matricNumber } = req.body;
  try {
    const student = await Student.findOne({ level, course, matricNumber });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Fetch courses for the day
    const courses = await Course.find();
    res.json({ student, courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Mark attendance endpoint
app.post('/markAttendance', async (req, res) => {
  const { studentId, courseId } = req.body;
  try {
    const newAttendance = new Attendance({ studentId, courseId });
    await newAttendance.save();
    res.json({ message: 'Attendance marked successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
