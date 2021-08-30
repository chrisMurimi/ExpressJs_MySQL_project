const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyparser = require('body-parser');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static(__dirname + '/public'));


// Setup server port
const port = process.env.PORT || 8000;


//database connection
const connnection = mysql.createConnection({
    host :'localhost',
    user : 'root',
    password: '',
    database: 'appretireship_db'
});


//checking if connection has been established with database
connnection.connect(function(error){
    if(!!error)console.log('error connecting with database!!');
    else console.log('connected successifully');
});


//setting the views
app.set('views', path.join(__dirname,'views'));


//setting the engine for our views
app.set('view engine','ejs');
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse requests of content-type - application/json
app.use(bodyParser.json());


//route for loading the home page for the users
app.get('/', (req, res)=>{
    let sql ='SELECT * FROM users';
    let querry = connnection.query(sql,(err, rows)=>{
        if(err) throw err;
    //res.send( 'Eldohub CRUD project with expressJS and mySQL');
    res.render('users_page',{
        title:'home',
        user: rows
    });
});
});



//route for adding new user.
app.get('/add', (req, res)=>{
    //res.send('new user');
    res.render('add_user',{
        title:'Add user'
    });

});


//route for edit existing users.
app.get('/edit/:userId', (req, res)=>{
    const userId = req.params.userId;
    let sql = 'Select * from users where id = ?';
    let query = connnection.query(sql,userId, (err, result)=> {
        if(err)throw err;
        res.render('edit_user',{
            'title':'edit page',
            user: result[0]
           
        });
        
    });
});



//sending user details to the database.
app.post('/save', (req,res)=>{
    let data ={ name:req.body.name, email: req.body.email, phone_no: req.body.phone};
    let sql = 'INSERT INTO users SET?';
    let query =connnection.query(sql, data,(err, result)=>{
        if (err) throw err;
        res.redirect('/');
    });
});



//updating user in the database.
app.post('/update', (req,res)=>{
    let data ={ name:req.body.name, email: req.body.email, phone_no: req.body.phone};
    const userId = req.body.id;
     sql = "update users SET ? where id = ?";
    let query =connnection.query(sql, [data, userId],(err, result)=>{
        if (err) throw err;
        res.redirect('/');
    });
});



//deleting user from the database.
app.get('/delete/:userId', (req, res)=>{
    const userId = req.params.userId;
    let sql = 'DELETE from users where id = ?';
    let query = connnection.query(sql,userId, (err, result)=> {
        if(err)throw err;
        res.redirect('/');
        
    });
});




//server port is port port
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}`);
});