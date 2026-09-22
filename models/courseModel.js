const db = require('../config/dbconnection');

const CourseModel = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM courses');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM courses WHERE course_id = ?', [id]);
        return rows[0]; // Trả về 1 object thay vì mảng chứa 1 phần tử
    },

    create: async (data) => {
        const { instructor_id, category_id, title, slug, price, status } = data;
        const [result] = await db.query(
            'INSERT INTO courses (instructor_id, category_id, title, slug, price, status) VALUES (?, ?, ?, ?, ?, ?)',
            [instructor_id, category_id, title, slug, price, status]
        );
        return result.insertId;
    },

    update: async (id, data) => {
        const { title, price, status } = data;
        const [result] = await db.query(
            'UPDATE courses SET title = ?, price = ?, status = ? WHERE course_id = ?',
            [title, price, status, id]
        );
        return result.affectedRows;
    },

    delete: async (id) => {
        const [result] = await db.query('DELETE FROM courses WHERE course_id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = CourseModel;