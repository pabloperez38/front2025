import { Component } from '@angular/core';
import { Cabecera } from "../cabecera/cabecera";
import { Pie } from "../pie/pie";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  imports: [Cabecera, Pie],
})
export class Home {}
