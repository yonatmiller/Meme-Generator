var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [{
        txt: 'I sometimes eat Falafel',
        size: 20,
        color: 'red'
        }]
}

function getMeme(){
    const elImg = new Image()
    var img = gImgs.find((img) => img.id === gMeme.selectedImgId)
    
    elImg.src = img.url
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, elImg.naturalWidth, elImg.naturalHeight)
        gCtx.font = gMeme.lines[gMeme.selectedLineIdx].size + 'px Arial'
        gCtx.fillStyle = gMeme.lines[gMeme.selectedLineIdx].color
        gCtx.textBaseline = 'top'
        gCtx.textAlign = 'left'
        gCtx.fillText(`${gMeme.lines[0].txt}`, 0, 0)
    }
}

function setLineTxt(){
    const elTextInput = document.querySelector('.canvas-text')
    gMeme.lines[gMeme.selectedLineIdx].txt = elTextInput.value
    
    renderMeme()
}

function setImg(imgId){
    gMeme.selectedImgId = imgId
    renderMeme()
}

function updateAll(event) {
  document.querySelectorAll("p").forEach((p) => {
    p.style.color = event.target.value;
  });
}

