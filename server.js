const express = require('express');
const app = express();

app.use(express.json());

const courseRoutes = require('./routes/courseRoutes');

app.use('/api/courses', courseRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});