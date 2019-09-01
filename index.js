const express = require('express');
const path = require('path');
const THREE = require('three');

const app = express();

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/projects', require('./routes/api/projects'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
