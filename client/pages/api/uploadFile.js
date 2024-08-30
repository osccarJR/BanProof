import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';

const upload = multer({
    storage: multer.diskStorage({
        destination: '../../public/uploads', 
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        },
    }),
});

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Sorry, something went wrong! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Method '${req.method}' not allowed` });
    },
});


apiRoute.use(upload.single('file'));

apiRoute.post((req, res) => {
    
    res.status(200).json({ fileUrl: `/uploads/${req.file.filename}` });
});

export default apiRoute;

export const config = {
    api: {
        bodyParser: false, 
    },
};
