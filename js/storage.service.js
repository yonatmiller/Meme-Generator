'use strict'

function saveToStorage(key) {
    addUrl()
    let memes = loadFromStorage(key) || []
    memes.push(gMeme)
    localStorage.setItem(key, JSON.stringify(memes))

    renderArchive()
}


function loadFromStorage(key) {
    const json = localStorage.getItem(key)
    return JSON.parse(json)
}

function addUrl() {
    const imgContent = gElCanvas.toDataURL('image/jpeg')
    gMeme.url = imgContent
}