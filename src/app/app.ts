import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Cabecera } from "./cabecera/cabecera";
import { Pie } from "./pie/pie";

@Component({
  selector: 'app-root',
  imports: [Cabecera, Pie],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyecto1');
}
