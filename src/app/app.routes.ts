import { Routes, provideRouter } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { AuthGuard } from './services/auth.guard';
import { Landing } from './landing/landing';
import { Productos } from './productos/productos';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: Login },
  { path: 'home', component: Home, canActivate: [AuthGuard] },
  { path: 'productos', component: Productos, canActivate: [AuthGuard] },
];
