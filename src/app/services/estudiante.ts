
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Estudiante } from '../models/estudiante';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private readonly STORAGE_KEY = 'academic_estudiantes';

  private estudiantesSubject = new BehaviorSubject<Estudiante[]>([]);

  public estudiantes$: Observable<Estudiante[]> =
    this.estudiantesSubject.asObservable();

  constructor() {
    this.cargarDeStorage();
  }

  private cargarDeStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const estudiantes: Estudiante[] = data ? JSON.parse(data) : [];

    let corregidos = false;

    const lista = estudiantes.map(estudiante => {
      if (!estudiante.id) {
        corregidos = true;

        return {
          ...estudiante,
          id: crypto.randomUUID()
        };
      }

      return estudiante;
    });

    if (corregidos) {
      this.guardarEnStorage(lista);
    } else {
      this.estudiantesSubject.next(lista);
    }
  }

  private guardarEnStorage(estudiantes: Estudiante[]): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(estudiantes)
    );

    this.estudiantesSubject.next(estudiantes);
  }

  getEstudiantes(): Estudiante[] {
    return this.estudiantesSubject.getValue();
  }

  getEstudianteById(id: string): Estudiante | undefined {
    return this.getEstudiantes().find(e => e.id === id);
  }

  agregarEstudiante(estudiante: Estudiante): void {
    const nuevoEstudiante: Estudiante = {
      ...estudiante,
      id: Date.now().toString()
    };

    const lista = [
      ...this.getEstudiantes(),
      nuevoEstudiante
    ];

    this.guardarEnStorage(lista);
  }

  actualizarEstudiante(estudiante: Estudiante): void {
    const lista = this.getEstudiantes().map(e =>
      e.id === estudiante.id ? estudiante : e
    );

    this.guardarEnStorage(lista);
  }

  eliminarEstudiante(id: string): void {
    const lista = this.getEstudiantes().filter(e => e.id !== id);

    this.guardarEnStorage(lista);
  }
}
