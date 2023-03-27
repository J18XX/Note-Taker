const express = require("express");
const fs = require('fs');
const path = require('path');
let database = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');


// set up express app
const app = express();
const PORT = process.env.PORT || 3001;

// link to assetc
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}))


// GET and POST
app.route('/api/notes')

// make notes list
    .get((req, res) => 
        res.json(database))

// add new note
    .post((req, res) => {
        let jsonFilePath = path.join(__dirname, './db/db.json');
        let newNotes = req.body;

        newNotes.id = uuidv4();
        console.log(newNotes);

        database.push(newNotes);

        fs.writeFile((jsonFilePath),JSON.stringify(database), err => {
            err ? console.log(err) : res.json(database)
        })
    });

app.delete('/api/notes/:id', (req, res) => {
    let jsonFilePath = path.join(__dirname, '/db/db.json');
    for (let i = 0; i < database.length; i++){
        if(database[i].id === req.params.id){
            database.splice(i, 1);
            break;
        }
    }
    fs.writeFile(jsonFilePath, JSON.stringify(database), err => {
        err ? console.log(err) : res.json(database)})
    
});

app.get("/", (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html')));


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} `));