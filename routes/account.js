var express = require('express');
var router = express.Router();

router.get('/profile', function(req, res, next) {
  res.send('Display Name: ' + req.user.displayName);
});

module.exports = router;
