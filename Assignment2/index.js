const express = require("express")
const formidable = require('formidable');
const fs = require('fs');
const app = express()
const PORT = process.env.PORT || 5000;
const bodyparser = require("body-parser")
const jsonParser = bodyparser.json();
const MongoClient = require("mongodb").MongoClient;


const http = require('http').Server(app);
const io = require('socket.io')(http);

let memory = []
app.use("/app1", express.static('content'))
app.use(bodyparser.json())

let db = null;
let collection = null;
let collection2 = null;

MongoClient.connect(`mongodb+srv://webappcourse:benjaminbejnbaum007@cluster0.fjrea.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, function (err, client) {
    db = client.db('drawingsdb');
    collection = db.collection('Mydrawings');
    console.log("Connected successfully");
})


const QueryFigure = async () => {
    const result = []
    const cursor = await collection.find().toArray()

    for (const line of cursor) {
        result.push(line.fig)
    }
    return result
}

const PostFigures = async (name,date,url) => {
    const doc = {
        name: name,
        date: date,
        url: url
      };    const reulst = await collection.insertOne(doc);
    console.log(reulst)
}

const QueryFigure2 = async (user) => {
    console.log(user)
    const result = []
    const cursor = await collection2.find({ user: user }).toArray()

    for (const line of cursor) {
        result.push(line.fig)
    }
    return result
}

const PostFigures2 = async (figure, user) => {
    const doc = { "fig": figure, "user": user };
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

app.post('/canvastomongo', jsonParser, (req, res) => {
    PostFigures(req.body.name, req.body.date, req.body.url)
    const image = req.body.url.replace(/^data:image\/\w+;base64,/, "")
    const buffer = Buffer.from(image, "base64")
    fs.writeFile("./cont/canvas/" + req.body.name + "--" +req.body.date + ".png", buffer, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("Your canvas has been successfully saved");
  
    });   
  })

app.get('/storedcanvas', jsonParser, async (req, res) => {
    var database = [];

    const cursor = await collection.find({}).toArray()
    for (const line of cursor) {
        path = {
            url: line.url,
            name: line.name,
            id: line._id
        }
        database.push(path)
    }
    res.send(
        database.map((product, index) =>
            `<img id='${product.id}' src='${product.url}'/><br>
        `
        ).join('')
    )
})

http.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}/`);
});
