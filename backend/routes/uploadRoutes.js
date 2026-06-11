const express = require('express');
const multer = require('multer');
const path = require('path');
const supabase = require('../config/supabaseClient');
const { protect } = require('../middleware/authMiddleware');
const { trader } = require('../middleware/roleMiddleware');

const router = express.Router();

// Configure storage in memory for uploading to Supabase
const storage = multer.memoryStorage();

// File filter (accept images only)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, JPEG, PNG, WEBP, GIF) are allowed!'));
  }
}

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

// POST /api/upload - Protected, only trader and admin can upload to Supabase
router.post('/', protect, trader, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error('Supabase Storage Error:', error);

      // Fallback to local storage if Supabase fails (e.g. bucket missing)
      try {
        const fs = require('fs').promises;
        const fsSync = require('fs');

        console.log('Using Base64 fallback (Supabase bucket missing)');
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        return res.status(200).json({
          message: 'Image processed as Base64 (Supabase persistent fallback)',
          imageUrl: base64Image
        });
      } catch (localError) {
        console.error('Base64 Fallback Error:', localError);
        return res.status(500).json({ message: `Storage Error: ${localError.message}` });
      }
    }

    // Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    res.status(200).json({
      message: 'Image uploaded successfully to permanent storage',
      imageUrl: publicUrlData.publicUrl
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: error.message });
  }
}, (error, req, res, next) => {
  res.status(400).json({ message: error.message });
});

module.exports = router;
