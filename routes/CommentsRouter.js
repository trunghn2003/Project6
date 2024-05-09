
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
router.delete('/photo/:photoId/comment/:commentId', jwtAuth, async (req, res) => {
    try {
        const { photoId, commentId } = req.params;
        const userId = req.userId; // Lấy userId từ JWT token

        // Tìm photo chứa comment
        const photo = await Photo.findById(photoId);
        if (!photo) {
            return res.status(404).send({ error: "Photo not found" });
        }

        // Tìm comment trong photo
        const comment = photo.comments.id(commentId);
        if (!comment) {
            return res.status(404).send({ error: "Comment not found" });
        }

        // Kiểm tra quyền xóa comment
        if (comment.user_id.toString() !== userId && photo.user_id.toString() !== userId) {
            return res.status(403).send({ error: "Not authorized to delete this comment" });
        }

        // Xóa comment
        // comment.remove();
        // if(photo.comments.length == 1){
        //     photo.comments = [];
        // }
        // else 
        photo.comments.remove(comment);
        // if(photo.comments.length == 0){
        //     photo.comments = [];
        // }

        // Lưu thay đổi vào database
        await photo.save();
        res.send({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: "Server error" });
    }
});

router.put('/photo/:photoId/comment/:commentId', jwtAuth, async (req, res) => {
    const { photoId, commentId } = req.params;
    const { comment } = req.body; // Dữ liệu comment mới từ body request
    const userId = req.userId; // Lấy userId từ JWT token

    if (!comment) {
        return res.status(400).send({ error: 'Comment cannot be empty' });
    }

    try {
        // Tìm photo chứa comment
        const photo = await Photo.findById(photoId);
        if (!photo) {
            return res.status(404).send({ error: "Photo not found" });
        }

        // Tìm comment trong photo
        const commentToUpdate = photo.comments.id(commentId);
        if (!commentToUpdate) {
            return res.status(404).send({ error: "Comment not found" });
        }

        // Kiểm tra quyền chỉnh sửa comment
        if (commentToUpdate.user_id.toString() !== userId) {
            return res.status(403).send({ error: "Not authorized to edit this comment" });
        }

        // Cập nhật nội dung comment
        commentToUpdate.comment = comment;

        // Lưu thay đổi vào database
        await photo.save();
        res.send({ message: "Comment updated successfully", comment: commentToUpdate });
    } catch (error) {
        console.error('Server error when editing a comment:', error);
        res.status(500).send({ error: "Failed to edit comment" });
    }
});

module.exports = router;

module.exports = router;


module.exports = router;
