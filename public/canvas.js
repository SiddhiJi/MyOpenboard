let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWifthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".fa-download");
let redo = document.querySelector(".fa-rotate-right");
let undo = document.querySelector(".fa-rotate-left");

let pencolor = "red"; //bydefault color is red
let pencilWidth = pencilWidthElem.value; //i.e value of input tag of type range
let eraserWidth = eraserWifthElem.value; 

let undoredoTracker = []; //data
let track = 0;  //track increases when undo , decreases when redo

let mousedown = false;

//drwaing path on canvas (code taken  google search-> draing graphics canvas mdn)
let tool = canvas.getContext("2d"); //all graphics performed can be acced by this
// tool onlu, its a API to draw graphics

tool.strokeStyle = pencolor; //changes color of path drawn defult is black
tool.lineWidth = pencilWidth;

//perform drawing on basis of mouse listener
//mouedown = start new Path , mousemove = path fill distance(graphics)
canvas.addEventListener("mousedown", (e)=>{
    mousedown = true; //without this path, is drawn wherever mouse is moved
    //pasing object as parameter to beginPath function
    // beginPath({
    //     x: e.clientX,     gives horizontal distance in x-axis
    //     y: e.clientY
    // })
    let data = {
        x: e.clientX - canvas.offsetLeft,
        y: e.clientY - canvas.offsetTop,
        }
    socket.emit("beginPath", data);//data goes to server, here beginPth is idntifier
    // beginPath(data);
})
canvas.addEventListener("mousemove", (e)=>{
    if(mousedown){
        // drawStroke({
        //     x: e.clientX,     gives horizontal distance in x-axis
        //     y: e.clientY
        // })
        let data = {
            x: e.clientX - canvas.offsetLeft,
            y: e.clientY - canvas.offsetTop,
            color: flag3? "white":pencolor,
            width: flag3? eraserWidth : pencilWidth
        }
        // drawStroke(data);
        socket.emit("drawstroke", data)//send data to server  where drawstroke is identifier
    }
})
canvas.addEventListener("mouseup", (e)=>{
    mousedown = false;
    //add undoredo functionality when a path is completed(mouse up), i.e store that path in array, i.e current state of canavas
    let url = canvas.toDataURL();
    track++;
    undoredoTracker.push(url);
    console.log(track, undoredoTracker.length);
    track = undoredoTracker.length - 1; //points to last url
})

undo.addEventListener("click", (e)=>{
    //perform slight color change when element is clicked
    undo.style.color = "gray";
    setInterval(() => {
        undo.style.color = "black";
    }, 100);
    if(track > 0){ //so that it not go to -ve in undoredo array
        track--;
    }
    console.log(track, undoredoTracker.length);
    //action
    let data = {
        trackValue: track,
        undoredoTracker
    }
    //sending data to server
    socket.emit("redoundo", data);
    // undoredoCanvas(data);
})

function undoredoCanvas(trackObj){
    track = trackObj.trackValue;
    undoredoTracker = trackObj.undoredoTracker;
    let img = new Image(); //new image reference element
    img.src = undoredoTracker[track]; //src = url
    img.onload = (e)=>{ //when it loads for ms image put that on the canvas using tool API
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

redo.addEventListener(("click"), (e)=>{
    //perform slight color change when element is clicked
    redo.style.color = "gray";
    setInterval(() => {
        redo.style.color = "black";
    }, 100);

    if(track < undoredoTracker.length-1){
        track++;
    }
    console.log(track, undoredoTracker.length);
    //action
    let data = {
        trackValue: track,
        undoredoTracker
    }
    //sending data to server
    socket.emit("redoundo", data);
    // undoredoCanvas(data);
})

function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y); //it gives x and y value of mouse pointing by user
}
function drawStroke(strokeObj)
{
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilColor.forEach((colorElem)=>{
    colorElem.addEventListener("click", (e)=>{
        let color = colorElem.classList[1];
        pencolor = color;
        tool.strokeStyle = pencolor;
    })
})

pencilWidthElem.addEventListener("change", (e)=>{
    pencilWidth = pencilWidthElem.value;
    tool.lineWidth = pencilWidth;
})

eraserWifthElem.addEventListener("change", (e)=>{
    eraserWidth = eraserWifthElem.value;
    tool.lineWidth = eraserWidth;
})

eraser.addEventListener("click", (e)=>{

    //used flag as if clicked 1st time activate eraser and if again clicked the deactivate erarser
    if(flag3){
        tool.strokeStyle = "white";
        tool.lineWidth = eraserWidth;
        eraser.style.color = "gray";
    }
    else{
        //back to initial pen width and color if arser deactivated
        tool.strokeStyle = pencolor;
        tool.lineWidth = pencilWidth;
        eraser.style.color = "black";
    }
})

download.addEventListener("click", (e)=>{
    //perform slight color change when element is clicked
    download.style.color = "gray";
    setInterval(() => {
        download.style.color = "black";
    }, 100);

    let url = canvas.toDataURL(); //converts canvas with graphics into url which can be downloaded

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg"; //download url with board.jpg name
    a.click();
})



// tool.beginPath(); //new path will generate
// tool.moveTo(10,10); //start point of path
// tool.lineTo(100,150); //end point of path
// tool.stroke(); //fill color(graphic)

// tool.lineTo(200,200); //continues from prev path end as beginPath() not done
// tool.stroke();

socket.on("beginPath", (data)=>{
    //data from server received to all system socket and display on their system
    beginPath(data);
})
socket.on("drawstroke", (data)=>{
    //data from server received to all system socket
    drawStroke(data);
})
socket.on("redoundo", (data)=>{
    undoredoCanvas(data);
})