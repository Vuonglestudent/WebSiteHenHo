import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-chat-icon",
  templateUrl: "./chat-icon.component.html",
  styleUrls: ["./chat-icon.component.scss"],
})
export class ChatIconComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
  @Output() iconEvent = new EventEmitter<string>();

  onClick(event: any) {
    this.iconEvent.emit(event.target.innerHTML);
  }
}
