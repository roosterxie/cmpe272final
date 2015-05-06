var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
/*
 * GET userlist.
 */
router.get('/classlist',stormpath.loginRequired, function(req, res) {
  var db = req.db;
  var getquery = {};
  var field = 'email';
  getquery[field] = res.locals.user.email;
  db.collection('classlist').find(getquery).sort({'class_number':1}).toArray(function (err, items) {
    res.json(items);
  });
});

router.post('/addclass', stormpath.loginRequired,function(req, res) {
  var db = req.db;
  var changegrade = (req.body.grade - 0);
  var changegpa = (req.body.gpa - 0);
  req.body.grade = changegrade;
  req.body.gpa = changegpa;
  db.collection('classlist').insert(req.body,function(err,result){
    res.send(
        (err === null) ? {msg: ''} : {mes: err}
    );
  });
});

router.delete('/deleteclass/:id',stormpath.loginRequired,function(req,res){
  var db = req.db;
  var classToDelete = req.params.id;
  db.collection('classlist').removeById(classToDelete, function(err, result){
    res.send((result === 1) ? {msg: ''} : { msg:'error: ' + err});
  });
});

module.exports = router;