import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  constructor(private auth: AuthService, private router: Router) {}

  login(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    this.auth.login(email, password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: () => alert('Usuario o contraseña incorrectos'),
    });
  }
}
