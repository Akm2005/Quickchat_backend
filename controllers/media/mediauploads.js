const cloudinary = require("../../config/cloudinaryconfig");
const multer = require("multer");
const apiResponse = require("../../utility/apiResponce");
// Configure Multer (store file in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

/**
 * Upload media to Cloudinary and return UUID with file URL
 */
const uploadMedia = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return apiResponse.validationError(res,{ error: "File upload failed" });
    }

    if (!req.file) {
        return apiResponse.validationError(res,{ error: "No file uploaded" });
    }

    try {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "uploads/" }, 
        (error, uploadResult) => {
          if (error) return   apiResponse.validationError(res,{ error });
          apiResponse.success(res,{
            uuid: uploadResult.public_id,
            fileUrl: uploadResult.secure_url,
          },)
        }
      ).end(req.file.buffer);
    } catch (error) {
        apiResponse.error(res,"Cloudinary upload failed");
    }
  });
};

module.exports = { uploadMedia };
