const express = require('express');
const router = new express.Router();
const jotgles = require('../controllers/jotgle')


router.post('/jotgles', jotgles.createJotgle);
router.get('/jotgles', jotgles.getJotgles);
router.get('/jotgles/:id',jotgles.getAJotgle);
router.delete('/jotgles/:id', jotgles.deleteJotgle);
router.patch('/jotgles/:id', jotgles.updateJotgle);

module.exports = router;