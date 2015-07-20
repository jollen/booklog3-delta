var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Jollen' });
});

router.get('/hello', function (req, res) {
  res.render('hello', { title: 'Hey', message: 'Yes!'});
});

router.get('/blog', function (req, res, next) {
  req.app.db.model.Post
    .find({})
    .populate('userId')
    .exec(function(err, posts) {
      if (!posts) return next('data is empty');
  	  res.render('blog', { posts: posts });
    });
});

router.get('/hello/:message', function(req, res, next) {
  res.render('index', { title: req.body.name });
});

module.exports = router;
