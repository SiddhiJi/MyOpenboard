const express = require("express");//access

const app = express(); //initialize and server ready

app.use(express.static("public")); //goes inside public folder and displays index.html on all systems

//functioning server to listen as dataflow may start with it anytime
let port = process.env.port || 8080; //can be any number like 5000, 8080
let server = app.listen(port, ()=>{   //callback func after making port
    console.log("Listening to port "+port);
});
//our application will start listening, and when any system enters, that system will connect to this srver and express will display 

//connect with server's socket
let io = require("socket.io")(server); //server connection made with frontend

io.on("connection", (socket)=>{
    console.log("made connection with socket");

    // received data send by canvas.js line 42
    socket.on("beginPath", (data)=>{   //same identifier
        //transfer to all connected comp
        //data -> frontend passed data
        io.sockets.emit("beginPath", data);   
    })

    socket.on("drawstroke", (data)=>{
        io.sockets.emit("drawstroke", data);
    })

    socket.on("redoundo", (data)=>{
        io.sockets.emit("redoundo", data);
    })
})
// //nodemon npn install -> if appli crashed then it will detect error and again restart