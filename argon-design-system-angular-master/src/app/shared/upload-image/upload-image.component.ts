import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-upload-image",
  templateUrl: "./upload-image.component.html",
  styleUrls: ["./upload-image.component.scss"],
})
export class UploadImageComponent implements OnInit {
  @Output() fileEvent = new EventEmitter<File[]>();

  constructor() {}

  ngOnInit(): void {}
  fileChangeEvent(e: File[]) {
    this.fileEvent.emit(e);
  }
}
