
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Inscripcion } from '../models/inscripcion';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private readonly STORAGE_KEY = 'academic_inscripciones';

  private inscripcionesSubject = new BehaviorSubject<Inscripcion[]>([]);

  public inscripciones$: Observable<Inscripcion[]> =
    this.inscripcionesSubject.asObservable();

  constructor() {
    this.cargarDeStorage();
  }

  private cargarDeStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const inscripciones: Inscripcion[] = data ? JSON.parse(data) : [];

    this.inscripcionesSubject.next(inscripciones);
  }

  private guardarEnStorage(inscripciones: Inscripcion[]): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(inscripciones)
    );

    this.inscripcionesSubject.next(inscripciones);
  }

  getInscripciones(): Inscripcion[] {
    return this.inscripcionesSubject.getValue();
  }

  getInscripcionById(id: string): Inscripcion | undefined {
    return this.getInscripciones().find(i => i.id === id);
  }

  agregarInscripcion(inscripcion: Inscripcion): void {
    const nuevaInscripcion: Inscripcion = {
      ...inscripcion,
      id: Date.now().toString()
    };

    const lista = [...this.getInscripciones(), nuevaInscripcion];

    this.guardarEnStorage(lista);
  }

  actualizarInscripcion(inscripcion: Inscripcion): void {
    const lista = this.getInscripciones().map(i =>
      i.id === inscripcion.id ? inscripcion : i
    );

    this.guardarEnStorage(lista);
  }

  eliminarInscripcion(id: string): void {
    const lista = this.getInscripciones().filter(i => i.id !== id);

    this.guardarEnStorage(lista);
  }
}
