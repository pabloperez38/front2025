import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cabecera.html',
  styleUrls: ['./cabecera.css'],
})
export class Cabecera {
  titulo = 'Mi Aplicación Angular';
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
