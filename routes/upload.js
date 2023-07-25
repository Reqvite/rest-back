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

// Helper function to check if a given mimeType is allowed
function isAllowedMimeType(mimeType) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    return allowedTypes.includes(mimeType);
}

router.post("/upload", upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    const fileExtension = req.file.originalname.substring(
        req.file.originalname.lastIndexOf(".")
    );

    // Validate mimeType
    if (!isAllowedMimeType(req.file.mimetype)) {
        return res.status(400).json({ error: "Invalid file type" });
    }

    // Validate extension
    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
        return res.status(400).json({ error: "Invalid file extension" });
    }

    // Validate size
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSizeInBytes) {
        return res.status(400).json({ error: "File size exceeds the limit (5MB)" });
    }

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

/**
 * @openapi
 * swagger: "2.0"
 * info:
 *   version: "1.0.0"
 *   title: "Image Upload API"
 *   description: "API to upload images to Amazon S3 using Express and Multer"
 * basePath: "/"
 * tags:
 *   - name: "s3"
 *     description: "Operations related to Amazon S3"
 *
 * paths:
 *   /api/upload:
 *     post:
 *       tags:
 *         - "s3"
 *       summary: "Upload an image to Amazon S3"
 *       consumes:
 *         - "multipart/form-data"
 *       produces:
 *         - "application/json"
 *       parameters:
 *         - name: "image"
 *           in: formData
 *           description: "The image file to be uploaded"
 *           required: true
 *           type: "file"
 *       responses:
 *         200:
 *           description: "Successful response"
 *           schema:
 *             type: "object"
 *             properties:
 *               message:
 *                 type: "string"
 *                 description: "Success message"
 *               imageName:
 *                 type: "string"
 *                 description: "The name of the uploaded image"
 *         400:
 *           description: "Bad Request"
 *           schema:
 *             type: "object"
 *             properties:
 *               error:
 *                 type: "string"
 *                 description: "Error message"
 *         500:
 *           description: "Internal Server Error"
 *           schema:
 *             type: "object"
 *             properties:
 *               error:
 *                 type: "string"
 *                 description: "Error message"
 *
 * definitions:
 *   ErrorResponse:
 *     type: "object"
 *     properties:
 *       error:
 *         type: "string"
 *         description: "Error message"
 *   SuccessResponse:
 *     type: "object"
 *     properties:
 *       message:
 *         type: "string"
 *         description: "Success message"
 *       imageName:
 *         type: "string"
 *         description: "The name of the uploaded image"
 */

module.exports = router;