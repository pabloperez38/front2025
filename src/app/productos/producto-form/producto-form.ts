import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductosService, Producto } from '../../services/productos.service';
import { CategoriasService, Categoria } from '../../services/categorias.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './producto-form.html',
  styleUrls: ['./producto-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoForm implements OnInit {
  @Input() producto: Producto | null = null;
  @Input() isEditing = false;
  @Output() productoGuardado = new EventEmitter<Producto>();
  @Output() cancelar = new EventEmitter<void>();

  productoForm: FormGroup;
  categorias: Categoria[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private cdr: ChangeDetectorRef
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      precio: [0, [Validators.required, Validators.min(0.01)]],
      peso: [0, [Validators.required, Validators.min(0.01)]],
      disponible: [1, Validators.required], // 1 = disponible, 0 = no disponible
      categoria_id: [null], // Cambiar a categoria_id (number) como espera tu API    
    });
  }

  ngOnInit(): void {
    this.loadCategorias();
    if (this.isEditing && this.producto) {
      this.loadProductoData();
    }
  }

  private loadCategorias(): void {
    console.log('Cargando categorías...');
    this.categoriasService.getAll().subscribe({
      next: (categorias) => {
        console.log('Categorías cargadas:', categorias);
        // Verificar si la categoría 5 está presente
        const categoria5 = categorias.find((cat) => cat.id === 5);
        console.log('Categoría 5 encontrada:', categoria5);
        this.categorias = categorias;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error cargando categorías:', error);
        console.error('Error completo:', JSON.stringify(error, null, 2));

        // Si hay error, usar categorías de prueba basadas en tu API
        this.categorias = [
          { id: 1, nombre: 'Ropa' },
          { id: 2, nombre: 'Electrónicos' },
          { id: 3, nombre: 'Hogar' },
          { id: 4, nombre: 'Deportes' },
          { id: 5, nombre: 'Libros' },
          { id: 6, nombre: 'Juguetes' },
        ];

        this.error = `Error al cargar las categorías desde la API. Usando categorías de prueba. Error: ${
          error.message || error.statusText || 'Error desconocido'
        }`;
        this.cdr.markForCheck();
      },
    });
  }

  private loadProductoData(): void {
    if (this.producto) {
      this.productoForm.patchValue({
        nombre: this.producto.nombre,
        descripcion: this.producto.descripcion || '',
        stock: this.producto.stock,
        precio: this.producto.precio,
        peso: this.producto.peso || 0,
        disponible: this.producto.disponible,
        categoria_id:
          this.producto.categoria_id ||
          (this.producto.categoria ? this.producto.categoria.id : null),
       
      });
    }
  }

  onSubmit(): void {
    if (this.productoForm.valid) {
      this.loading = true;
      this.error = null;
      this.cdr.markForCheck();

      const formData = this.transformFormData(this.productoForm.value);
      console.log('Datos del formulario originales:', this.productoForm.value);
      console.log('Datos transformados para API:', formData);
      console.log('Formulario válido:', this.productoForm.valid);
      console.log('Errores del formulario:', this.productoForm.errors);

      if (this.isEditing && this.producto) {
        console.log('Actualizando producto ID:', this.producto.id);
        console.log('Datos a enviar:', formData);

        this.productosService.update(this.producto.id, formData).subscribe({
          next: (producto) => {
            console.log('Producto actualizado exitosamente:', producto);
            this.loading = false;
            this.productoGuardado.emit(producto);
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error('Error updating producto:', error);
            console.error('Error completo:', JSON.stringify(error, null, 2));
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            console.error('Error body:', error.error);

            this.loading = false;
            this.error = this.formatErrorMessage(error);
            this.cdr.markForCheck();
          },
        });
      } else {
        console.log('Creando nuevo producto');
        console.log('Datos a enviar:', formData);

        this.productosService.create(formData).subscribe({
          next: (producto) => {
            console.log('Producto creado exitosamente:', producto);
            // Asegurarse de que el producto tenga un ID antes de emitirlo
            if (producto && producto.id) {
              this.loading = false;
              this.productoGuardado.emit(producto);
              this.cdr.markForCheck();
            } else {
              console.error('El producto creado no tiene un ID válido:', producto);
              this.error = 'Error al crear el producto: respuesta inválida del servidor';
              this.loading = false;
              this.cdr.markForCheck();
            }
          },
          error: (error) => {
            console.error('Error creating producto:', error);
            console.error('Error completo:', JSON.stringify(error, null, 2));
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            console.error('Error body:', error.error);

            this.loading = false;
            this.error = this.formatErrorMessage(error);
            this.cdr.markForCheck();
          },
        });
      }
    } else {
      console.log('Formulario inválido');
      console.log('Errores por campo:', this.getFormErrors());
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.cancelar.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productoForm.controls).forEach((key) => {
      const control = this.productoForm.get(key);
      control?.markAsTouched();
    });
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.productoForm.controls).forEach((key) => {
      const control = this.productoForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  private transformFormData(formData: any): any {
    // Transformar los datos para que coincidan exactamente con lo que espera tu API
    const transformedData = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || null,
      stock: Number(formData.stock),
      precio: Number(formData.precio), // Convertir a número como espera tu API
      peso: formData.peso ? Number(formData.peso) : null,
      // Asegurar que la API reciba 1 (disponible) o 0 (no disponible)
      disponible:
        formData.disponible === true || formData.disponible === '1' || formData.disponible === 1
          ? 1
          : 0,
      categoria_id: formData.categoria_id ? Number(formData.categoria_id) : null,
     
    };

    console.log('Transformando datos:', { original: formData, transformed: transformedData });
    return transformedData;
  }

  private formatErrorMessage(error: any): string {
    if (error.status === 422) {
      // Error de validación del servidor
      if (error.error && error.error.errors) {
        const validationErrors = error.error.errors;
        const errorMessages = Object.keys(validationErrors).map((field) => {
          const messages = Array.isArray(validationErrors[field])
            ? validationErrors[field].join(', ')
            : validationErrors[field];
          return `${field}: ${messages}`;
        });
        return `Errores de validación: ${errorMessages.join('; ')}`;
      } else if (error.error && error.error.message) {
        return `Error de validación: ${error.error.message}`;
      }
    }

    return `Error ${error.status}: ${error.error?.message || error.message || 'Error desconocido'}`;
  }

  getFieldError(fieldName: string): string {
    const field = this.productoForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${
          field.errors['minlength'].requiredLength
        } caracteres`;
      }
      if (field.errors['min']) {
        return `${this.getFieldLabel(fieldName)} debe ser mayor a ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      nombre: 'Nombre',
      descripcion: 'Descripción',
      stock: 'Stock',
      precio: 'Precio',
      peso: 'Peso',
      categoria: 'Categoría',
    };
    return labels[fieldName] || fieldName;
  }
}
