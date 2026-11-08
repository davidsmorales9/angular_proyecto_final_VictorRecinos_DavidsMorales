import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Curso } from '../models/curso';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private readonly STORAGE_KEY = 'cursos_db';
  private cursosSubject = new BehaviorSubject<Curso[]>([]);
  public cursos$: Observable<Curso[]> = this.cursosSubject.asObservable();

  constructor() {
    this.cargarDeStorage();
  }

  private cargarDeStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const cursos: Curso[] = data ? JSON.parse(data) : [];
    this.cursosSubject.next(cursos);
  }

  private guardarEnStorage(cursos: Curso[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cursos));
    this.cursosSubject.next(cursos);
  }

  getCursos(): Curso[] {
    return this.cursosSubject.getValue();
  }

  getCursoById(id: string): Curso | undefined {
    return this.getCursos().find(c => c.id === id);
  }

  agregarCurso(curso: Curso): void {
    const lista = [...this.getCursos(), curso];
    this.guardarEnStorage(lista);
  }

  actualizarCurso(curso: Curso): void {
    const lista = this.getCursos().map(c => c.id === curso.id ? curso : c);
    this.guardarEnStorage(lista);
  }

  eliminarCurso(id: string): void {
    const lista = this.getCursos().filter(c => c.id !== id);
    this.guardarEnStorage(lista);
  }

  reemplazarTodos(cursos: Curso[]): void {
  this.guardarEnStorage(cursos);
}
}