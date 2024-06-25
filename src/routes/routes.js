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
      cb(null, './public/uploads/personnel');
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

// Entry Scan
router.post("/api/admin/scan", (req, res) => {
  const formData = req.body;

  const attendanceData = {
    date: formData.date,
    student_id: formData.student_id,
    time: formData.time,
  };

  const sql = `SELECT * FROM tbl_students WHERE student_id = '${attendanceData.student_id}';`;
  db.query(sql, attendanceData, (err, result) => {
      if (err) {
          console.error('Route Error:', err);
          res.status(500).send('Route Error');
          return;
      } else {
        if (result.length > 0) {
          const sql1 = `SELECT * FROM tbl_logs WHERE time_out IS NULL AND student_id='${attendanceData.student_id}' AND date='${attendanceData.date}';`;
          db.query(sql1, attendanceData, (err, result1) => {
              if (err) {
                  console.error('Route Error:', err);
                  res.status(500).send('Route Error');
                  return;
              } else {
                if (result1.length > 0) {
                  const sql2 = `UPDATE tbl_logs SET time_out='${attendanceData.time}' WHERE time_out IS NULL AND student_id='${attendanceData.student_id}' AND date='${attendanceData.date}';`;
                  db.query(sql2, attendanceData, (err, result) => {
                      if (err) {
                          console.error('Route Error:', err);
                          res.status(500).send('Route Error');
                          return;
                      } else {
                        res.status(200).send({
                          message: "Valid ID Time Out",
                        });
                      }
                  });
                } else {
                  const sql3 = `INSERT INTO tbl_logs(date, student_id, time_in) VALUES ('${attendanceData.date}','${attendanceData.student_id}','${attendanceData.time}');`;
                  db.query(sql3, attendanceData, (err, result) => {
                      if (err) {
                          console.error('Route Error:', err);
                          res.status(500).send('Route Error');
                          return;
                      } else {
                        res.status(200).send({
                          message: "Valid ID Time In",
                        });
                      }
                  });
                }
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

  const sql = 'SELECT tbl_users.*, last_name, first_name, section, position FROM tbl_users JOIN tbl_instructors ON tbl_users.instructor_id = tbl_instructors.instructor_id WHERE tbl_users.instructor_id = ? AND password = ?;';
  db.query(sql, [instructor_id, password], (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        if (result.length > 0) {
          const { instructor_id, user_type, last_name, first_name, section, position } = result[0];
          const token = jwt.sign({ instructor_id, user_type }, process.env.JWT_SECRET, { expiresIn: '24h' });

          if (user_type === "User") {
            res.status(200).send({
              user_type: user_type,
              message: "Login successful for user",
              instructor_id: instructor_id,
              token: token,
              user_name: `${last_name}, ${first_name}`,
              section: section,
              role: position,
            });
          } else if (user_type === "Admin") {
            res.status(200).send({
              user_type: user_type,
              message: "Login successful for admin",
              instructor_id: instructor_id,
              token: token,
              user_name: `${last_name}, ${first_name}`,
              section: section,
              role: position,
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
    const filePath = req.file ? `/uploads/personnel/${req.file.filename}` : null;

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
        position: formData.position,
    };
    const instructorAccount = {
        instructor_id: formData.instructor_id,
        password: formData.password,
        user_type: formData.user_type,
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
  const filePath = `/uploads/personnel/${req.file.filename}`;
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
      position: formData.position,
  };
  const instructorAccount = {
      instructor_id: formData.instructor_id,
      password: formData.password,
      user_type: formData.user_type,
  };

  const sql = `SELECT * FROM tbl_instructors WHERE instructor_id = '${instructorData.instructor_id}';`;
  db.query(sql, instructorData, (err, result) => {
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
                  res.status(200).send({
                    message: "Valid ID",
                  });
              });
          });
        }
      }   
  });
});

// Fetch Instructors
router.get("/api/instructors", (req, res) => {
    db.query("SELECT tbl_instructors.*, tbl_users.password FROM tbl_instructors JOIN tbl_users ON tbl_instructors.instructor_id = tbl_users.instructor_id WHERE position='Instructor'", (error, results) => {
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
  const sql = `SELECT s.*, COALESCE((SELECT COUNT(DISTINCT a.date) FROM tbl_attendance a WHERE a.student_id = s.student_id), 0) AS present, COALESCE((SELECT COUNT(DISTINCT a.date) FROM tbl_attendance a WHERE a.instructor_id = s.instructor_id), 0) AS total_days FROM tbl_students s WHERE s.instructor_id = '${uid}';`;
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

// Fetch Attendance Details for Admin Account
router.get("/api/admin/attendance/details", (req, res) => {
  const date = req.query.date;
  const sql = `SELECT a.date, i.section, CONCAT(i.last_name, ', ', i.first_name, ' ', i.middle_name) AS instructor_name, COUNT(DISTINCT a.student_id) AS present, (SELECT COUNT(s.student_id) FROM tbl_students s WHERE s.instructor_id = i.instructor_id) AS total_students FROM tbl_instructors i LEFT JOIN tbl_attendance a ON i.instructor_id = a.instructor_id AND a.date = '${date}' WHERE position = 'Instructor' GROUP BY a.date, i.section, i.instructor_id ORDER BY instructor_name;`;
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

// Fetch Attendance for Admin Account
router.get("/api/admin/attendance", (req, res) => {
  const sql = `SELECT a.date, COUNT(DISTINCT a.student_id) AS present, (SELECT COUNT(student_id) FROM tbl_students) AS total_students FROM tbl_attendance a GROUP BY a.date ORDER BY a.date DESC;`;
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
  const sql = `SELECT COALESCE(present_count, 0) AS present, COALESCE(total_count, 0) AS total_students FROM (SELECT (SELECT COUNT(DISTINCT a.student_id) FROM tbl_students s LEFT JOIN tbl_attendance a ON s.student_id = a.student_id AND a.date = '${date}' WHERE s.instructor_id = '${uid}') AS present_count,(SELECT COUNT(student_id) FROM tbl_students WHERE instructor_id = '${uid}') AS total_count) AS counts;`;
  db.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        res.json(results);
      }
    });
});

// Fetch Data for Admin Account Dashboard
router.get("/api/admin/dashboard/info", (req, res) => {
  const date = req.query.date;
  const sql = `SELECT COALESCE(present_count, 0) AS present, COALESCE(total_count, 0) AS total_students,COALESCE(instructor_count, 0) AS total_instructors FROM (SELECT (SELECT COUNT(DISTINCT a.student_id) FROM tbl_students s LEFT JOIN tbl_attendance a ON s.student_id = a.student_id AND a.date = '${date}') AS present_count,(SELECT COUNT(student_id) FROM tbl_students) AS total_count,(SELECT COUNT(instructor_id) FROM tbl_instructors WHERE position='Instructor') AS instructor_count) AS counts;`;
  db.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        res.json(results);
      }
    });
});

// Fetch Logs Admin
router.get("/api/admin/logs", (req, res) => {
  const sql = `SELECT date, section, CONCAT(tbl_students.last_name, ', ', tbl_students.first_name, ' ', tbl_students.middle_name) AS fullname, time_in, time_out FROM tbl_logs JOIN tbl_students on tbl_logs.student_id = tbl_students.student_id JOIN tbl_instructors on tbl_students.instructor_id = tbl_instructors.instructor_id ORDER BY time_in DESC;`;
  db.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        res.json(results);
      }
    });
});

// Fetch Logs for Time In Admin
router.get("/api/admin/logs/timein", (req, res) => {
  const date = req.query.date;
  const sql = `SELECT date, section, CONCAT(tbl_students.last_name, ', ', tbl_students.first_name, ' ', tbl_students.middle_name) AS fullname, time_in FROM tbl_logs JOIN tbl_students on tbl_logs.student_id = tbl_students.student_id JOIN tbl_instructors on tbl_students.instructor_id = tbl_instructors.instructor_id WHERE time_out IS NULL and date = '${date}' GROUP BY fullname;`;
  db.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        res.json(results);
      }
    });
});

// Fetch Logs for Time Out Admin
router.get("/api/admin/logs/timeout", (req, res) => {
  const date = req.query.date;
  const sql = `SELECT '${date}' AS date, section, CONCAT(tbl_students.last_name, ', ', tbl_students.first_name, ' ', tbl_students.middle_name) AS fullname, COALESCE(tbl_logs.time_out, '-') AS time_out FROM tbl_students LEFT JOIN tbl_logs ON tbl_students.student_id = tbl_logs.student_id AND tbl_logs.date = '${date}' AND tbl_logs.time_out IS NOT NULL JOIN tbl_instructors ON tbl_students.instructor_id = tbl_instructors.instructor_id WHERE tbl_students.student_id NOT IN (SELECT DISTINCT student_id FROM tbl_logs WHERE date = '${date}' AND time_in IS NOT NULL AND time_out IS NULL) GROUP BY fullname, time_out ORDER BY time_out DESC;`;
  db.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        res.json(results);
      }
    });
});

// Fetch Logs for Time In
router.get("/api/logs/timein", (req, res) => {
  const date = req.query.date;
  const uid = req.query.uid;
  const sql = `SELECT date, CONCAT(tbl_students.last_name, ', ', tbl_students.first_name, ' ', tbl_students.middle_name) AS fullname, time_in FROM tbl_logs JOIN tbl_students on tbl_logs.student_id = tbl_students.student_id WHERE time_out IS NULL and instructor_id = '${uid}' and date = '${date}' GROUP BY fullname;`;
  db.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        res.json(results);
      }
    });
});

// Fetch Logs for Time Out
router.get("/api/logs/timeout", (req, res) => {
  const date = req.query.date;
  const uid = req.query.uid;
  const sql = `SELECT '${date}' AS date, CONCAT(tbl_students.last_name, ', ', tbl_students.first_name, ' ', tbl_students.middle_name) AS fullname, COALESCE(tbl_logs.time_out, '-') AS time_out FROM tbl_students LEFT JOIN tbl_logs ON tbl_students.student_id = tbl_logs.student_id AND tbl_logs.date = '${date}' AND tbl_logs.time_out IS NOT NULL WHERE tbl_students.student_id NOT IN (SELECT DISTINCT student_id FROM tbl_logs WHERE date = '${date}' AND time_in IS NOT NULL AND time_out IS NULL) AND instructor_id = '${uid}' GROUP BY fullname, time_out ORDER BY time_out DESC;`;
  db.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        res.json(results);
      }
    });
});

// Fetch Users
router.get("/api/admin/users", (req, res) => {
  db.query("SELECT tbl_instructors.*, tbl_users.password FROM tbl_instructors JOIN tbl_users ON tbl_instructors.instructor_id = tbl_users.instructor_id WHERE position!='SuperAdmin'", (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        res.json(results);
      }
    });
});

export { router };