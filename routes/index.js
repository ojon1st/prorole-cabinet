var express = require('express');
var router = express.Router();

var indexcontroller = require('../controllers/indexcontroller')

/* GET home page. */
router.get('/', indexcontroller.home_get);

router.get('/login', indexcontroller.login_get);

router.post('/login', indexcontroller.login_post);

router.get('/logout', indexcontroller.user_logout_get);

module.exports = router;
