import express from 'express';
import {addTask, deleteTask, getTasks, updateTask} from "./mongodb/mongo.mjs";
const app = new express();
const port = process.env.PORT || 3002;

app.use(express.json())

app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3006");
  next();
});

app.get("/cloudconnection", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.post('/createtask', async(req, res) => {
  console.log('coming post', req.body)
  let response = await addTask(req.body);
  return res.json(response)
})

app.get('/gettasks', async(req, res) => {
  console.log('coming here');
  let response = await getTasks();
  console.log('response', response);
  return res.json(response)
})

app.post('/updatetask', async(req, res) => {
  console.log('Update task -1')
 let response = await updateTask(req.body);
 return res.json(response)
})

app.delete('/deletetask', async(req, res) => {
  console.log('delete task -1')
 let response = await deleteTask(req.body);
 return res.json(response);
})

app.listen(port, () => {
  console.log('Server running on port ')
});



