var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [{
        pos:{
            x: 0,
            y:0,
        },
        txt: 'I sometimes eat Falafel',
        size: 20,
        color: 'red'
        },
        {  
        pos:{
            x: 0,
            y:20,
        }, 
        txt: 'I love you',
        size: 20,
        color: 'red'
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
        gCtx.drawImage(elImg, 0, 0, elImg.naturalWidth, elImg.naturalHeight)

        gMeme.lines.forEach(line => {
        gCtx.font = `${line.size}px Arial`
        gCtx.fillStyle = line.color
        gCtx.textBaseline = 'top'
        gCtx.textAlign = 'left'
        gCtx.fillText(line.txt, line.pos.x, line.pos.y)})
    }
}

function setLineTxt(){
    const elTextInput = document.querySelector('.canvas-text')
    console.log(gMeme.lines[gMeme.selectedLineIdx].txt);
    
    gMeme.lines[gMeme.selectedLineIdx].txt = elTextInput.value
    
    renderMeme()
}

function setImg(imgId){
    gMeme.selectedImgId = imgId
    renderMeme()
}

const elColorInput = document.querySelector('.brushColor')

elColorInput.addEventListener('input', (ev) => {
  const color = ev.target.value;
  gMeme.lines[gMeme.selectedLineIdx].color = color

  renderMeme()
})


function textWidth(){
    
    
    const text = gMeme.lines[gMeme.selectedLineIdx].txt
    gCtx.font = `${gMeme.lines[gMeme.selectedLineIdx].size}px Arial`
    const textMetrics = gCtx.measureText(text)
    const textWidth = textMetrics.width

    return textWidth
}

function moveLine(){
    gLine.pos.x = gMeme.lines[gMeme.selectedLineIdx].pos.x
    gLine.pos.y = gMeme.lines[gMeme.selectedLineIdx].pos.y
    gLine.width = textWidth()
    gLine.height = gMeme.lines[gMeme.selectedLineIdx].size

    renderLine()
}
