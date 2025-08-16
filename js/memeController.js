'use strict'

var gImgs = [{id: 1, url:'./img/Moana.jpg', keywords: ['putin', 'russia']},
            {id: 2, url: './img/Zootropolis.png', keywords: ['dance', 'girl', 'dress', 'flower']},
            {id: 3, url: './img/Tinkerbell.jpg', keywords: ['funny', 'baby','shock']},
            {id: 4, url: './img/Olaf.jpg', keywords: ['funny', 'baby','shock']},
            {id: 5, url: './img/ToyStory.jpg', keywords: ['Toy Story', 'Kebuai','baz', 'Woody']}]

var gKeywordSearchCountMap = {'funny': 12,'cat': 16, 'baby': 2}
var gFilterBy
var gIsDrag = {
    isDrag: false,
    typeDrag: '',
    draggedItem: null
}

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

function renderImg(img) {
  gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
  gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
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
        
        gCtx.font = '30px Arial'
        gCtx.textAlign = 'center'
        gCtx.textBaseline = 'middle'
        gCtx.fillText(gSticker.sticker, ev.offsetX, ev.offsetY)

        gMeme.stickers.push({sticker: gSticker.sticker, pos:{x: ev.offsetX, y: ev.offsetY}})
        
        var elSticker = document.querySelector('.scrollStickers')
        elSticker.style.border = '2px solid gray';
        
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

    const elTextInput = document.querySelector('.canvas-text')
    elTextInput.value = gMeme.lines[gMeme.selectedLineIdx].txt
    const elFontSizeInput = document.querySelector('.fontSize')
    elFontSizeInput.value = gMeme.lines[gMeme.selectedLineIdx].size

    renderLine()
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

function renderStickers() {
    var stickerIdx = gMeme.findIndex(meme => meme.sticker)
    if (stickerIdx !== -1) {
        gMeme.splice(stickerIdx, 1)
    }
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
    // renderStickers()
     console.log(gMeme);
    var indexImg = getRandomInt(1, gImgs.length+1)
   
    
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

    var elSticker = document.querySelector('.scrollStickers')
    elSticker.style.border = '4px solid gray';
}

function onDown(ev) {
    gIsDrag.isDrag = true
    document.body.style.cursor = 'grabbing'

    const pos = getEvPos(ev)
    gLine.pos = pos
    
    //find line
    const clickedLine = gMeme.lines.find(line => {
        const xLine = line.pos.x
        const yLine = line.pos.y
        const width = textWidth(line)

        return (
            pos.x >= xLine &&
            pos.x <= xLine + width &&
            pos.y >= yLine &&
            pos.y <= yLine + line.size
        )
    })

    //find sticker
    const clickedSticker = gMeme.stickers.find(sticker => {
        const xLine = sticker.pos.x
        const yLine = sticker.pos.y
        const size = 20

        return (
            pos.x >= xLine - size / 2 &&
            pos.x <= xLine + size / 2 &&
            pos.y >= yLine - size / 2 &&
            pos.y <= yLine + size / 2
        )
    })

    if (clickedLine) {
        gIsDrag.typeDrag = 'line'
        gIsDrag.draggedItem = clickedLine
    } else if (clickedSticker) {
        gIsDrag.typeDrag = 'sticker'
        gIsDrag.draggedItem = clickedSticker
    } else {
        gIsDrag.isDrag = false
    }
}

function onMove(ev) {
   if (!gIsDrag.isDrag || !gIsDrag.draggedItem) return
    const pos = getEvPos(ev)

    gIsDrag.draggedItem.pos = pos
    gLine.pos = pos
    
    renderMeme()
    renderLine()
}

function onUp() {
   gIsDrag.isDrag = false
   document.body.style.cursor = 'grab'
   
}

function onUploadImg(ev) {
  ev.preventDefault()
  const canvasData = gElCanvas.toDataURL('image/jpeg')

  // After a succesful upload, allow the user to share on Facebook
  function onSuccess(uploadedImgUrl) {
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    document.querySelector('.share-container').innerHTML = `
        <a href="${uploadedImgUrl}">Uploaded pic</a>
        <p>Picture url: ${uploadedImgUrl}</p>
        <button class="btn-facebook" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}', '_blank', 'width=600,height=400')">
        Share on Facebook  
        </button>`
  }
  uploadImg(canvasData, onSuccess)
}

function onImgInput(ev) {
  loadImageFromInput(ev, renderImg)
}

function onRemoveArchiv(ev){
    console.log(ev);
    removeImgArchive(meme)
}