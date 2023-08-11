let toolsCont = document.querySelector(".tools-cont");
let optionCont = document.querySelector(".options-cont");
let pencil = document.querySelector(".fa-pencil");
let eraser = document.querySelector(".fa-eraser");
let PencilTool = document.querySelector(".pencil-tool");
let eraserTool = document.querySelector(".eraser-tool-cont");
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".fa-upload");
let flag1 = false;
let flag2 = false;
let flag3 = false;
let flag4 = false;

optionCont.addEventListener("click", (e) => {
    flag1 = !flag1;
    let iconElem = optionCont.children[0]; //selects icon i element
    if (flag1) {
        toolsCont.style.display = "flex"; //as toolsCont is display: flex
        iconElem.classList.remove("fa-bars");
        iconElem.classList.add("fa-circle-xmark");
    }
    else {
        toolsCont.style.display = "none";
        iconElem.classList.remove("fa-circle-xmark");
        iconElem.classList.add("fa-bars");
        PencilTool.style.display = "none";
        eraserTool.style.display = "none"
    }
})

pencil.addEventListener("click", (e) => {
    flag2 = !flag2;
    if (flag2) {
        PencilTool.style.display = "block";
    }
    else {
        PencilTool.style.display = "none";
    }
})

eraser.addEventListener("click", (e) => {
    flag3 = !flag3;
    if (flag3) {
        eraserTool.style.display = "flex";
    }
    else {
        eraserTool.style.display = "none";
    }
})

sticky.addEventListener("click", (e) => {
    //perform slight color change when element is clicked
    sticky.style.color = "gray";
    setInterval(() => {
        sticky.style.color = "black";
    }, 100);
    let stickyTemplateHTML = `
    <div class="header-cont">
    <div class="minimize"></div>
    <div class="remove"></div>
</div>
<div class="note-cont">
    <textarea spellcheck="false"></textarea>
</div>  
    `;
    createStiky(stickyTemplateHTML);
})

function dragdrop(stickyAction, event) {
    let shiftX = event.clientX - stickyAction.getBoundingClientRect().left;
    let shiftY = event.clientY - stickyAction.getBoundingClientRect().top;

    stickyAction.style.position = 'absolute';
    stickyAction.style.zIndex = 1000;
    // document.body.append(stickyAction);

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        stickyAction.style.left = pageX - shiftX + 'px';
        stickyAction.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    stickyAction.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        stickyAction.onmouseup = null;
    };
}

function createStiky(stickyTemplateHTML) {
    let stickyAction = document.createElement("div");
    stickyAction.setAttribute("class", "sticky-cont");
    stickyAction.innerHTML = stickyTemplateHTML;
    document.body.appendChild(stickyAction);

    //green and red button functiponality
    let rem = stickyAction.querySelector(".remove");
    let min = stickyAction.querySelector(".minimize");
    rem.addEventListener("click", (e) => {
        stickyAction.remove();
    })
    min.addEventListener("click", (e) => {
        let noteCont = stickyAction.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if (display === "none")
            noteCont.style.display = "block";
        else
            noteCont.style.display = "none";
    })

    //drag and drop on sticky notes taken from internet
    stickyAction.onmousedown = function (event) {

        dragdrop(stickyAction, event);

    };

    stickyAction.ondragstart = function () {
        return false;
    };
}
upload.addEventListener("click", (e) => {
    //perform slight color change when element is clicked
    upload.style.color = "gray";
    setInterval(() => {
        upload.style.color = "black";
    }, 100);

    //ope file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0]; //contains array of file in file explorer
        //taking [0] as we want to upload 1 file only
        let url = URL.createObjectURL(file); ///converts image to link
        alert(url)

        let stickyTemplateHTML = `
        <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <img src="${url}" />
    </div>  
        `;
        createStiky(stickyTemplateHTML);
    })
})