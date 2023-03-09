const functions = require("firebase-functions");
const express = require("express");
const PORT= 8080;
const app=express();
require('dotenv').config();
const connectionString = "postgres://wvqqptqt:TSCQJxmvyBQ-r8Cfam_fYQHtW8E7uwfJ@fanny.db.elephantsql.com/wvqqptqt"
const { Client } = require('pg')
const client = new Client({connectionString})
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.get("/tasks",async(req, res)=>{
    try{


        const {rows: result} = await client.query('SELECT * FROM task_list');
        console.log("yay");
        return res.json(result);
    }catch (err) {
        console.log(err);
        return res.json({msg:"Error", err: err.message})
    }
});

app.post('/addTask', async (req, res) => {
    try{
        const {rows: result}=  await client.query("INSERT INTO task_list(task) VALUES ($1) RETURNING *",[req.body.task]);

        console.log(result);
       return res.send(result);
    }catch (err) {
        return res.json({msg:"Error", err: err.message})
    }
});

app.put('/updateTaskSelected/:id', async (req, res) => {
    try{
       const {rows: result}=  await client.query("UPDATE task_list SET selected = $2 WHERE id = $1 RETURNING *",[req.params.id  ,req.body.selected]);
       return res.send(result);
    }catch (err) {
        console.log(err);
        return res.json({msg:"Error", err: err.message})

    }
});

app.put('/updateTask/:id', async (req, res) => {
    try{
       const  {rows: result}=  await client.query("UPDATE task_list SET task=$3 ,selected = $2 WHERE id = $1 RETURNING *",[req.params.id ,req.body.selected, req.body.task]);
       return res.send(result);
    }catch (err) {
        console.log(err);
        return res.json({msg:"Error", err: err.message})

    }
});

app.delete('/deleteSelectedTasks', async (req, res) => {
    try{
       const  {rows: result}=  await client.query("DELETE FROM task_list WHERE selected= true RETURNING *");
       return res.send(result);
    }catch (err) {
        console.log(err);
        return res.json({msg:"Error", err: err.message})

    }
});

app.delete('/deleteAllTasks', async (req, res) => {
    try{
       const  {rows: result}=  await client.query("DELETE FROM task_list RETURNING *");
       return res.send(result);
    }catch (err) {
        console.log(err);
        return res.json({msg:"Error", err: err.message})

    }
});

(async() =>  {
    await client.connect()
})()





exports.helloWorld = functions.https.onRequest(app)