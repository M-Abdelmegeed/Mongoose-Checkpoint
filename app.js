var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const Person = require('./Models/person');
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'pug');
app.set('views','./views');
// Mongoose and database connections
const server = '127.0.0.1:27017';
const database = 'MongooseCheckpoint';
class Database {
  constructor() {
    this._connect()
  }
_connect() {
     mongoose.connect(`mongodb://${server}/${database}`,{useNewUrlParser: true,useUnifiedTopology:true })
       .then(() => {
         console.log('Database connection successful');
         app.listen(3000)
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}
module.exports = new Database()
// Creating and saving a record using the document.save()
app.post('/add-person', (req, res)=>{
  const person= new Person({
    name:'Mohammed Abdelmegeed',
    age:20,
    favouriteFoods:['Grilled Chicken', 'Pizza']
  });
  person.save()
    .then((result)=>{
      res.send(result)
    })
    .catch((err)=>{
      console.log(err);
    });
});
// Adding records using model.create()
app.post('/add-people', (req, res)=>{
  Person.create([
    {name:'Mostafa', age:18, favouriteFoods:['Cake', 'Burger']},
    {name:'Amr', age:25, favouriteFoods:['Ice-Cream', 'Pizza']},
    {name: 'John', age:36, favouriteFoods:['Fruits', 'Maccaroni']}
    ])
    .then((result)=>{
      res.send(result)
    })
    .catch((err)=>{
      console.log(err);
    });
});
// Finding all people and sorting by name ascendingly
app.get('/find-people',(req, res)=>{
  Person.find().sort({name:1})
  .then((result)=>{
    res.render('users', {users: result})
  })
  .catch((err)=>{
    console.log(err);
  });
})
//Finding one record using Model.findOne()
app.get('/find-person',(req, res)=>{
  Person.findOne({name:'Ahmed'})
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    console.log(err);
  });
})
//Finding a record using Model.findById()
app.get('/find-person-byId',(req, res)=>{
  Person.findById('6221c3a5b25e3980c58175d5')
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    console.log(err);
  });
})
// Finding a record and updating it using model.findOneAndUpdate()
app.put('/update-person/:id',(req, res)=>{
  const id= req.params.id;
  const updatedObject=req.body;
  console.log(updatedObject)
  console.log(id)
  Person.findOneAndUpdate({_id:id},updatedObject,{new:true})
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    console.log(err);
  });
})
//Delete One Document Using model.findByIdAndRemove
app.delete('/remove-byId/:id',(req, res)=>{
  const id=req.params.id
  Person.findByIdAndRemove(id)
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    console.log(err);
  });
})
//MongoDB and Mongoose - Delete Many Documents with model.remove()
app.delete('/delete-many',(req, res)=>{
  Person.remove({name:'Ahmed'}, {age:28})
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    console.log(err);
  });
})
//Query People using chain search query helpers
app.get('/query-people',(req, res)=>{
  Person.find()
  .skip(2)
  .limit(3)
  .sort({name:1})
  .exec()
  .then((result)=>{
    res.send(result)
  })
  .catch((err)=>{
    console.log(err);
  });
})





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
