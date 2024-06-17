import express from "express";
import { db } from "../../db.js";
import multer from "multer";
import fs from "fs";
import jwt from 'jsonwebtoken';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'student_pic') {
      cb(null, './public/uploads/student');
    } else if (file.fieldname === 'qr_code') {
      cb(null, './public/uploads/qrcode');
    } else if (file.fieldname === 'instructor_pic') {
      cb(null, './public/uploads/instructor');
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
  
const upload = multer({
    storage: storage
});

// Attendance Scan
router.post("/api/attendance/scan", (req, res) => {
  const formData = req.body;

  const attendanceData = {
    date: formData.date,
    student_id: formData.student_id,
    instructor_id: formData.instructor_id,
    time: formData.time,
  };

  const sql = `SELECT * FROM tbl_students WHERE student_id = '${attendanceData.student_id}' and instructor_id = '${attendanceData.instructor_id}';`;
  db.query(sql, attendanceData, (err, result) => {
      if (err) {
          console.error('Route Error:', err);
          res.status(500).send('Route Error');
          return;
      } else {
        if (result.length > 0) {
          const sql1 = 'INSERT INTO tbl_attendance SET ?';
          db.query(sql1, attendanceData, (err, result) => {
              if (err) {
                  console.error('Route Error:', err);
                  res.status(500).send('Route Error');
                  return;
              } else {
                res.status(200).send({
                  message: "Valid ID",
                });
              }
          });
        } else {
          res.status(200).send({
            message: "Invalid ID",
          });
        }
      }
  });
});

// Login
router.post("/api/login", (req, res) => {
  const { instructor_id, password } = req.body;

  const sql = 'SELECT tbl_users.*, last_name, first_name, section FROM tbl_users JOIN tbl_instructors ON tbl_users.instructor_id = tbl_instructors.instructor_id WHERE tbl_users.instructor_id = ? AND password = ?;';
  db.query(sql, [instructor_id, password], (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        if (result.length > 0) {
          const { instructor_id, user_type, last_name, first_name, section } = result[0];
          const token = jwt.sign({ instructor_id, user_type }, process.env.JWT_SECRET, { expiresIn: '24h' });

          if (user_type === "User") {
            res.status(200).send({
              user_type: user_type,
              message: "Login successful for user",
              instructor_id: instructor_id,
              token: token,
              user_name: `${last_name}, ${first_name}`,
              section: section,
            });
          } else if (user_type === "Admin") {
            res.status(200).send({
              user_type: user_type,
              message: "Login successful for admin",
              instructor_id: instructor_id,
              token: token,
              user_name: `${last_name}, ${first_name}`,
              section: section,
            });
          } 
        } else {
          res.status(200).send({
            message: "Invalid Login",
          });
        }
      }
    });
});

// Delete Instructor
router.delete("/api/instructor/:instructor_id/delete", (req, res) => {
  const instructor_id = req.params.instructor_id;
  const instructor_pic = req.body.instructor_pic;

  if (instructor_pic) {
    fs.unlink(`./public${instructor_pic}`, (err) => {
        if (err) {
            console.error('Error deleting previous image:', err);
            res.status(500).send('Error deleting previous image');
            return;
        }
    });
  }

  const sql = 'DELETE FROM tbl_instructors WHERE instructor_id = ?';
  db.query(sql, [instructor_id], (err, result) => {
      if (err) {
          console.error('Route Error:', err);
          res.status(500).send('Error deleting data');
          return;
      }
      res.status(200).send('Delete Successful');
  });
});

// Update Instructor
router.post("/api/instructor/update", upload.single('instructor_pic'), (req, res) => {
    const formData = req.body;
    const filePath = req.file ? `/uploads/instructor/${req.file.filename}` : null;

    if (filePath && formData.instructorPicToUpdate) {
      fs.unlink(`./public${formData.instructorPicToUpdate}`, (err) => {
          if (err) {
              console.error('Error deleting previous image:', err);
              res.status(500).send('Error deleting previous image');
              return;
          }
      });
    }

    const instructorData = {
        instructor_id: formData.instructor_id,
        last_name: formData.last_name,
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        section: formData.section,
        instructor_pic: filePath,
        address: formData.address,
        contact: formData.contact,
        email: formData.email,
    };
    const instructorAccount = {
        instructor_id: formData.instructor_id,
        password: formData.password,
        user_type: 'User',
    };

    const sql1 = 'UPDATE tbl_instructors SET ? WHERE instructor_id = ?';
    db.query(sql1, [instructorData, formData.instructorToUpdate], (err, result) => {
        if (err) {
            console.error('Route Error:', err);
            res.status(500).send('Route Error');
            return;
        }

        const sql2 = 'UPDATE tbl_users SET ? WHERE instructor_id = ?';
        db.query(sql2, [instructorAccount, formData.instructorPicToUpdate], (err, result) => {
            if (err) {
                console.error('Route Error:', err);
                res.status(500).send('Route Error');
                return;
            }
            res.status(200).send('Update Successful');
        });
    });
});

// Add Instructor
router.post("/api/instructor/add", upload.single('instructor_pic'), (req, res) => {
  const formData = req.body;
  const filePath = `/uploads/instructor/${req.file.filename}`;
  const instructorData = {
      instructor_id: formData.instructor_id,
      last_name: formData.last_name,
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      section: formData.section,
      instructor_pic: filePath,
      address: formData.address,
      contact: formData.contact,
      email: formData.email,
  };
  const instructorAccount = {
      instructor_id: formData.instructor_id,
      password: formData.password,
      user_type: 'User',
  };

  const sql1 = 'INSERT INTO tbl_instructors SET ?';
  db.query(sql1, instructorData, (err, result) => {
      if (err) {
          console.error('Route Error:', err);
          res.status(500).send('Route Error');
          return;
      }

      const sql2 = 'INSERT INTO tbl_users SET ?';
      db.query(sql2, instructorAccount, (err, result) => {
          if (err) {
              console.error('Route Error:', err);
              res.status(500).send('Route Error');
              return;
          }
          res.status(200).send('Insert Successful');
      });
  });
});

// Fetch Instructors
router.get("/api/instructors", (req, res) => {
    db.query("SELECT tbl_instructors.*, tbl_users.password FROM tbl_instructors JOIN tbl_users ON tbl_instructors.instructor_id = tbl_users.instructor_id", (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).send("Error fetching data");
        } else {
          res.json(results);
        }
      });
});

// Delete Student
router.delete("/api/student/:student_id/delete", (req, res) => {
  const student_id = req.params.student_id;
  const student_pic = req.body.student_pic;
  const qr_code = req.body.qr_code;

  if (student_pic) {
    fs.unlink(`./public${student_pic}`, (err) => {
        if (err) {
            console.error('Error deleting previous image:', err);
            return res.status(500).send('Error deleting previous image');
        }
    });
  }

  if (qr_code) {
    fs.unlink(`./public${qr_code}`, (err) => {
        if (err) {
            console.error('Error deleting previous image:', err);
            return res.status(500).send('Error deleting previous image');
        }
    });
  }

  const sql = 'DELETE FROM tbl_students WHERE student_id = ?';
  db.query(sql, [student_id], (err, result) => {
      if (err) {
          console.error('Route Error:', err);
          res.status(500).send('Error deleting data');
          return;
      }
      res.status(200).send('Delete Successful');
  });
});

// Update Student
router.post("/api/student/update", upload.fields([{ name: 'student_pic', maxCount: 1 }, { name: 'qr_code', maxCount: 1 }]), (req, res) => {
  const formData = req.body;

  console.log('Received formData:', formData);
  
  const studentPicPath = req.files && req.files['student_pic'] ? `/uploads/student/${req.files['student_pic'][0].filename}` : null;
  const qrCodePath = req.files && req.files['qr_code'] ? `/uploads/qrcode/${req.files['qr_code'][0].filename}` : null;

  if (studentPicPath && formData.studentPicToUpdate) {
    fs.unlink(`./public${formData.studentPicToUpdate}`, (err) => {
        if (err) {
            console.error('Error deleting previous image:', err);
            return res.status(500).send('Error deleting previous image');
        }
    });
  }

  if (qrCodePath && formData.studentQRToUpdate) {
    fs.unlink(`./public${formData.studentQRToUpdate}`, (err) => {
        if (err) {
            console.error('Error deleting previous image:', err);
            return res.status(500).send('Error deleting previous image');
        }
    });
  }

  const studentData = {
    student_id: formData.student_id,
    instructor_id: formData.instructor_id,
    last_name: formData.last_name,
    first_name: formData.first_name,
    middle_name: formData.middle_name,
    student_pic: studentPicPath,
    address: formData.address,
    contact: formData.contact,
    qr_code: qrCodePath,
  };

  const sql1 = 'UPDATE tbl_students SET ? WHERE student_id = ?';
  db.query(sql1, [studentData, formData.studentToUpdate], (err, result) => {
      if (err) {
          console.error('Route Error:', err);
          res.status(500).send('Route Error');
          return;
      }
      res.status(200).send('Update Successful');
  });
});

// Add Student
router.post("/api/student/add", upload.fields([{ name: 'student_pic', maxCount: 1 }, { name: 'qr_code', maxCount: 1 }]), (req, res) => {
  const formData = req.body;
  const studentPicPath = `/uploads/student/${req.files['student_pic'][0].filename}`;
  const qrCodePath = `/uploads/qrcode/${req.files['qr_code'][0].filename}`;

  const studentData = {
    student_id: formData.student_id,
    instructor_id: formData.instructor_id,
    last_name: formData.last_name,
    first_name: formData.first_name,
    middle_name: formData.middle_name,
    student_pic: studentPicPath,
    address: formData.address,
    contact: formData.contact,
    qr_code: qrCodePath,
  };

  const sql = `SELECT * FROM tbl_students WHERE student_id = '${studentData.student_id}';`;
  db.query(sql, studentData, (err, result) => {
      if (err) {
          console.error('Route Error:', err);
          res.status(500).send('Route Error');
          return;
      } else
      {
        if (result.length > 0) {
          res.status(200).send({
            message: "Invalid ID",
          });
        }
        else {
          const sql1 = 'INSERT INTO tbl_students SET ?';
          db.query(sql1, studentData, (err, result) => {
              if (err) {
                  console.error('Route Error:', err);
                  res.status(500).send('Route Error');
                  return;
              }
              res.status(200).send({
                message: "Valid ID",
              });
          });
        }
      }   
  });
});

// Fetch Student for Instructor Account
router.get("/api/students", (req, res) => {
  const uid = req.query.uid;
  const sql = `SELECT * FROM tbl_students WHERE instructor_id = '${uid}';`;
  db.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        res.json(results);
      }
    });
});

// Fetch Attendance Details with Students for Instructor Account
router.get("/api/attendance/students", (req, res) => {
  const date = req.query.date;
  const uid = req.query.uid;
  const sql = `SELECT tbl_attendance.student_id, CONCAT(tbl_students.last_name, ' ', tbl_students.first_name, ' ', tbl_students.middle_name) AS fullname, time FROM tbl_attendance JOIN tbl_students on tbl_attendance.student_id = tbl_students.student_id WHERE date = '${date}' AND tbl_attendance.instructor_id = '${uid}' GROUP BY date, student_id;`;
  db.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        res.json(results);
      }
    });
});

// Fetch Attendance for Instructor Account
router.get("/api/attendance", (req, res) => {
  const uid = req.query.uid;
  const sql = `SELECT a.date, COUNT(DISTINCT a.student_id) AS present, (SELECT COUNT(student_id) FROM tbl_students WHERE instructor_id='${uid}') AS total_students FROM tbl_attendance a WHERE a.instructor_id='${uid}' GROUP BY a.date ORDER BY a.date DESC;`;
  db.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        res.json(results);
      }
    });
});

// Fetch Data for Instructor Account Dashboard
router.get("/api/dashboard/info", (req, res) => {
  const date = req.query.date;
  const uid = req.query.uid;
  const sql = `SELECT COALESCE(COUNT(DISTINCT a.student_id), 0) AS present, (SELECT COUNT(student_id) FROM tbl_students WHERE instructor_id = '${uid}') AS total_students FROM tbl_students s LEFT JOIN tbl_attendance a ON s.student_id = a.student_id AND a.date = '${date}' WHERE s.instructor_id = '${uid}' GROUP BY a.date;`;
  db.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        res.json(results);
      }
    });
});


export { router };