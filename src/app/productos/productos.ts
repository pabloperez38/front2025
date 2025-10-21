import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  loading = true;
  error: string | null = null;

  constructor(private productosService: ProductosService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProductos();
  }

  private loadProductos(): void {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();

    this.productosService.getAll().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.error = 'Error al cargar los productos. Inténtalo de nuevo.';
        this.loading = false;
        this.cdr.markForCheck();
        console.error('Error fetching productos:', error);
      },
    });
  }

  retry(): void {
    this.loadProductos();
  }
}
