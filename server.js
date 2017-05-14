const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;
var todos =[]
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('TODO API Root')
});

app.get('/todos', function(req, res){
  var queryParams = req.query;
  var filteredTodos = todos;

  if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
    filteredTodos = _.where(filteredTodos, {completed: true})
  } else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
    filteredTodos = _.where(filteredTodos, {completed: false})
  } else if(queryParams.hasOwnProperty('completed')){
    res.json({'error': "Completed query can only be true or false"})
  }

  if(queryParams.hasOwnProperty('q')){
    var query = queryParams.q.toLowerCase();
    filteredTodos = _.filter(filteredTodos, function(filteredTodo){
      if(filteredTodo.description.toLowerCase().indexOf(query) > 0){
        return filteredTodo
      }
    })
  }

  res.json(filteredTodos);
});

app.get('/todos/:id', function(req, res){
  var matchedTodo = {}
  var found = false
  var id = parseInt(req.params.id);
  matchedTodo = _.findWhere(todos, {"id": id});
  if(matchedTodo){
    res.send(matchedTodo);
  } else {
    res.status(404).send("Todo not found")
  }

});

app.post('/todos', function(req, res){
  var body = _.pick(req.body, 'description', 'completed');
  if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
    return res.status(400).send();
  }

  body.id = todoNextId;
  body.description = body.description.trim()
  todoNextId = todoNextId + 1;
  todos.push(body);
  res.json(body)
});

app.delete('/todos/:id', function(req, res){
  var id = parseInt(req.params.id);
  var matchedTodo = _.findWhere(todos, {"id": id});
  if(!matchedTodo){
    res.status(404).json({"error": "No record found"})
  } else {
    todos = _.without(todos, matchedTodo);
    res.json(todos)
  }
});

app.put('/todos/:id', function(req, res){
  var id = parseInt(req.params.id);
  var body = _.pick(req.body, 'description', 'completed');
  var validAttrs = {};
  var matchedTodo = _.findWhere(todos, {"id": id});
  if(!matchedTodo){
    return res.status(404).send('No Todo Found');
  }
  if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
    validAttrs.completed = body.completed;
  } else if(body.hasOwnProperty('completed')){
    return res.status(400).send('Bad')
  }

  if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
    validAttrs.description = body.description
  } else if(body.hasOwnProperty('description')){
    return res.status(400).send('Bad');
  }

  _.extend(matchedTodo, validAttrs);
  res.json(matchedTodo);

});

app.listen(PORT, function(){
  console.log('Express listening on port ' + PORT);
})
