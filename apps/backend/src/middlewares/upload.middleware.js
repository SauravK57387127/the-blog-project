import multer from 'multer';
import path from 'path';

// Memory storage (file goes to req.file.buffer)
const storage = multer.memoryStorage();

// File filter (images only)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'image/svg+xml';

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(
            new Error(
                'Only image files are allowed (jpeg, jpg, png, gif, webp, svg)',
            ),
        );
    }
};

// Configure multer
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
});
