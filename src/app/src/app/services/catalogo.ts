import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private readonly jsonUrl = 'assets/catalogo.json';

  constructor(private http: HttpClient) {}

  getCatalogo(): Observable<any> {
    return this.http.get<any>(this.jsonUrl);
  }
}