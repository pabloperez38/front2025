import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriasService } from '../services/categorias.service';

@Component({
  selector: 'app-test-categorias',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Test de Categorías</h2>
      <button class="btn btn-primary" (click)="testCategorias()">Probar API de Categorías</button>

      @if (loading) {
      <div class="alert alert-info mt-3">Cargando...</div>
      } @if (error) {
      <div class="alert alert-danger mt-3"><strong>Error:</strong> {{ error }}</div>
      } @if (categorias.length > 0) {
      <div class="alert alert-success mt-3">
        <strong>Éxito:</strong> Se cargaron {{ categorias.length }} categorías
      </div>
      <ul class="list-group mt-3">
        @for (categoria of categorias; track categoria.id) {
        <li class="list-group-item">ID: {{ categoria.id }} - Nombre: {{ categoria.nombre }}</li>
        }
      </ul>
      } @if (rawResponse) {
      <div class="mt-3">
        <h4>Respuesta Raw:</h4>
        <pre class="bg-light p-3">{{ rawResponse | json }}</pre>
      </div>
      }
    </div>
  `,
})
export class TestCategorias implements OnInit {
  categorias: any[] = [];
  loading = false;
  error: string | null = null;
  rawResponse: any = null;

  constructor(private categoriasService: CategoriasService) {}

  ngOnInit(): void {}

  testCategorias(): void {
    this.loading = true;
    this.error = null;
    this.categorias = [];
    this.rawResponse = null;

    console.log('Iniciando test de categorías...');

    this.categoriasService.getAll().subscribe({
      next: (categorias) => {
        console.log('Categorías recibidas:', categorias);
        this.categorias = categorias;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en test:', error);
        this.error = `Error: ${error.message || error.statusText || 'Error desconocido'}`;
        this.rawResponse = error;
        this.loading = false;
      },
    });
  }
}
