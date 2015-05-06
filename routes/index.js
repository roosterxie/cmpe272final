var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*GET profile page*/
router.get('/profile', stormpath.loginRequired, function(req, res) {
  res.render('profile',{
    first : res.locals.user.givenName,
    last : res.locals.user.surname,
    title: res.locals.user.email});
});

router.get('/result', function(req, res) {
  res.redirect('/');
});

router.post('/result', function(req, res) {
  var rclassa = 0;
  var rclassb = 0;
  var rclassc = 0;
  var acount = 0;
  var bcount = 0;
  var ccount = 0;

  var currentgpa = req.body.inputGPA;
  var classanum = req.body.classanum;
  var classbnum = req.body.classbnum;
  var classcnum = req.body.classcnum;
  var classaname = req.body.classadep + classanum;
  var classbname = req.body.classbdep + classbnum;
  var classcname = req.body.classcdep + classcnum;

  var db = req.db;
  var mainquery={};
  var subquery1 = {};
  var subquery2 = {};
  var field = '$in';
  var fieldgt = '$gt';
  var fieldlt = '$lt';
  subquery1[fieldgt] = (currentgpa-0.15);
  subquery1[fieldlt] = ((currentgpa-0)+0.15);
  subquery2[field] = [classanum,classbnum,classcnum];

  console.log('q1 is ',subquery1);
  console.log('q2 is ',subquery2);
  mainquery['gpa']=subquery1;
  mainquery['class_number']=subquery2;
  console.log(mainquery);
  db.collection('classlist').find(mainquery).toArray(function (err, items) {//get all the people data
    console.log('fetch data is ', items);

    for(var i in items)switch (items[i].class_number) {
      case classanum:
        acount++;
        rclassa += items[i].grade;
        break;
      case classbnum:
        bcount++;
        rclassb += items[i].grade;
        break;
      case classcnum:
        ccount++;
        rclassc += items[i].grade;
        break;
    }
    rclassa = rclassa/acount;
    rclassb = rclassb/bcount;
    rclassc = rclassc/ccount;

    res.render('result',{
      classaname : classaname,
      classbname : classbname,
      classcname : classcname,
      classa : rclassa,
      classb : rclassb,
      classc : rclassc});
    });
  });

module.exports = router;
