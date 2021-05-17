import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-introduce',
  templateUrl: './introduce.component.html',
  styleUrls: ['./introduce.component.scss']
})
export class IntroduceComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    
  }

  ngOnInit(): void {
    AOS.init();
  }


  onSignUp() {
    this.router.navigate(['/register']);
  }
}
