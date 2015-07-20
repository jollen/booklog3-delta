var express = require('express');
var router = express.Router();
var events = require('events');

router.get('/1/post', function(req, res, next) {
  var workflow = new events.EventEmitter();  
  var Post = req.app.db.model.Post;

  workflow.outcome = {
      success: false,
      errfor: {}
  };

  workflow.on('validation', function() {
    workflow.emit('readPost');
  });

  workflow.on('readPost', function() {
    Post
      .find({})
      .exec(function(err, posts) {
        workflow.outcome.success = true;
        workflow.outcome.posts = posts;
        workflow.emit('response');
      });
  });

  workflow.on('response', function() {
      res.send(workflow.outcome);
  });
  
  workflow.emit('validation');
});

router.get('/1/post/:id', function(req, res, next) {
  req.app.db.model.Post.findById(req.params.id, function(err, posts) {
  	res.json(posts);
  });
});

router.post('/1/post', function(req, res, next) {
  var workflow = new events.EventEmitter();  
  var Post = req.app.db.model.Post;

  workflow.outcome = {
      success: false,
      errfor: {}
  };

  workflow.on('validation', function() {
    console.log(req.body)
    if (req.body.title.length === 0) 
        workflow.outcome.errfor.title = '這是必填欄位';
  
    if (typeof(req.body.content) === 'undefined' 
        || req.body.content.length === 0)
        workflow.outcome.errfor.content = '這是必填欄位';
  
    if (Object.keys(workflow.outcome.errfor).length !== 0) {
        workflow.outcome.success = false;
        return workflow.emit('response');
    }
  
    workflow.emit('savePost');
  });

  workflow.on('savePost', function() {
    var doc = new Post({
      title: req.body.title,
      content: req.body.content
    });
  
    doc.save(function(err, post) {
      workflow.outcome.success = true;
      workflow.outcome.post = post;

      workflow.emit('response');
    });
  });

  workflow.on('response', function() {
      res.send(workflow.outcome);
  });
  
  workflow.emit('validation');
});

router.delete('/1/post/:id', function(req, res, next) {
  req.app.db.model.Post.findByIdAndRemove(req.params.id, function(err, posts) {
  	res.json(posts);
  });
});

router.put('/1/post/:id', function(req, res, next) {
  var fieldsToSet = {
  	title: req.query.title,
  	content: req.query.content
  };

  req.app.db.model.Post.findOneAndUpdate({_id: req.params.id}, fieldsToSet, function(err, post) {
  	res.json(post);
  });
});

module.exports = router;
