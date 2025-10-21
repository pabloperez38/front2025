import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Producto {
  id: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // Assumption: endpoint is /productos — change if your API uses /products
  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`);
  }
}
