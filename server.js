const express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos =[{
    id: 1,
    description: 'Meat Travis for lunch',
    completed: false
  },
  {
    id: 2,
    description: 'Go to market',
    completed: false
  },
  {
    id: 3,
    description: "Play Games",
    completed: true
  }
]

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

app.listen(PORT, function(){
  console.log('Express listening on port ' + PORT);
})
