import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  stock: number;
  precio: string | number;
  peso: number | null;
  disponible: number | boolean;
  categoria?: {
    id: number;
    nombre: string;
    created_at?: string;
    updated_at?: string;
  };
  categoria_id?: number;
  imagen?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ProductosResponse extends ApiResponse<Producto[]> {}
export interface ProductoResponse extends ApiResponse<Producto> {}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`);
  }

  getById(id: number): Observable<Producto> {
    return this.http
      .get<any>(`${this.apiUrl}/productos/${id}`)
      .pipe(map((response) => (response && response.producto ? response.producto : response)));
  }

  create(producto: Partial<Producto>): Observable<Producto> {
    console.log('Enviando POST a:', `${this.apiUrl}/productos`);
    console.log('Datos del producto:', producto);
    return this.http
      .post<{ message: string; producto: Producto }>(`${this.apiUrl}/productos`, producto)
      .pipe(map((response) => response.producto));
  }

  update(id: number, producto: Partial<Producto>): Observable<Producto> {
    console.log('Enviando PUT a:', `${this.apiUrl}/productos/${id}`);
    console.log('Datos del producto:', producto);
    return this.http
      .put<any>(`${this.apiUrl}/productos/${id}`, producto)
      .pipe(map((response) => (response && response.producto ? response.producto : response)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/productos/${id}`);
  }
}
