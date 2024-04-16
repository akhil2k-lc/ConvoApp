const express = require("express");
const multer = require("multer");
const cors = require("cors");
const docxToPDF = require("docx-pdf");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());

// settting up the file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });
app.post("/convertFile", upload.single("file"), (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No file  uploaded",
            });
        }
        // Defining outout file path
        let outoutPath = path.join(
            __dirname,
            "files",
            `${req.file.originalname}.pdf`
        );
        docxToPDF(req.file.path, outoutPath, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Error converting docx to pdf",
                });
            }
            res.download(outoutPath, () => {
                console.log("file downloaded");
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});