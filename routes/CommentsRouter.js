
// POST endpoint to add a comment to a photo
const express = require('express');
const router = express.Router();
const Photo = require("../db/photoModel");
const jwtAuth = require('../middleware/jwtAuth'); // Đường dẫn đến jwtAuth middleware

// POST endpoint to add a comment to a photo
router.post('/:photo_id', jwtAuth, async (req, res) => { // Sử dụng jwtAuth ở đây
    const { comment } = req.body;
    const photoId = req.params.photo_id;

    if (!comment) {
        return res.status(400).send({ error: 'Comment cannot be empty' });
    }

    try {
        const photo = await Photo.findById(photoId);
        if (!photo) {
            return res.status(404).send({ error: 'Photo not found' });
        }

        const newComment = {
            comment: comment,
            user_id: req.userId, // UserId được lấy từ JWT sau khi xác thực
            date_time: new Date()
        };

        // Thêm bình luận mới vào mảng bình luận của ảnh và lưu lại
        photo.comments.push(newComment);
        await photo.save();

        res.status(201).send(newComment);
    } catch (error) {
        console.error('Server error when adding a comment:', error);
        res.status(500).send({ error: 'Failed to add comment' });
    }
});

module.exports = router;


module.exports = router;
