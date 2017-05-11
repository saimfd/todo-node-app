const express = require('express');
const bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;
var todos =[]
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('TODO API Root')
});

app.get('/todos', function(req, res){
  res.json(todos);
});

app.get('/todos/:id', function(req, res){
  var matchedTodo = {}
  var found = false
  var id = parseInt(req.params.id);
  todos.forEach(function(todo){
    if(todo.id === id){
      matchedTodo = todo
      found = true
    }
  });
  if(found){
    res.send(matchedTodo);
  } else {
    res.status(404).send("Todo not found")
  }

});

app.post('/todos', function(req, res){
  var body = req.body;
  body.id = todoNextId;
  todoNextId = todoNextId + 1;
  todos.push(body);
  console.log(todos);
  res.json(body)
});

app.listen(PORT, function(){
  console.log('Express listening on port ' + PORT);
})
