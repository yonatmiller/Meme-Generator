'use strict'

var gImgs = [{id: 1, url:'/img/putin.jpg', keywords: ['putin', 'russia']},
            {id: 3, url: '/img/girl.jpg', keywords: ['dance', 'girl', 'dress', 'flower']},
            {id: 4, url: '/img/baby.jpg', keywords: ['funny', 'baby','shock']},
            {id: 5, url: '/img/X-Everywhere.jpg', keywords: ['Toy Story', 'Kebuai','baz', 'Woody']}]

var gKeywordSearchCountMap = {'funny': 12,'cat': 16, 'baby': 2}
var gFilterBy
var gSticker = {
    isClicked: false,
    sticker: '',
}

function renderMeme(){
    getMeme()
    renderLine()
}

function renderGallery(){
    var elGallery = document.querySelector('.gallery-container')
    var imgFilters = gImgs

    if(gFilterBy){
        var imgFilters = imgFilters.filter(img => 
        img.keywords.some(keyword => keyword.toLowerCase().includes(gFilterBy.toLowerCase()))) 
    }

     var strHtmls = imgFilters.map(img => 
    `<img src="${img.url}" alt=""onclick="onImgSelect(${img.id})">`)    
    elGallery.innerHTML = strHtmls.join('') 
}

function onImgSelect(imgId){
    setImg(imgId)
}

function setImg(imgId){
    gMeme.selectedImgId = imgId
    renderMeme()
}

function onDownloadCanvas(elLink){
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function onSetFont(dif){
    gMeme.lines[gMeme.selectedLineIdx].size += dif
    
    renderMeme()
}

function onCanvas(ev) {
    if(gSticker.isClicked){
        console.log(ev);
        
        gCtx.font = '30px Arial'
        gCtx.textAlign = 'center'
        gCtx.textBaseline = 'middle'
        gCtx.fillText(gSticker.sticker, ev.offsetX, ev.offsetY)

        gMeme.stickers.push({sticker: gSticker.sticker, pos:{x: ev.offsetX, y: ev.offsetY}})
        gSticker.isClicked = false
        return
    }
    const { offsetX, offsetY} = ev

    const clickedLine = gMeme.lines.find(line => {
        const xLine = line.pos.x
        const yLine = line.pos.y
        const width = textWidth(line)

        return (
            offsetX >= xLine &&
            offsetX <= xLine + width &&
            offsetY >= yLine &&
            offsetY <= yLine + line.size)
    })

    const clickedSticker = gMeme.stickers.find(sticker => {
        const xLine = sticker.pos.x
        const yLine = sticker.pos.y
        const size = 20
        const padding = 5

        return (
            offsetX >= xLine - size/2 &&
            offsetX <= xLine + size/2 &&
            offsetY >= yLine - size/2 &&
            offsetY <= yLine + size/2)
    })

    if (clickedLine) {
        // Todo: Fix modal location relative to screen
        const idx = gMeme.lines.findIndex(line => line.txt === clickedLine.txt);
        gMeme.selectedLineIdx = idx
        const elTextInput = document.querySelector('.canvas-text')
        elTextInput.value = gMeme.lines[gMeme.selectedLineIdx].txt
        const elFontSizeInput = document.querySelector('.fontSize')
        elFontSizeInput.value = gMeme.lines[gMeme.selectedLineIdx].size

        moveLine()
    }else{
        const elTextInput = document.querySelector('.canvas-text')
        elTextInput.value = 'Text'
        const elFontSizeInput = document.querySelector('.fontSize')
        elFontSizeInput.value = 'font size'
    }
}

function onSwichLine(){
    if(gMeme.selectedLineIdx < gMeme.lines.length ) gMeme.selectedLineIdx++
    if(gMeme.selectedLineIdx === gMeme.lines.length ) gMeme.selectedLineIdx = 0 
    
    gLine.pos.x = gMeme.lines[gMeme.selectedLineIdx].pos.x
    gLine.pos.y = gMeme.lines[gMeme.selectedLineIdx].pos.y
}

function onSetTxt(direction){
    if(direction === 'up')gMeme.lines[gMeme.selectedLineIdx].pos.y-=10
    if(direction === 'down')gMeme.lines[gMeme.selectedLineIdx].pos.y+=10
    console.log(gMeme.lines[gMeme.selectedLineIdx]);
    
    renderMeme()
}

function renderLine(){
    gCtx.strokeStyle = 'black';
    gCtx.lineWidth = 2
    gCtx.strokeRect(gLine.pos.x,gLine.pos.y,gLine.width, gLine.height )
}

function onAddLine(){
    var newLine = {
        pos:{
            x: 0,
            y:40,
        }, 
        txt: 'new line',
        size: 20,
        color: 'black',
        font: 'Huninn',
        }
    gMeme.lines.push(newLine)

    renderMeme()
}

function onAlign(side){
    if(side == 'left') gMeme.lines[gMeme.selectedLineIdx].pos.x = 0
    if(side == 'right') gMeme.lines[gMeme.selectedLineIdx].pos.x = gElCanvas.width - textWidth(gMeme.lines[gMeme.selectedLineIdx])
    if(side == 'center') gMeme.lines[gMeme.selectedLineIdx].pos.x = (gElCanvas.width/2) - ((textWidth(gMeme.lines[gMeme.selectedLineIdx]))/2)
    
    renderMeme()    
}

function onFlexible(){
    var indexImg = getRandomInt(1, gImgs.length+1)
    console.log(gImgs[indexImg]);
    
    gMeme.selectedImgId = indexImg

    gMeme.lines = [{pos:{
            x: 50,
            y:60,
        },
        txt: '',
        size: 20,
        color: 'green',
        font: 'Huninn',
        },
    ]

    var numChr = getRandomInt(1, 20)
    for(var i = 0; i < numChr; i++){
        const chars = 'abcdefghijklmnopqrstuvwxyz'
        const randomChar = chars.charAt(Math.floor(Math.random() * chars.length))
        
        gMeme.lines[0].txt += randomChar

        renderMeme()
    }
}

function onSaveMeme(){
    saveToStorage(STORAGE_KEY, gMeme)
}

function onResetFilter(){
    renderGallery()
}

function onInput(el){
    gFilterBy = el.value       
    renderGallery() 
}

function onSticker(sticker){
    gSticker.isClicked = true
    gSticker.sticker = sticker
}

function onDown(ev) {

    //* Get mouse/touch position relative to canvas
    const pos = getEvPos(ev)

    //* Exit if click/touch is not on the circle
    const clickedLine = gMeme.lines.find(line => {
        const xLine = line.pos.x
        const yLine = line.pos.y
        const width = textWidth(line)

        return (
            offsetX >= xLine &&
            offsetX <= xLine + width &&
            offsetY >= yLine &&
            offsetY <= yLine + line.size)
    })

    const clickedSticker = gMeme.stickers.find(sticker => {
        const xLine = sticker.pos.x
        const yLine = sticker.pos.y
        const size = 20

        return (
            offsetX >= xLine - size/2 &&
            offsetX <= xLine + size/2 &&
            offsetY >= yLine - size/2 &&
            offsetY <= yLine + size/2)
    })

    if (clickedLine) {
        // Todo: Fix modal location relative to screen
        const idx = gMeme.lines.findIndex(line => line.txt === clickedLine.txt);
        gMeme.selectedLineIdx = idx
        const elTextInput = document.querySelector('.canvas-text')
        elTextInput.value = gMeme.lines[gMeme.selectedLineIdx].txt
        const elFontSizeInput = document.querySelector('.fontSize')
        elFontSizeInput.value = gMeme.lines[gMeme.selectedLineIdx].size

        gMeme.lines[gMeme.selectedImgId].pos = pos
        renderMeme()

    }else if(clickedSticker){
        const idx = gMeme.stickers.findIndex(sticker => sticker.sticker === clickedSticker.sticker);
        gSticker[idx].pos = pos

        renderMeme()
    }
}
function onMove(ev) {
    const { isDrag } = getCircle()
   
    if (!isDrag) return
    const pos = getEvPos(ev)

    //* Calculate distance moved from drag start position
    const dx = pos.x - gLastPos.x
    const dy = pos.y - gLastPos.y

    //* Update start position for next move calculation
    gLastPos = pos

    //* Redraw the canvas with updated circle position
    renderCanvas()
}

function onUp() {
    setCircleDrag(false)
    document.body.style.cursor = 'grab'
}