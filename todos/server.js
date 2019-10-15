// set up utils 
var express  = require('express');
var app      = express();                               // express
var mongoose = require('mongoose');                     // mongoose 
var morgan   = require('morgan');             // log to console 
var bodyParser     = require('body-parser');    // pull information from HTML POST
var methodOverride = require('method-override'); // simulate DELETE and PUT
 
// Connect to MongoDB 
mongoose.connect(
    'mongodb://mongo-todo:eN0MTiLu0YLb3TqCmXoXgBPkmtSAF4g7HyjhZ90yQu8hLnNoi9LEGylw8xvEOpqxDr9WSNBTdCUYx1DECbzqSQ==@mongo-todo.documents.azure.com:10255/todos?ssl=true&replicaSet=globaldb', 
    { useNewUrlParser: true }
).then(() => console.log('Connection to MongoDB successful')).catch((err) => console.error(err));
  

// Create the app
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js)
app.listen(8000) // Listen on port defined in config file
console.log("App listening on port 8000");

// Define collection and schema for todo items
var todoSchema = new mongoose.Schema(
    {
      name: String, 
      default: ''
    },
    {
      collection: 'tasks'
    }
);
var Todo = mongoose.model('Todo', todoSchema);

// express routes 
// get all todos
app.get('/api/todos', function(req, res) {

    // use mongoose to get all todos in the database
    Todo.find(function(err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(todos); // return all todos in JSON format
    });
});

// create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {

    console.log("Adding todo: " + req.body.text);
    // create a todo, information comes from AJAX request from Angular
    Todo.create({
        name : req.body.text,
        done : false
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });

});

// delete a todo
app.delete('/api/todos/:todo_id/:task', function(req, res) {
    Todo.deleteOne({
        _id : req.params.todo_id,
        name: req.params.task
    }, function(err, todo) {
        if (err) {
            console.log("Error: " + err);
            res.send(err);
        }
            
        // get and return all the todos after you deleted
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.htm'); // load the angular view
});