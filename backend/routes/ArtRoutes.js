const express = require("express")
const router = express.Router();
const ArtController = require('../controller/ArtistController');
const { middleWare, upload } = require('../middleware/AuthMiddle');

router.post('/upload-file', middleWare, upload.array('images'), ArtController.uploadArt);
router.get('/get-arts', middleWare, ArtController.getArt);
router.put('/update-art', middleWare, upload.array('images'), ArtController.updateArt);
router.delete('/delete-art', middleWare, ArtController.deleteArt);
router.get('/public-arts', ArtController.getPublicArts);

module.exports = router