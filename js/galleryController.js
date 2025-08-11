function renderGallery(){
    var elGallery = document.querySelector('.gallery-container')
    var strHtmls = gImgs.map(img => 
    `<img src="${img.url}" alt=""onclick="onImgSelect(${img.id})">`)    
    elGallery.innerHTML = strHtmls.join('') 
}

function onImgSelect(imgId){
    setImg(imgId)
}