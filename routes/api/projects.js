const express = require('express');
const router = express.Router();
const projects = require('../../Projects');

//Gets all Projects
router.get('/', (req, res) => res.json(projects));

//Get single project
router.get('/:id', (req, res) => {
    const found = projects.some(
        project => project.id === parseInt(req.params.id)
    );

    if (found) {
        res.json(
            projects.filter(project => project.id === parseInt(req.params.id))
        );
    } else {
        res.status(400).json({
            msg: `No project found found with the id: ${req.params.id}`
        });
    }
});

module.exports = router;
