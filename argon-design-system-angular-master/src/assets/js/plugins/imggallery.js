function selectImage(id) {
  console.log(id)
  popImage(id)
}

function popImage(id) {
  document.getElementById('imagePopId').style.display = 'block';
  document.getElementsByTagName('body')[0].style.overflowY = 'hidden'
  document.getElementById('imageContainId').style.background = `url(data:image/png;base64,${id})`
}
