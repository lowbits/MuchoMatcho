var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	if(req.session.username)
    	res.redirect('/users');
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {


	req.session.username= req.body.username;
	   res.redirect('/users');

});


module.exports = router;
