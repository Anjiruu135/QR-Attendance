import express from "express";
import { db } from "../../db.js";
import multer from "multer";

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

router.post("/api/add_instructor", upload.single('instructor_pic'), (req, res) => {
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
            res.status(200).send('Route Successful');
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