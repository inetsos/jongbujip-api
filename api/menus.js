var express  = require('express');
var router   = express.Router();
var Menu     = require('../models/menu');
var util     = require('../util');

// index
router.get('/', util.isLoggedin, function(req,res,next) {
    Menu.find({}).sort({menuNo:1}).exec(function(err,menus) {
        res.json( err || !menus ? util.successFalse(err) : util.successTrue(menus));
    });
});

// create
router.post('/', function(req,res,next) {
    var newMenu = new Menu(req.body);
    newMenu.save(function(err,menu) {
        res.json( err || !menu ? util.successFalse(err) : util.successTrue(menu));
    });
});

// show
router.get('/:menuNo', util.isLoggedin, function(req,res,next) {
    Menu.findOne({menuNo:req.params.menuNo}).exec(function(err,menu) {
        res.json( err || !menu ? util.successFalse(err) : util.successTrue(menu));
    });
});

// update
router.put('/:menuNo', util.isLoggedin, function(req,res,next) {
    Menu.findOne({menuNo:req.params.menuNo}).exec(function(err,menu) {
        if( err || !menu ) 
            return res.json(util.successFalse(err));

        // update menu object
         for(var p in req.body){
            menu[p] = req.body[p];
        }

        // save updated user
        menu.save(function(err,menu) {
            if( err || !menu) 
                return res.json(util.successFalse(err));
            else {
                res.json(util.successTrue(menu));
            }
        });
    });
});

// destroy
router.delete('/:menuNo', util.isLoggedin, function(req,res,next) {
    Menu.findOneAndRemove({menuNo:req.params.menuNo}).exec(function(err,menu){
        res.json(err || !menu ? util.successFalse(err) : util.successTrue(menu));
    });
});

module.exports = router;