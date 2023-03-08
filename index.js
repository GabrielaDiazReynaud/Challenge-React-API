const express = require("express");
const PORT= 8080;
const app=express();
require('dotenv').config();
const connectionString = process.env.CONNECTION_STRING;
const pgp = require("pg-promise")()
const db = pgp(connectionString)
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.get("/tasks",async(req, res)=>{
    try{
        const result = await db.query('SELECT * FROM task_list');
        console.log("yay");
        return res.json(result);
    }catch (err) {
        console.log(err);
        return{msg:"Error"}
    }
});

app.post('/addTask', async (req, res) => {
    try{
       const result=  await db.query("INSERT INTO task_list(task) VALUES (${task}) RETURNING *",{task: req.body.task});
        console.log(result);
       return res.send(result);
    }catch (err) {
        return{msg:"Error"}
    }
})

app.put('/updateTaskSelected/:id', async (req, res) => {
    try{
       const result=  await db.query("UPDATE task_list SET selected = ${selected} WHERE id = ${id} RETURNING *",{id: req.params.id ,selected: req.body.selected});
       return res.send(result);
    }catch (err) {
        console.log(err);
        return{msg:"Error"}
    }
})


app.put('/updateTask/:id', async (req, res) => {
    try{
       console.log(req.params.id );
       const result=  await db.query("UPDATE task_list SET task=${task} ,selected = ${selected} WHERE id = ${id} RETURNING *",{id: req.params.id ,selected: req.body.selected, task: req.body.task});
       return res.send(result);
    }catch (err) {
        console.log(err);
        return{msg:"Error"}
    }
})

app.delete('/deleteSelectedTasks', async (req, res) => {
    try{
       console.log(req.params.id );
       const result=  await db.query("UPDATE task_list SET task=${task} ,selected = ${selected} WHERE id = ${id} RETURNING *",{id: req.params.id ,selected: req.body.selected, task: req.body.task});
       return res.send(result);
    }catch (err) {
        console.log(err);
        return{msg:"Error"}
    }
})
app.listen(PORT, () => {console.log("yay")});
