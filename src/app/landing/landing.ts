import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-landing',
  standalone: true,
  template: '',
})
export class Landing implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.auth.isLogged()) {
      this.router.navigate(['/productos']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
