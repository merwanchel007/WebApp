let border = "2px"
let figsize = "40px"
let figsize2 = "40px"
let x = 0;
let y = 0;
let figArray = []
let wholeCanvas = []
const canvas = document.getElementById('myCanvas')
const c = canvas.getContext('2d')
const ctx = canvas.getContext('2d');
let isDrawing = false
let pos = { x: 0, y: 0 };

addEventListener('load', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
})

document.addEventListener('mousemove', drawLine);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);

function setPosition(e) {
    const rect = canvas.getBoundingClientRect();
    pos.x = (e.clientX - rect.left) / (rect.right - rect.left) * canvas.width;
    pos.y = (e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height;
}


function downloadimage() {
    // Get the canvas in the html page
    const canvas = document.getElementById("myCanvas");
    // Getting the content inside the canvas to an image
    const dataImage = canvas.toDataURL("image/png");
    // Opening of an new window for the image, we then insert the image into the new window
    const newwind = window.open();
    newwind.document.open();
    newwind.document.write("<img src='" + dataImage + "'>");
    newwind.document.close();
    // printing of the image (to download it or to print it)
    newwind.onload = setTimeout(function () {
        newwind.print();
    }, 50);
}

function drawLine(e) {
    if (e.buttons !== 1) return;
    ctx.beginPath();
    ctx.lineWidth = border.slice(0, -2);
    ctx.lineCap = 'round';
    ctx.strokeStyle = document.getElementById('bdcolor').value;
    ctx.moveTo(pos.x, pos.y);
    setPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}




let socket = io();


socket.on('drawing', function (msg) {
    readData(msg)
});


let name = null
document.getElementsByTagName("canvas")[0].style.border = "solid black 6px";

function storetomongo() {
    const canvas = document.getElementById("myCanvas");
    const name = document.getElementById("name").value
    var today = new Date();
    var shortdate = new Date().toISOString().slice(0, 10)
    var time = today.getHours() + "h" + today.getMinutes() + "m" + today.getSeconds() + "s";
    const date = shortdate + '--' + time;
    //const date = new Date().toISOString().slice(0, 10)
    const url = canvas.toDataURL('image/png')
    const doc = { name: name, date: date, url: url }
    fetch('/canvastomongo', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(doc)

    }).then(response => response.json())
        .then(json => console.log(json));
    alert('Your image has been saved !');
}

function canvasstored() {
    windows = window.open('http://localhost:5000/storedcanvas');
}



function SetFigSize(size) {
    figsize = size;
    document.getElementById("figuresize").innerText = "Figure size: " + size;
}
function SetMargin(size) {
    document.getElementById("Thickness").innerText = "Border thickness: " + size;
    border = size;
}

function SetFigType(type) {
    document.getElementById("figtype").innerText = type;
}

function Draw(copying = false) {
    const canvas = document.getElementById('myCanvas')
    const c = canvas.getContext('2d')
    c.strokeStyle = document.getElementsByTagName("input")[1].value;
    c.fillStyle = document.getElementsByTagName("input")[0].value;
    c.lineWidth = parseInt(border.slice(0, -2))
    c.beginPath();
    let intercept = GetNonOverlappingStart(canvas.width, canvas.height)

    if (document.getElementById("figtype").innerText === "Triangle") {
        DrawTriangle(c, intercept)
    } else if (document.getElementById("figtype").innerText === "Square") {
        DrawSquare(c, intercept);
    } else {
        DrawCircle(c, intercept);
    }
    if (!copying) {
        sendObject(document.getElementById("figtype").innerText, c, intercept)
        console.log(figArray);
    }
}

function GetNonOverlappingStart(width, heigth) {
    let overlap = false
    let startPos = getRandomStart(width, heigth)
    do {
        startPos = getRandomStart(width, heigth)
        overlap = false;
        console.log("starting")
        for (const figure of wholeCanvas) {
            const fig = parseInt(figsize.slice(0, -2))
            console.log(figure)
            if (figure[0] < startPos[0] + fig && figure[0] + parseInt(figure[2].slice(0, -2)) > startPos[0] && figure[1] < startPos[1] + fig && figure[1] + parseInt(figure[2].slice(0, -2)) > startPos[1]) {
                overlap = true
                console.log("failed")
            }
        }

    } while (overlap)
    return (startPos)
}

function DrawSquare(c, intercept, getexternalfig = false) {
    let fig = "";
    if (getexternalfig) {
        fig = parseInt(figsize2.slice(0, -2))
    } else {
        fig = parseInt(figsize.slice(0, -2))
    }
    c.rect(intercept[0], intercept[1], fig, fig)
    c.stroke();
    c.fill();
}

function DrawCircle(c, intercept, getexternalfig = false) {
    let fig = "";
    if (getexternalfig) {
        fig = parseInt(figsize2.slice(0, -2))
    } else {
        fig = parseInt(figsize.slice(0, -2))
    }
    c.arc(intercept[0] + fig / 2, intercept[1] + fig / 2, fig / 2, 0, Math.PI * 2)
    c.closePath()
    c.stroke();
    c.fill();
}
function DrawTriangle(c, intercept, getexternalfig = false) {
    let fig = "";
    if (getexternalfig) {
        fig = parseInt(figsize2.slice(0, -2))
    } else {
        fig = parseInt(figsize.slice(0, -2))
    }
    c.beginPath()
    c.moveTo(intercept[0], intercept[1]);
    c.lineTo(intercept[0] + fig, intercept[1]);
    c.lineTo(intercept[0] + (fig / 2), intercept[1] + (fig));
    c.closePath();
    c.stroke();
    c.fill();
}

function submituser() {
    subname = document.getElementById("name").value
    alert('Welcome ' + subname + " !");
    console.log(subname)
}

function getRandomStart(width, height) {

    const swidth = width - parseInt(figsize.slice(0, -2));
    const sheight = height - parseInt(figsize.slice(0, -2));
    return [Math.floor(swidth * Math.random()), Math.floor(sheight * Math.random())]
}

function DrawTenFigure(copying = false) {
    console.log("10")
    const canvas = document.getElementById('myCanvas')
    const c = canvas.getContext('2d')
    c.strokeStyle = document.getElementsByTagName("input")[1].value;
    c.fillStyle = document.getElementsByTagName("input")[0].value;
    c.lineWidth = parseInt(border.slice(0, -2))

    for (i = 0; i < 10; i++) {
        c.beginPath()
        const num = Math.random()
        const start = getRandomStart(canvas.width, canvas.height)
        let figure2 = ""
        if (num < 0.33) {
            DrawCircle(c, start)
            figure2 = "Circle"
        } else if (num < 0.66) {
            DrawTriangle(c, start)
            figure2 = "Triangle"
        } else {
            DrawSquare(c, start)
            figure2 = "Square"
        }

        if (!copying) {
            sendObject(figure2, c, start)
        }
    }
}
const sendObject = async (figure, c, intercept) => {
    const data = [intercept[0], intercept[1], figsize, border, document.getElementsByTagName("input")[1].value, document.getElementsByTagName("input")[0].value, figure]
    const doc = { data: data, user: document.getElementById("name").value }
    socket.emit("drawing", JSON.stringify(doc))
}

const sendLine = async (figure, c, intercept, x2, y2) => {
    console.log("coucou")
    const data = [intercept[0], intercept[1], figsize, border, document.getElementsByTagName("input")[1].value, document.getElementsByTagName("input")[0].value, figure, x2, y2]
    const doc = { data: data, user: document.getElementById("name").value }
    console.log(data)
    socket.emit("drawing", JSON.stringify(doc))
}



const readData = async (packet) => {
    const objects = JSON.parse(packet).data


    console.log(objects)
    for (const elem of [objects]) {

        console.log(elem)
        const x = elem[0];
        const y = elem[1];
        figsize2 = elem[2];
        const border2 = elem[3];
        const bg = elem[5];
        const bd = elem[4];
        const figure = elem[6];
        if (figure == "Line") {
            drawLine(x, y, elem[7], elem[8])
            return null;
        }

        const canvas = document.getElementById('myCanvas')
        const c = canvas.getContext('2d')
        c.strokeStyle = bd;
        c.fillStyle = bg;
        c.lineWidth = parseInt(border2.slice(0, -2))
        c.beginPath();

        if (figure === "Triangle") {
            DrawTriangle(c, [x, y], true)
        } else if (figure === "Square") {
            DrawSquare(c, [x, y], true);
        } else {
            DrawCircle(c, [x, y], true);
        }
    }
}
