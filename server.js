const express = require('express')
const hbs = require('hbs')
const fs = require('fs')

// setting it up to configure with Heroku or run locally
const port = process.env.PORT || 3000



// creating app by calling express function
var app = express();

// creating partials with handlebars
hbs.registerPartials(__dirname + '/views/partials')

// app.set lets you configure express settings.
  // it takes a bunch of key/value pairs
  // telling it to use handlebars as view engine
app.set('view engine', 'hbs');


// next is what you tell your express what to do after middleware is done
  // without calling next, app won't move past middleware
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`
  console.log(log)
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append server.log')
    }
  });
  next()
})

// app.use((req, res, next) => {
//   res.render('maintenance')
//   // next()
// })

// incorporating middleware into express
  // static takes argument of absolute path to your files
  // have to put this under, otherwise you can go to maintenance but still access the static files
app.use(express.static(__dirname + '/public'))


// Handling http get requests
  // takes the url and function return
  // function arguments get request and response
// app.get('/', (req, res) => {
 // Sending in HTML: res.send('<h1>Hi</h1>')
 // Sending in json
//  res.send({
//    name: 'Sam',
//    likes: ['Pizza', 'Hiking']
//  })
// })

// name as first, function to run to second
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
})

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase()
})

// Redoing root with handelbars
  app.get('/', (req, res) => {
    res.render('home.hbs', {
      pageTitle: 'Home',
      welcomeMessage: 'Handlebars aint bad'
    })
  })

app.get('/about', (req, res) => {
  // pass second object into render to make it dynamic
  res.render('about.hbs', {
    pageTitle: 'About Page',
  })
})

app.get('/bad', (req, res) => {
  res.send({
    error: 'You lost boy'
  })
})

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'My Projects',
    pageContent: 'Feast on the impressiveness'
  })
})

// binds application to port on machine
 // optional second argument of what to do when server is up
// app.listen(3000, () => {
//   console.log('Server is up on port 3000')
// });

// changing port to be dynamic so it works on Heroku
app.listen(port, () => {
  console.log(`Server is up on port ${port}`)
});


// In terminal, you run node server.js to boot it up
