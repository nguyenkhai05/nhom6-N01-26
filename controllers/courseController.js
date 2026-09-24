const CourseModel = require('../models/courseModel');

const CourseController = {
    getAllCourses: async (req, res) => {
        try {
            const courses = await CourseModel.getAll();
            res.status(200).json({ success: true, data: courses });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getCourseById: async (req, res) => {
        try {
            const course = await CourseModel.getById(req.params.id);
            if (!course) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy khóa học' });
            }
            res.status(200).json({ success: true, data: course });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    createCourse: async (req, res) => {
        try {
            const newId = await CourseModel.create(req.body);
            res.status(201).json({ success: true, message: 'Tạo khóa học thành công', id: newId });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    updateCourse: async (req, res) => {
        try {
            const affected = await CourseModel.update(req.params.id, req.body);
            if (!affected) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy ID' });
            }
            res.status(200).json({ success: true, message: 'Cập nhật thành công' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    deleteCourse: async (req, res) => {
        try {
            const affected = await CourseModel.delete(req.params.id);
            if (!affected) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy ID' });
            }
            res.status(200).json({ success: true, message: 'Xóa thành công' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = CourseController;