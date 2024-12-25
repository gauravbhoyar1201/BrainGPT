// filepath: /c:/Users/Admin/OneDrive/Documents/Github Repos/BrainGPT/BrainGPT/brainGPT-ui/src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) { }

  navigateToSignup(): void {
    this.router.navigate(['/auth/signup']);
  }

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/quiz/home'], { queryParams: { username: this.username } });
    }, (err) => {
      alert('Invalid credentials');
    });
  }
}