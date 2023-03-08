const express = require("express");
const PORT= 8080;
const app=express();
require('dotenv').config();
const connectionString = process.env.CONNECTION_STRING;
const pgp = require("pg-promise")()
const db = pgp(connectionString)
app.get("/tasks",async(req, res)=>{
    try{
        const result = await db.query('SELECT * FROM task_list');
        res.json(result);
        console.log("yay");
    }catch (err) {
        console.log(err);
    }
});

app.listen(PORT, () => {console.log("yay")});
