var idUser;
var imgContent;
var idImgCurrent;
var idFavorite;
var arrayFavoriteImageUser = [];
var lengthArrayImage;
var childId;
function selectImage(id) {
  idSplit = `${id.split("_")[0]}_${id.split("_")[1]}`
  childId = document.createElement("div");
  arrayFavoriteImageUser = [];
  getArrayImageAndState(idSplit);
  idFavorite = document.getElementById("clickFavoriteImage").children[0];
  // console.log(idFavorite);
  idUser = idSplit.split("img_")[1];
  idImgSelect = id.split("_")[2];
  img = document.getElementById(idSplit).children[Number(idImgSelect) + 1];
  popImage(img);
}

function getArrayImageAndState(id) {
  lengthArrayImage = document.getElementById(id).children[1].id.split("_")[3];
  var i;
  for (i = 1; i <= Number(lengthArrayImage); i++) {
    // console.log(i)
    idImg = Number(document.getElementById(id).children[i].id.split("_")[1]);
    stateImg = document.getElementById(id).children[i].id.split("_")[2];
    //console.log(idImg, stateImg);
    img = { img: idImg, state: stateImg };
    arrayFavoriteImageUser.push(img);
  }
  //console.log(arrayFavoriteImageUser);
}
function popImage(img) {
  // console.log(img);
  idImgCurrent = img.id.split("_")[1];
  childId.id = `${idImgCurrent}_${idUser}`;
  imgContent = img.alt;
  //console.log("content " + imgContent)
  checkPath = imgContent.split(".")[imgContent.split(".").length - 1];
  // console.log(idImgCurrent, imgContent);
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
      updateStateImage();
    } else {
      target.className = "ni ni-favourite-28 text-white";
      updateStateImage();
    }
  } else {
    if (target.children[0].className === "ni ni-favourite-28 text-white") {
      target.children[0].className = "ni ni-favourite-28 text-danger";
      updateStateImage();
    } else {
      target.children[0].className = "ni ni-favourite-28 text-white";
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
  if (arrayFavoriteImageUser[Number(idImgCurrent) - 1].state === "true") {
    arrayFavoriteImageUser[Number(idImgCurrent) - 1].state = "false";
  } else {
    arrayFavoriteImageUser[Number(idImgCurrent) - 1].state = "true";
  }
}
// window.onload = function () {
//   document.getElementById(`imagePopId`).addEventListener("click", function () {
//     var myDivLeft = document.getElementById("clickButtonLeft");
//     var myDivRight = document.getElementById("clickButtonRight");
//     var myDivClose = document.getElementById("clickButtonClose");

//     document.addEventListener("keyup", function (event) {
//       console.log(event.key);
//       if (event.key == "ArrowRight") {
//         keyupButtonRight();
//       } else if (event.key == "ArrowLeft") {
//         keyupButtonLeft();
//       } else if (event.key == "Escape") {
//         keyupButtonClose();
//       }

//     });

//     function keyupButtonLeft() {
//       myDivLeft.click();
//     }

//     function keyupButtonRight() {
//       myDivRight.click();
//     }

//     function keyupButtonClose() {
//       myDivClose.click();
//     }
//   });
// };


