var idUser;
var imgContent;
var idImgCurrent;
var idFavorite;
function selectImage(id) {
  console.log(id);
  idFavorite = document.getElementById("clickFavoriteImage").children[0];
  console.log(idFavorite);
  idUser = id.split("img_")[1];
  img = document.getElementById(id).children[1];
  popImage(img);
}

function popImage(img) {
  console.log(img);
  idImgCurrent = img.id.split("_")[1];
  imgContent = img.alt;
  //console.log("content " + imgContent)
  checkPath = imgContent.split(".")[imgContent.split(".").length - 1];
  console.log(idImgCurrent, imgContent);
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
  document.getElementsByTagName("body")[0].style.overflowY = "scroll";
}

var arrayFavoriteImageUser = [
  { img: 1, state: true },
  { img: 2, state: false },
  { img: 3, state: true },
];

function checkStateImage() {
  if (arrayFavoriteImageUser[Number(idImgCurrent) - 1].state == true) {
    idFavorite.className = "ni ni-favourite-28 text-danger";
  } else {
    idFavorite.className = "ni ni-favourite-28 text-white";
  }
}
function favoriteImage(event) {
  target = event.target;
  console.log(target.className);
  if (target.className !== "favorite") {  ``
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
}

function updateStateImage() {
  arrayFavoriteImageUser[
    Number(idImgCurrent) - 1
  ].state = !arrayFavoriteImageUser[Number(idImgCurrent) - 1].state;
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
