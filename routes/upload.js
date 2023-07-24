const express = require("express");
const router = express.Router();
const multer = require("multer");
const s3 = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");

dotenv.config();

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const s3Client = new s3.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

router.post("/upload", upload.single('image'), async (req, res) => {
    console.log("req body:", req.body)
    console.log("req file:", req.file)

    const command = new s3.PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    });

    try{
        await s3Client.send(command);

        const imageName = req.file.originalname;
        // Include the image URL in the response
        res.status(200).json({ message: 'File uploaded successfully', imageName});
    }
    catch (err) {
        console.error('Error uploading to S3:', err);
        res.status(500).json({ error: 'Failed to upload to S3' });
    }
});

module.exports = router;