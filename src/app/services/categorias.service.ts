import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface CategoriasResponse extends ApiResponse<Categoria[]> {}
export interface CategoriaResponse extends ApiResponse<Categoria> {}

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categoria[]> {
    console.log('Solicitando categorías desde:', `${this.apiUrl}/categorias`);
    return this.http.get<any>(`${this.apiUrl}/categorias`).pipe(
      map((response) => {
        console.log('Respuesta de categorías:', response);
        // Manejar diferentes estructuras de respuesta
        if (Array.isArray(response)) {
          return response;
        } else if (response.data && Array.isArray(response.data)) {
          return response.data;
        } else if (response.categorias && Array.isArray(response.categorias)) {
          return response.categorias;
        } else {
          console.warn('Estructura de respuesta inesperada:', response);
          return [];
        }
      })
    );
  }

  // Método alternativo para probar diferentes endpoints
  getAllAlternative(): Observable<Categoria[]> {
    const endpoints = [
      `${this.apiUrl}/categorias`,
      `${this.apiUrl}/category`,
      `${this.apiUrl}/categories`,
      `${this.apiUrl}/productos/categorias`,
    ];

    // Por ahora, intentemos con el endpoint original
    return this.getAll();
  }

  getById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/categorias/${id}`);
  }

  create(categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.apiUrl}/categorias`, categoria);
  }

  update(id: number, categoria: Partial<Categoria>): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/categorias/${id}`, categoria);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categorias/${id}`);
  }
}
