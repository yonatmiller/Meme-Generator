var gElCanvas
var gCtx

function onInit(){
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    renderMeme()
    renderGallery()
}
