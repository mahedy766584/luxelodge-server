const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const colors = require('colors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri =  `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ac-dczafpo-shard-00-00.ylujpzf.mongodb.net:27017,ac-dczafpo-shard-00-01.ylujpzf.mongodb.net:27017,ac-dczafpo-shard-00-02.ylujpzf.mongodb.net:27017/?ssl=true&replicaSet=atlas-ul1323-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`


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

        const roomsCollection = client.db("luxeLodge_DB").collection("rooms");
        const reviewsCollection = client.db("luxeLodge_DB").collection("reviews");
        const aboutCollection = client.db("luxeLodge_DB").collection("about");


        //jwt related api
        app.post('/jwt', async(req, res) =>{
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKE_SECRET, {
                expiresIn: '365d'
            })
            res.send({token})
            console.log('jwt token payci vai --->', token, 'user--->', user);
        })

        //middleware
        const verifyToken = async(req, res, next) =>{
            console.log('inside the verify token headers ---->>', req.headers.authorization);
            if(!req.headers.authorization){
                return res.status(401).send({message: 'forbidden access'})
            };
            const token = req.headers.authorization.split(' ')[1]
            jwt.verify(token, process.env.ACCESS_TOKE_SECRET, (err, decoded) =>{
                if(err){
                    return res.status(401).send({message: 'forbidden access'})
                }
                req.decoded = decoded;
                next();
            });
        };


        // rooms api
        app.get('/rooms', async (req, res) =>{

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 6;
            const skip = (page - 1) * limit;

            try{
                const rooms = await roomsCollection.find()
                .skip(skip)
                .limit(limit)
                .toArray();

                const totalRoom = await roomsCollection.countDocuments();

                res.send({
                    rooms,
                    currentPage: page,
                    totalPage: Math.ceil(totalRoom / limit),
                    totalRoom,
                });
            } catch(error){
                console.log(error.message);
            }
        })

        app.get('/rooms/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await roomsCollection.findOne(query);
            res.send(result);
        })

        // reviews api
        app.get('/reviews', async(req, res) =>{
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        })

        // about api
        app.get('/about', async(req, res) =>{
            const result = await aboutCollection.find().toArray();
            res.send(result);
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    } finally {
        // await client.close();
    }
    }
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello LuxeLodge')
})

app.listen(port, () => {
    console.log(` LuxeLodge server running on ${port}`.yellow)
})