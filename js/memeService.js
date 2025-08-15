'use strict'

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    stickers:[],
    lines: [{
        pos:{
            x: 10,
            y:10,
        },
        txt: 'I sometimes eat Falafel',
        size: 20,
        color: 'red',
        font: 'Huninn',
        },
        {  
        pos:{
            x: 10,
            y:20,
        }, 
        txt: 'I love you',
        size: 20,
        color: 'red',
        font: 'Huninn',
        }]
}

var gLine = {
    pos:{
        x:0,
        y:0,
    },
    height: 20,
    width: 20,
    color: 'black',
}

function getMeme(){
    const elImg = new Image()
    var img = gImgs.find((img) => img.id === gMeme.selectedImgId)
    elImg.src = img.url
    
    elImg.onload = () => {
        gElCanvas.width = elImg.width;
        gElCanvas.height = elImg.height;
        gCtx.drawImage(elImg, 0, 0, elImg.naturalWidth, elImg.naturalHeight)

        gMeme.lines.forEach(line => {
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.fillStyle = line.color
        gCtx.textBaseline = 'top'
        gCtx.textAlign = 'left'
        gCtx.fillText(line.txt, line.pos.x, line.pos.y)})

        gMeme.stickers.forEach(sticker => {
        gCtx.font = '20px April'
        gCtx.textBaseline = 'top'
        gCtx.textAlign = 'left'
        gCtx.fillText(sticker.sticker, sticker.pos.x -25, sticker.pos.y-25)})
    }
}

function setLineTxt(){
    const elTextInput = document.querySelector('.canvas-text')
    gMeme.lines[gMeme.selectedLineIdx].txt = elTextInput.value
    
    renderMeme()
}

function setFontSize(){
    const elFontSizeInput = document.querySelector('.fontSize')
    gMeme.lines[gMeme.selectedLineIdx].size = elFontSizeInput.value
    
    renderMeme()
}

const elColorInput = document.querySelector('.brushColor')

elColorInput.addEventListener('input', (ev) => {
    const color = ev.target.value;
    gMeme.lines[gMeme.selectedLineIdx].color = color

    renderMeme()
})


const elFontSizeInput = document.querySelector('.fontSize')

elFontSizeInput.addEventListener('input', (ev) => {
    const fontSize = ev.target.value;
    gMeme.lines[gMeme.selectedLineIdx].size = fontSize

    renderMeme()
})

const elFont = document.querySelector('.fontLine')

elFont.addEventListener('input', (ev) => {
    const font = ev.target.value
    gMeme.lines[gMeme.selectedLineIdx].font = font
    
    renderMeme()
})

function textWidth(){ 
    const text = gMeme.lines[gMeme.selectedLineIdx].txt
    gCtx.font = `${gMeme.lines[gMeme.selectedLineIdx].size}px ${gMeme.lines[gMeme.selectedLineIdx].font}`
    const textMetrics = gCtx.measureText(text)
    const textWidth = textMetrics.width

    return textWidth
}


// function textWidth(line) { 
//     console.log(line);
    
//     gCtx.font = `${gMeme.lines[gMeme.selectedLineIdx].size}px ${gMeme.lines[gMeme.selectedLineIdx].font}`
//     const textMetrics = gCtx.measureText(gMeme.lines[gMeme.selectedLineIdx].txt)
//     return textMetrics.width
// }

function moveLine(){
    gLine.pos.x = gMeme.lines[gMeme.selectedLineIdx].pos.x
    gLine.pos.y = gMeme.lines[gMeme.selectedLineIdx].pos.y
    gLine.width = textWidth()
    gLine.height = gMeme.lines[gMeme.selectedLineIdx].size

    renderLine()
}

function getEvPos(ev) {
    const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        //* Prevent triggering the default mouse behavior
        ev.preventDefault()

        //* Gets the first touch point (could be multiple in touch event)
        ev = ev.changedTouches[0]

        /* 
        * Calculate touch coordinates relative to canvas 
        * position by subtracting canvas offsets (left and top) from page coordinates
        */
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}
