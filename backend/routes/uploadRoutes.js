const express = require('express');
const multer = require('multer');
const path = require('path');
const supabase = require('../config/supabaseClient');
const { protect } = require('../middleware/authMiddleware');
const { trader } = require('../middleware/roleMiddleware');

const router = express.Router();

// Configure storage in memory for uploading to Supabase
const storage = multer.memoryStorage();

// File filter (accept images, documents, and audio)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|gif|pdf|doc|docx|csv|txt|webm|mp3|wav|ogg|m4a|weba/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype) || file.mimetype.includes('pdf') || file.mimetype.includes('document') || file.mimetype.includes('text') || file.mimetype.includes('csv') || file.mimetype.includes('audio');

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images, documents, and audio files are allowed!'));
  }
}


const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});

// POST /api/upload - Protected, any authenticated user can upload
router.post('/', protect, upload.single('image'), async (req, res) => {
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
