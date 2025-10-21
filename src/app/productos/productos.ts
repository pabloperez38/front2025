import { Component, OnInit } from '@angular/core';
import { Cabecera } from '../cabecera/cabecera';
import { RouterModule } from '@angular/router';
import { Pie } from '../pie/pie';
import { CommonModule } from '@angular/common';
import { ProductosService, Producto } from '../services/productos.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, Cabecera, RouterModule, Pie],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
})
export class Productos implements OnInit {
  productos: Producto[] = [];

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.productosService.getAll().subscribe({
      next: (res) => (this.productos = res),
      error: (err) => console.error('Error fetching productos', err),
    });
  }
}
