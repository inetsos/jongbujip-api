var express  = require('express');
var router   = express.Router();
var Store     = require('../models/Store');
var util     = require('../util');

// index
router.get('/', util.isLoggedin, function(req,res,next){
  Store.find({}).sort({username:1}).exec(function(err,stores){
    res.json(err||!stores? util.successFalse(err): util.successTrue(stores));
  });
});

// create
router.post('/', function(req,res,next){
  var newStore = new Store(req.body);
  newStore.save(function(err, store){
    res.json(err||!store? util.successFalse(err): util.successTrue(store));
  });
});

// show
router.get('/:username', util.isLoggedin, function(req,res,next){
  Store.findOne({username:req.params.username}).exec(function(err, store){
    res.json(err||!store? util.successFalse(err): util.successTrue(store));
  });
});

// update
router.put('/:username', util.isLoggedin, checkPermission, function(req,res,next){
  Store.findOne({username:req.params.username}).select({password:1}).exec(function(err,store){
    if(err||!store) return res.json(util.successFalse(err));

    // update user object
    store.originalPassword = store.password;
    store.password = req.body.newPassword? req.body.newPassword: store.password;
    for(var p in req.body){
      store[p] = req.body[p];
    }

    // save updated user
    store.save(function(err,store) {
      if(err||!store) return res.json(util.successFalse(err));
      else {
        store.password = undefined;
        res.json(util.successTrue(store));
      }
    });
  });
});

// destroy
router.delete('/:username', util.isLoggedin, checkPermission, function(req,res,next){
  Store.findOneAndRemove({username: req.params.username}).exec(function(err, store){
    res.json(err || !store ? util.successFalse(err) : util.successTrue(store));
  });
});

module.exports = router;

// private functions
function checkPermission(req,res,next){ //*
  Store.findOne({username:req.params.username}, function(err,store) {
    if(err||!store) return res.json(util.successFalse(err));
    else if(!req.decoded || store._id != req.decoded._id) 
      return res.json(util.successFalse(null,'권한이 없습니다.'));
    else next();
  });
}