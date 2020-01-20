const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')

var db;

MongoClient.connect('mongodb://localhost:27017/exam', (err, database) => {
  if (err) return console.log(err)
  db = database.db('exam')
  app.listen(3000, function(){
  console.log('listening on port 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

// Ga naar add 
app.get('/', (req, res) => {
  res.redirect('/add')
})

//add pagina
// om producten toe te voegen Form /add (GET)
app.get('/add', (req, res) => {
  res.render('index.ejs', {})
})

// Stuur product naar database /add (POST)
app.post('/add', (req, res) => {

  db.collection('students').findOne({naam: req.body.naam}) 
    .then(results => { //update products with results
      console.log(results)
        if (!results) {
          db.collection('students').insertOne(req.body, (err, result) => {
            if (err) return console.log(err)
             res.redirect('/list')
            })
        } 
    }); 
});


// Lijst alle producten /list (GET)
app.get('/list', (req, res) => {
  db.collection('students').find().sort({"naam":1}).toArray((err, result) => {
    if (err) return console.log(err)
    res.render('list.ejs', { students: result })
  })
})