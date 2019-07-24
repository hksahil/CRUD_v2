/*By ACADEMIA Sahil choudhary*/

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
mongoose.connect('mongodb://hksahil01:hksahil01@ds147446.mlab.com:47446/crudappv1');
const mongooseAlgolia = require('mongoose-algolia');
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: Number,
    content: String,
    author: String
}, {collection: 'user-data'});
/*
Note:This is a must line.It creates model buti have written this line in end.var UserData = mongoose.model('UserData', userDataSchema);
*/

/*Name of model=Userdata
Name of Schema=userDataschema
name of collection=user-data*/


/*---------------------------------------------------------------------------*/
/*Algolia code starts */

userDataSchema.plugin(mongooseAlgolia,{
  appId: '9RG1P1GREQ',
  apiKey: '775e9f5e55190ceed3ab146958e2aad8',
  indexName: 'Crudapp', //The name of the index in Algolia, you can also pass in a function
  selector: 'title content', //You can decide which field that are getting synced to Algolia (same as selector in mongoose)
  /*populate: {
    path: 'comments',
    select: 'author'
  },*/
  defaults: {
    author: 'unknown'
  },
  mappings: {
    title: function(value) {
      return `Search result: ${value}`
    }
  },
  debug: true // Default: false -> If true operations are logged out in your console
});
 
 
var UserData =mongoose.model('User-data', userDataSchema);

UserData.SyncToAlgolia(); //Clears the Algolia index for this schema and synchronizes all documents to Algolia (based on the settings defined in your plugin settings)
UserData.SetAlgoliaSettings({
  searchableAttributes: ['title','content'] //Sets the settings for this schema, see [Algolia's Index settings parameters](https://www.algolia.com/doc/api-client/javascript/settings#set-settings) for more info.
});



/*Algolia code ends*/
/*---------------------------------------------------------------------------*/



var UserData = mongoose.model('UserData', userDataSchema);//creates model
/* GET home page. */
router.get('/', function (req, res, next) { //localhost:8000/
    res.render('homepage');
});



router.get('/getdata', function (req, res, next) { //localhost:8000/getdata
    UserData.find()
        .then(function (datacame) {
            res.render('getdata', {
                items: datacame    
            });
        });
});







router.get('/putdata', function (req, res, next) { //localhost:8000/insertdata

    res.render('putdata');

});

router.post('/putdata', function (req, res, next) {
    var item = {
        title: req.body.title,
        price: req.body.price,
        content: req.body.content,
    };

    var data = new UserData(item);
    data.save();
    res.redirect('/');
});






router.get('/getdata/:id', function (req, res, next) {
    UserData.findOne({
            _id: req.params.id
        })
        .then(function (data) {
            res.render('detailpage', {
                items: data 
            });

        })





});




//these routes are for buttons
router.get('/sortedlowtohigh', function (req, res, next) { //localhost:8000/getdata
    UserData.find().sort({"price":1})
        .then(function (datacame) {
            res.render('getdata', {
                items: datacame    
            });
        });
});

router.get('/sortedhightolow', function (req, res, next) { //localhost:8000/getdata
    UserData.find().sort({"price":-1})
        .then(function (datacame) {
            res.render('getdata', {
                items: datacame    
            });
        });
});




module.exports = router;

