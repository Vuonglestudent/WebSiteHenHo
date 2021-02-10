import { ImageScore } from './../models/models';
import { Component, OnInit } from '@angular/core';
import { ImageScoreService } from '../service/image-score.service';

@Component({
  selector: 'app-image-score',
  templateUrl: './image-score.component.html',
  styleUrls: ['./image-score.component.css']
})
export class ImageScoreComponent implements OnInit {

  constructor(
    private imageScoreService: ImageScoreService,
  ) { }

  imageScore: ImageScore;

  ngOnInit(): void {
    this.imageScoreService.GetImageScore()
      .then(data => {
        this.imageScore = data;

        console.log(this.imageScore)
      })
      .catch(error => console.log(error))
  }

  ActiveFilter = false;

  openModal() {
    document.getElementById("myModal").style.display = "block";
    // var myModal = document.getElementById("myModal");
    // myModal.setAttribute("display", "block");
  }

  closeModal() {
    document.getElementById("myModal").style.display = "none";
    // var myModal = document.getElementById("myModal");
    // myModal.setAttribute("display", "none");
  }

  slideIndex = 1;
  showSlides(slideIndex);


  showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("demo");
    var captionText = document.getElementById("caption");
    if (n > slides.length) { this.slideIndex = 1 }
    if (n < 1) { this.slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
      slides[i].setAttribute("style", "display: none");
      //slides[i].setAttribute("display", "none");
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[this.slideIndex - 1].setAttribute("style", "display:block");
    dots[this.slideIndex - 1].className += " active";
    captionText.innerHTML = dots[this.slideIndex - 1].getAttribute("alt");
  }

  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }

  onSaveChange() {
    var update = this.imageScore;
    this.imageScoreService.UpdateImageScore(update);
  }
  onChangeRadioButton(e) {
    this.imageScore.autoFilter = e;
  }
}
