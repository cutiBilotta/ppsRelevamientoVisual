import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  showInitialSplash = true;
  isFadedIn = false;

  constructor(public router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.showInitialSplash = false; // Hide initial splash screen
      setTimeout(() => {
        this.isFadedIn = true; // Show main content with fade-in effect
      }, 50); // Small delay to ensure transition

    }, 2000); // Show initial splash for 2 seconds

    setTimeout(() => {
      this.router.navigateByUrl('/login'); // Redirect to login page
    }, 5000); // Redirect after total 5 seconds (2s initial + 3s main content)
  }
}

