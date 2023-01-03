var express = require('express');
var router = express.Router();

router.get('/oauth2callback', function(req, res, next) {
  const { state, code } = req.query
  req.io.to(state).emit('login',{code})

  res.redirect('/login_success')
})

module.exports = router;
