const express = require("express")
const app = express()
const PORT = process.env.PORT||5000;
const bodyparser = require("body-parser")
const  MongoClient = require("mongodb").MongoClient;
const http = require('http').Server(app);
const io = require('socket.io')(http);

let memory = []
app.use("/app1",express.static('content'))
app.use(bodyparser.json())

let db = null;
let collection = null;
let collection2 = null;

const client = new MongoClient(process.env.mongouri);


async function GetCollection() {
        await client.connect();
        db = client.db('figures')
        collection = db.collection('figures10')
        collection2 = db.collection('figures15')
};
GetCollection()

const QueryFigure = async() => {
    const result = []
    const cursor = await collection.find().toArray()

    for(const line of cursor){
        result.push(line.fig)
    }
    return result
}

const PostFigures = async (figure) => {
    const doc = {fig:figure};
    const reulst = await collection.insertOne(doc);
    console.log(reulst)
}

const QueryFigure2 = async(user) => {
	console.log(user)
    const result = []
    const cursor = await collection2.find({user:user}).toArray()

    for(const line of cursor){
        result.push(line.fig)
    }
    return result
}

const PostFigures2 = async (figure, user) => {
    const doc = {"fig":figure,"user":user};
    const reulst = await collection2.insertOne(doc);
    console.log(reulst)
}

app.use(express.static('cont'))

io.on('connection', (socket) => {
    console.log("connected")
    socket.on('drawing', msg => {
        console.log(msg)

        io.emit('drawing', msg);
    });
});

http.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}/`);
});