const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kad33.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run(){
    try{
        await client.connect();
        console.log("DB Connected");
        const workCollection = client.db('toDoWorkList').collection('work');
        const deleteCollection = client.db('toDoWorkList').collection('completed');
       
          // POST Task: add a new Task
          app.post('/work', async (req, res) => {
            const newWork = req.body;
            const result = await workCollection.insertOne(newWork);
            res.send(result)
        });
        // get All Tasks
        app.get('/work', async (req, res) => {
            const query = {};
            const cursor = workCollection.find(query);
            const works = await cursor.toArray();
            res.send(works)
        })

         // get All Tasks
         app.get('/work/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await workCollection.findOne(query);
            res.send(result);
        });

        // get deleted Tasks
        app.get('/completed', async (req, res) => {
            const query = {};
            const cursor = deleteCollection.find(query);
            const deletedTask = await cursor.toArray();
            res.send(deletedTask)
        })

          // POST : Deleted/completed Task
          app.post('/completed', async (req, res) => {
            const newWork = req.body;
            const result = await deleteCollection.insertOne(newWork);
            res.send(result)
        });

           // Update Tasks
        app.put('/work/:id', async (req, res) => {
            const id = req.params.id;
            const updatedWork = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedWork.name
                }
            };
            const result = await workCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })



    }
    finally{

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Hello from ToDo List")
})

app.listen(port, () => {
    console.log('ToDo Listening port', port);
})