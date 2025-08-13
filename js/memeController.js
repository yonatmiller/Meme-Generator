var gImgs = [{id: 1, url: 'img/putin.jpg', keywords: ['funny', 'cat']},
            {id: 2, url: 'img/patrick.jpg', keywords: ['funny', 'cat']},
            {id: 3, url: 'img/girl.jpg', keywords: ['funny', 'cat']},
            {id: 4, url: 'img/baby.jpg', keywords: ['funny', 'cat']},
            {id: 5, url: 'img/X-Everywhere.jpg', keywords: ['funny', 'cat']}]


var gKeywordSearchCountMap = {'funny': 12,'cat': 16, 'baby': 2}

function renderMeme(){
    getMeme()
    renderLine()
}

function onDownloadCanvas(elLink){
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    elLink.href = imgContent
}

function onSEetFont(dif){
    gMeme.lines[gMeme.selectedLineIdx].size += dif
    
    renderMeme()
}

function onShowLines(ev) {
    const { offsetX, offsetY, clientX, clientY } = ev

    const clickedLine = gMeme.lines.find(line => {
        const xLine = line.pos.x
        const yLine = line.pos.y

        return (
            offsetX >= xLine &&
            offsetX <= xLine + textWidth(line) &&
            offsetY >= yLine &&
            offsetY <= yLine + line.size)
    })

    if (clickedLine) {
        // Todo: Fix modal location relative to screen
        const idx = gMeme.lines.findIndex(line => line.txt === clickedLine.txt);
        gMeme.selectedLineIdx = idx
        const elTextInput = document.querySelector('.canvas-text')
        elTextInput.value = gMeme.lines[gMeme.selectedLineIdx].txt

        moveLine()
    }
}

function renderLine(){
    gCtx.strokeStyle = 'black';
    gCtx.lineWidth = 2
    gCtx.strokeRect(gLine.pos.x,gLine.pos.y,gLine.width, gLine.height )
}

function onAddLine(){
    console.log('hi');
    
    var newLine = {
        pos:{
            x: 0,
            y:40,
        }, 
        txt: 'new line',
        size: 20,
        color: 'black'
        }
    gMeme.lines.push(newLine)

    renderMeme()
}

