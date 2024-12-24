// filepath: /c:/Users/Admin/OneDrive/Documents/Github Repos/BrainGPT/BrainGPT/brainGPT-ui/src/app/auth/signup/signup.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onSignup(): void {
    this.authService.signup(this.username, this.email, this.password).subscribe(
      response => {
        // Navigate to quiz home after successful signup
        this.router.navigate(['/auth/login']);
      },
      error => {
        alert('Error during signup');
      }
    );
  }
}