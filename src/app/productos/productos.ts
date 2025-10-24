import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Cabecera } from '../cabecera/cabecera';
import { RouterModule } from '@angular/router';
import { Pie } from '../pie/pie';
import { CommonModule } from '@angular/common';
import { ProductosService, Producto } from '../services/productos.service';
import { ProductoForm } from './producto-form/producto-form';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, Cabecera, RouterModule, Pie, ProductoForm],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Productos implements OnInit {
  productos: Producto[] = [];
  loading = true;
  error: string | null = null;
  showForm = false;
  editingProducto: Producto | null = null;
  isEditing = false;
  deletingId: number | null = null;

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

  showCreateForm(): void {
    this.editingProducto = null;
    this.isEditing = false;
    this.showForm = true;
    this.cdr.markForCheck();
  }

  showEditForm(producto: Producto): void {
    // Antes de abrir el formulario, solicitar al API el producto completo
    // Esto asegura que tengamos `categoria` y `categoria_id` correctamente poblados
    this.productosService.getById(producto.id).subscribe({
      next: (fullProducto) => {
        this.editingProducto = fullProducto;
        this.isEditing = true;
        this.showForm = true;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error cargando producto completo para edición:', err);
        // Fallback: abrir el formulario con el objeto que teníamos
        this.editingProducto = producto;
        this.isEditing = true;
        this.showForm = true;
        this.cdr.markForCheck();
      },
    });
  }

  hideForm(): void {
    this.showForm = false;
    this.editingProducto = null;
    this.isEditing = false;
    this.cdr.markForCheck();
  }

  onProductoGuardado(producto: Producto): void {
    if (this.isEditing) {
      // Para edición, obtener el producto actualizado completo
      this.productosService.getById(producto.id).subscribe({
        next: (updatedProducto) => {
          const index = this.productos.findIndex((p) => p.id === producto.id);
          if (index !== -1) {
            this.productos[index] = updatedProducto;
          }
          this.hideForm();
          this.cdr.markForCheck();
        },
      });
    } else {
      // Para creación, obtener el producto nuevo completo
      this.productosService.getById(producto.id).subscribe({
        next: (newProducto) => {
          this.productos.unshift(newProducto);
          this.hideForm();
          this.cdr.markForCheck();
        },
      });
    }
  }

  confirmDelete(producto: Producto): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el producto "${producto.nombre}"?`)) {
      this.deleteProducto(producto.id);
    }
  }

  private deleteProducto(id: number): void {
    this.deletingId = id;
    this.cdr.markForCheck();

    this.productosService.delete(id).subscribe({
      next: () => {
        this.productos = this.productos.filter((p) => p.id !== id);
        this.deletingId = null;
        this.cdr.markForCheck();
      },
      error: (error) => {
        this.error = 'Error al eliminar el producto';
        this.deletingId = null;
        this.cdr.markForCheck();
        console.error('Error deleting producto:', error);
      },
    });
  }

  getDisponibleText(disponible: number | boolean): string {
    const isAvailable = typeof disponible === 'number' ? disponible === 1 : disponible;
    return isAvailable ? 'Disponible' : 'No Disponible';
  }

  getDisponibleClass(disponible: number | boolean): string {
    const isAvailable = typeof disponible === 'number' ? disponible === 1 : disponible;
    return isAvailable ? 'badge bg-success' : 'badge bg-danger';
  }
}
