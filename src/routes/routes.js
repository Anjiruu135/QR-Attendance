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

router.post("/api/login", (req, res) => {
  const { instructor_id, password } = req.body;

  const sql = 'SELECT tbl_users.*, last_name, first_name FROM tbl_users JOIN tbl_instructors ON tbl_users.instructor_id = tbl_instructors.instructor_id WHERE tbl_users.instructor_id = ? AND password = ?;';
  db.query(sql, [instructor_id, password], (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        if (result.length > 0) {
          const { instructor_id, user_type, last_name, first_name } = result[0];
          const token = jwt.sign({ instructor_id, user_type }, process.env.JWT_SECRET, { expiresIn: '24h' });

          if (user_type === "User") {
            res.status(200).send({
              user_type: user_type,
              message: "Login successful for user",
              instructor_id: instructor_id,
              token: token,
              user_name: `${last_name}, ${first_name}`,
            });
          } else if (user_type === "Admin") {
            res.status(200).send({
              user_type: user_type,
              message: "Login successful for admin",
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

router.delete("/api/instructor/:instructor_id/delete", (req, res) => {
  const instructor_id = req.params.instructor_id;
  const instructor_pic = req.body.instructor_pic;

  console.log(instructor_pic)

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

  const sql = 'INSERT INTO tbl_students SET ?';
  db.query(sql, studentData, (err, result) => {
      if (err) {
          console.error('Route Error:', err);
          res.status(500).send('Route Error');
          return;
      }
      res.status(200).send('Insert Successful');
  });
});

router.get("/api/students", (req, res) => {
  db.query("SELECT * FROM tbl_students", (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        res.json(results);
      }
    });
});

export { router };