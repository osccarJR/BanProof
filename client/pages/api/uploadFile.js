import multer from 'multer';
import next from 'next';
import { promises as fs } from 'fs';
import path from 'path';


const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};


const handler = async (req, res) => {
  
  const uploadFile = upload.single('file');

  uploadFile(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ fileUrl });
  });
};

export default handler;
