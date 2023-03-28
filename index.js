const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();

require('dotenv').config()

// midleware//

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.e0f6x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serverCollection = client.db('saifulCar').collection('service');

        app.get('/service', async (req, res) => {
            const qurey = {};
            const cursor = serverCollection.find(qurey);
            const services = await cursor.toArray();
            res.send(services)
        });

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: ObjectId(id) };
            const service = await serverCollection.findOne(qurey);
            res.send(service);
        })

        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serverCollection.insertOne(newService);
            // res.send(result); 
        })
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: ObjectId(id) };
            const result = await serverCollection.deleteOne(qurey);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);

app.listen(5000, () => console.log("MY server is running"))

app.get('/', (req, res) => {
    res.send("welcome to my server");
})