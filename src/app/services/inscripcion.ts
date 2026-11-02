import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Inscripcion } from '../models/inscripcion';

@Injectable({
  providedIn: 'root'
})

//Clase para el servicio de inscripciones
export class InscripcionService {
  //Clave para almacenar las inscripciones en el almacenamiento local
  private readonly STORAGE_KEY = 'academic_inscripciones';
  //Sujeto de comportamiento para manejar la lista de inscripciones
  private inscripcionesSubject = new BehaviorSubject<Inscripcion[]>([]);
  public inscripciones$: Observable<Inscripcion[]> = this.inscripcionesSubject.asObservable();

  //Constructor que carga las inscripciones desde el almacenamiento local al inicializar el servicio
  constructor() {
    this.cargarDeStorage();
  }


  //Carga las inscripciones desde el local storage.
  private cargarDeStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const inscripciones: Inscripcion[] = data ? JSON.parse(data) : [];
    this.inscripcionesSubject.next(inscripciones);
  }

  //Guarda las inscripciones en el locar storage.
  private guardarEnStorage(inscripciones: Inscripcion[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(inscripciones));
    this.inscripcionesSubject.next(inscripciones);
  }


  getInscripciones(): Inscripcion[] {
    return this.inscripcionesSubject.getValue();
  }

  
  getInscripcionById(id: string): Inscripcion | undefined {
    return this.getInscripciones().find(i => i.id === id);
  }

  agregarInscripcion(inscripcion: Inscripcion): void {
    const lista = [...this.getInscripciones(), inscripcion];
    this.guardarEnStorage(lista);
  }

  actualizarInscripcion(inscripcion: Inscripcion): void {
    const lista = this.getInscripciones().map(i => i.id === inscripcion.id ? inscripcion : i);
    this.guardarEnStorage(lista);
  }

  eliminarInscripcion(id: string): void {
    const lista = this.getInscripciones().filter(i => i.id !== id);
    this.guardarEnStorage(lista);
  }
}