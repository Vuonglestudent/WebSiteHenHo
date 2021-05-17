import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shared-story',
  templateUrl: './shared-story.component.html',
  styleUrls: ['./shared-story.component.scss']
})
export class SharedStoryComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }


  onSignUp() {
    this.router.navigate(['/register']);
  }
}
