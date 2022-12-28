const {siteMapController} = require('../controllers');

const router = require('express').Router();

router.get('/', siteMapController.write);

module.exports = router;
