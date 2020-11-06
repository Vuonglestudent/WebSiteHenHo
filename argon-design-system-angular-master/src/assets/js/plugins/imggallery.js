var idUser;
var imgContent;
var idImgCurrent;

function selectImage(id) {
  idUser = id.split("img_")[1];
  img = document.getElementById(id).children[1];
  popImage(img);
}

function popImage(img) {
  idImgCurrent = img.id.split("_")[1];
  imgContent = img.src;
  checkPath = imgContent.split(".")[imgContent.split(".").length - 1];
  console.log(idImgCurrent, imgContent, checkPath);
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
    ).style.background = `url(data:image/png;base64,${
      imgContent.split("http://localhost:4200")[1]
    })`;
  }
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

window.onload = function () {
  document.getElementById(`imagePopId`).addEventListener("click", function () {
    var myDivLeft = document.getElementById("clickButtonLeft");
    var myDivRight = document.getElementById("clickButtonRight");
    var myDivClose = document.getElementById("clickButtonClose");

    document.addEventListener("keyup", function (event) {
      console.log(event.key);
      if (event.key == "ArrowRight") {
        keyupButtonRight();
      } else if (event.key == "ArrowLeft") {
        keyupButtonLeft();
      } else if (event.key == "Escape") {
        keyupButtonClose();
      }
      
    });

    function keyupButtonLeft() {
      myDivLeft.click();
    }

    function keyupButtonRight() {
      myDivRight.click();
    }

    function keyupButtonClose() {
      myDivClose.click();
    }
  });
};
