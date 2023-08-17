const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const crypto = require("crypto");
dotenv.config();

const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: "v4",
});


router.get("/upload", async (req, res) => {
    const rawBytes = crypto.randomBytes(16);
    const imageName = rawBytes.toString("hex");

    const fileSizeLimit = 3 * 1024 * 1024; // 3MB limit in bytes
    const contentType = req.query.type || "image/jpeg";

    if (!["image/jpeg", "image/png", "image/jpg"].includes(contentType)) {
        return res.status(400).json({ error: "Invalid content type" });
    }

    if (req.query.size > fileSizeLimit) {
        return res.status(400).json({ error: "File size exceeds the limit" });
    }

    const s3Params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
        ContentType: req.query.type,
        Expires: 5 * 60,
    };

    try {
        const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);
        res.status(200).json({ uploadURL, imageName });
    } catch (error) {
        res.status(500).json({ error });
    }
});

/**
 * @swagger
 * tags:
 *   name: S3
 *   description: Operations related to Amazon S3
 * /upload:
 *   get:
 *     tags:
 *       - S3
 *     summary: Generate a pre-signed URL for image upload to Amazon S3
 *     parameters:
 *       - name: type
 *         in: query
 *         description: Content type of the image (e.g., image/jpeg)
 *         required: false
 *         type: string
 *       - name: size
 *         in: query
 *         description: Size of the image in bytes
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         schema:
 *           type: object
 *           properties:
 *             uploadURL:
 *               type: string
 *               description: Pre-signed URL for uploading the image
 *             imageName:
 *               type: string
 *               description: The name of the generated image
 *       400:
 *         description: Bad Request
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: "#/definitions/ErrorResponse"
 */

module.exports = router;
