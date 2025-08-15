'use strict'

function renderArchive() {
    
    const elArchive = document.querySelector('.Archive')
    const memes = loadFromStorage(STORAGE_KEY) || []

    const strHtmls = memes.map((meme, idx) => {
        return `
        <img src="${meme.url}" class="archive-img" data-idx="${idx}">`
        
    })

    elArchive.innerHTML = strHtmls.join('')

    document.querySelectorAll('.archive-img').forEach(imgEl => {
        imgEl.addEventListener('click', () => {
            loadMemeOntoCanvas(imgEl.dataset.idx)
        })
    })
    
    document.querySelectorAll('.btn-remove-archive-img').forEach(imgEl => {
        imgEl.addEventListener('click', () => {
            onRemoveArchiv(imgEl)
        })
    }) 
    
}

function loadMemeOntoCanvas(idx) {
    const memes = loadFromStorage(STORAGE_KEY) || []
    const meme = memes[idx]

    if (!meme) return
    gMeme = meme

    const elImg = new Image()
    const imgObj = gImgs.find(img => img.id === meme.selectedImgId)
    elImg.src = imgObj.url

    elImg.onload = () => {
        gElCanvas.width = elImg.width
        gElCanvas.height = elImg.height
        gCtx.drawImage(elImg, 0, 0)

        meme.lines.forEach(line => {
            gCtx.font = `${line.size}px ${line.font}`
            gCtx.fillStyle = line.color
            gCtx.textBaseline = 'top'
            gCtx.textAlign = 'left'
            gCtx.fillText(line.txt, line.pos.x, line.pos.y)

        meme.stickers.forEach(sticker => {
            gCtx.font = '20px April'
            gCtx.textBaseline = 'top'
            gCtx.textAlign = 'left'
            gCtx.fillText(sticker.sticker, sticker.pos.x -25, sticker.pos.y-25)})
        })
    }
}

function removeImgArchive(removeMeme){
    const memes = loadFromStorage(STORAGE_KEY) || []
    const idx = memes.findIndex(meme => meme === removeMeme)
	memes.splice(idx, 1)

    // saveToStorage(STORAGE_KEY, memes);
    renderArchive()
}