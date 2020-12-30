var idUser;
var imgContent;
var idImgCurrent;
var idFavorite;
var arrayFavoriteImageUser = [];
var arrayNumberImageFavorite = [];
var lengthArrayImage;
var childId;
var likes
function selectImage(id) {
  idSplit = `${id.split("_")[0]}_${id.split("_")[1]}`
  childId = document.createElement("div");
  arrayFavoriteImageUser = [];
  getArrayImageAndState(idSplit);
  getNumberLikeImage(idSplit)
  idFavorite = document.getElementById("clickFavoriteImage").children[0];
  idUser = idSplit.split("img_")[1];
  if (id.split("_")[2] != null) {
    idImgSelect = id.split("_")[2];
  } else {
    idImgSelect = 1;
  }
  console.log(idImgSelect);
  img = document.getElementById(idSplit).children[Number(idImgSelect) + 1];
  console.log(img)
  popImage(img);
}

function getArrayImageAndState(id) {
  lengthArrayImage = document.getElementById(id).children[1].id.split("_")[3];
  var i;
  for (i = 1; i <= Number(lengthArrayImage); i++) {
    idImg = Number(document.getElementById(id).children[i].id.split("_")[1]);
    stateImg = document.getElementById(id).children[i].id.split("_")[2];
    img = { img: idImg, state: stateImg };
    arrayFavoriteImageUser.push(img);
  }
}

function getNumberLikeImage(id){
  lengthArrayImage = document.getElementById(id).children[1].id.split("_")[3];
  var i;
  for (i = 1; i <= Number(lengthArrayImage); i++) {
    idImg = Number(document.getElementById(id).children[i].id.split("_")[1]);
    numberLikeImg = document.getElementById(id).children[i].id.split("_")[5];
    img = { img: idImg, numberLike: numberLikeImg };
    arrayNumberImageFavorite.push(img);
  }
  console.log(arrayNumberImageFavorite)
}

function popImage(img) {
  console.log(img);
  idImgCurrent = img.id.split("_")[1];
  childId.id = `${idImgCurrent}_${idUser}`;
  imgContent = img.alt;
  likes = Number(img.id.split("_")[5])
  checkPath = imgContent.split(".")[imgContent.split(".").length - 1];
  document.getElementById("imagePopId").style.display = "block";
  document.getElementsByTagName("body")[0].style.overflowY = "hidden";
  if (
    checkPath == "jpg" ||
    checkPath == "JPG" ||
    checkPath == "png" ||
    checkPath == "PNG"
  ) {
    document.getElementById(
      "imageContainId"
    ).style.background = `url(${imgContent})`;
  } else {
    document.getElementById(
      "imageContainId"
    ).style.background = `url(data:image/png;base64,${imgContent.replace(
      "http://localhost:4200",
      ""
    )})`;
  }
  console.log(childId.id);
  childId.id = `${idImgCurrent}_${idUser}`;
  document.getElementById("clickFavoriteImage").append(childId);
  checkStateImage();
}

function imageMoveLeft() {
  if (idImgCurrent > 1) {
    img = document.getElementById(`img_${idUser}`).children[
      Number(idImgCurrent) - 1
    ];
    popImage(img);
  }
}

function imageMoveRight() {
  if (
    idImgCurrent <
    document.getElementById(`img_${idUser}`).children.length - 1
  ) {
    img = document.getElementById(`img_${idUser}`).children[
      Number(idImgCurrent) + 1
    ];
    popImage(img);
  }
}

function imagePopNone() {
  document.getElementById("imagePopId").style.display = "none";
  document.getElementById("imagePopAvatar").style.display = "none";
  document.getElementsByTagName("body")[0].style.overflowY = "scroll";
  document
    .getElementById("clickFavoriteImage")
    .removeChild(document.getElementById("clickFavoriteImage").childNodes[1]);
}

function checkStateImage() {
  document.getElementById('numberFavoriteImage').innerText = arrayNumberImageFavorite[Number(idImgCurrent) - 1].numberLike
  if (arrayFavoriteImageUser[Number(idImgCurrent) - 1].state == "true") {
    idFavorite.className = "ni ni-favourite-28 text-danger";
  } else {
    idFavorite.className = "ni ni-favourite-28 text-white";
  }
}

function favoriteImage(event) {
  target = event.target;
  // console.log(target.className);
  if (target.className !== "favorite") {
    if (target.className === "ni ni-favourite-28 text-white") {
      target.className = "ni ni-favourite-28 text-danger";
      arrayNumberImageFavorite[Number(idImgCurrent) - 1].numberLike = String(Number(arrayNumberImageFavorite[Number(idImgCurrent) - 1].numberLike) + 1)
      console.log(arrayNumberImageFavorite)
      updateStateImage();
    } else {
      target.className = "ni ni-favourite-28 text-white";
      arrayNumberImageFavorite[Number(idImgCurrent) - 1].numberLike = String(Number(arrayNumberImageFavorite[Number(idImgCurrent) - 1].numberLike) - 1)
      updateStateImage();
    }
  } else {
    if (target.children[0].className === "ni ni-favourite-28 text-white") {
      target.children[0].className = "ni ni-favourite-28 text-danger";
      arrayNumberImageFavorite[Number(idImgCurrent) - 1].numberLike = String(Number(arrayNumberImageFavorite[Number(idImgCurrent) - 1].numberLike) + 1)
      updateStateImage();
    } else {
      target.children[0].className = "ni ni-favourite-28 text-white";
      arrayNumberImageFavorite[Number(idImgCurrent) - 1].numberLike = String(Number(arrayNumberImageFavorite[Number(idImgCurrent) - 1].numberLike) - 1)
      updateStateImage();
    }
  }

  updateStateHTML = document.getElementById(`img_${idUser}`).children;
  // arrayFavoriteImageUser.forEach((element) => {
    updateStateHTML[Number(idImgCurrent)].id = `img_${arrayFavoriteImageUser[Number(idImgCurrent)-1].img}_${
      arrayFavoriteImageUser[Number(idImgCurrent)-1].state
    }_${Number(lengthArrayImage)}`;
  // });
}

function updateStateImage() {
  document.getElementById('numberFavoriteImage').innerText = arrayNumberImageFavorite[Number(idImgCurrent) - 1].numberLike
  if (arrayFavoriteImageUser[Number(idImgCurrent) - 1].state === "true") {
    arrayFavoriteImageUser[Number(idImgCurrent) - 1].state = "false";
  } else {
    arrayFavoriteImageUser[Number(idImgCurrent) - 1].state = "true";
  }
}