import express from "express";
import { db } from "../../db.js";
import multer from "multer";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
      return cb(null, `${Date.now()}_${file.originalname}`);
    }
  })
  
const upload = multer({
    storage: storage
})

router.post("/api/login", (req, res) => {
  const { instructor_id, password } = req.body;

  db.query("SELECT * FROM tbl_users WHERE instructor_id = ? AND password = ?", [instructor_id, password], (error, result) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error fetching data");
      } else {
        if (result.length > 0) {
          const { instructor_id, user_type } = result[0];
          if (user_type === "User") {
            console.log(instructor_id);
            console.log(user_type);
            res.status(200).send({
              user_type: user_type,
              message: "Login successful for user",
            });
          } else if (user_type === "Admin") {
            console.log(instructor_id);
            console.log(user_type);
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
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

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
  const filePath = `/uploads/${req.file.filename}`;
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

export { router };