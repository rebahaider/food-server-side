const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middlewares
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://food-client-site.web.app",
        "https://food-client-site.firebaseapp.com",
    ]
}));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aauiduw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const foodCollection = client.db('foodService').collection('foodItems');
        const requestFoodCollection = client.db('foodService').collection('requestFoodItems');

        // get all data from mongodb database
        app.get('/foodItems', async (req, res) => {
            const cursor = foodCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // get requested foods data
        app.get('/requestFoodItems', async (req, res) => {
            const cursor = requestFoodCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // get a single food details
        app.get('/foodItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await foodCollection.findOne(query);
            res.send(result);
        })

        // Add Food Items
        app.post('/foodItems', async (req, res) => {
            const addFood = req.body;
            console.log(addFood);
            const result = await foodCollection.insertOne(addFood)
            res.send(result);
        })

        // Add Request Food Items
        app.post('/requestFoodItems', async (req, res) => {
            const addRequest = req.body;
            console.log(addRequest);
            const result = await requestFoodCollection.insertOne(addRequest);
            res.send(result);
        })

        app.delete('/requestFoodItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await requestFoodCollection.deleteOne(query);
            res.send(result);
        })

        // update data

        app.get('/requestFoodItems/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await requestFoodCollection.findOne(query);
            res.send(result);

        })

        app.put('/requestFoodItems/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updateFoodDetails = req.body;
            console.log(updateFoodDetails);
            const updateDoc = {
                $set: {
                    name: updateFoodDetails.name,
                    image: updateFoodDetails.image,
                    quantity: updateFoodDetails.quantity,
                    pickup_location: updateFoodDetails.pickup_location,
                    expired_date_time: updateFoodDetails.expired_date_time,
                    additional_notes: updateFoodDetails.additional_notes,
                    donator_image: updateFoodDetails.donator_image,
                    donator_name: updateFoodDetails.donator_name,
                    doner_email: updateFoodDetails.donator_name,
                    food_status: updateFoodDetails.food_status
                },
            };
            const result = await requestFoodCollection.updateOne(filter, updateDoc, options)
            res.send(result);
        })




        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Assignment 11 IS RUNNING')
})

app.listen(port, () => {
    console.log(`Simple CRUD is running on port, ${port}`);
})