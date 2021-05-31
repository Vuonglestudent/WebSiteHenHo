import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  totalTime = 0;
  constructor() { }

  time: string;
  interval;
  ngOnInit(): void {
    this.timeCount();
  }

  timeCount() {
    var h = 0;
    var m = 0;
    var s = 0;

    var hour = '0';
    var minute = '0';
    var second = '0';

    this.interval = setInterval(() => {
      this.totalTime++;

      var tmp = this.totalTime % 3600;
      h = (this.totalTime - tmp) / 3600;
      tmp = (this.totalTime - h * 3600) % 60;
      m = (this.totalTime - h * 3600 - tmp) / 60;
      s = this.totalTime - (h * 3600 + m * 60);

      hour = h < 10 ? '0' + h : h.toString();
      minute = m < 10 ? '0' + m : m.toString();
      second = s < 10 ? '0' + s : s.toString();

      this.time = hour + ' : ' + minute + ' : ' + second;
    }, 1000)
  }

}
