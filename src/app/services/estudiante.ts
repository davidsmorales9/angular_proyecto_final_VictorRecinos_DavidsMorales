
import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Estudiante } from '../models/estudiante';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private readonly STORAGE_KEY = 'academic_estudiantes';
  private readonly storageService = inject(StorageService);

  private estudiantesSubject = new BehaviorSubject<Estudiante[]>([]);

  public estudiantes$: Observable<Estudiante[]> =
    this.estudiantesSubject.asObservable();

  constructor() {
    this.cargarDeStorage();
  }

  private cargarDeStorage(): void {
    const estudiantes = this.storageService.getItem<Estudiante>(this.STORAGE_KEY);

    let corregidos = false;

    const lista = estudiantes.map(estudiante => {
      const id = estudiante.id || crypto.randomUUID();

      const telefonos = Array.isArray(estudiante.telefonos)
        ? estudiante.telefonos
        : estudiante.telefono
          ? [{
              numero: estudiante.telefono,
              tipo: 'Móvil',
              activo: true
            }]
          : [];

      if (!estudiante.id || !Array.isArray(estudiante.telefonos)) {
        corregidos = true;
      }

      return {
        ...estudiante,
        id,
        telefonos
      };
    });

    if (corregidos) {
      this.guardarEnStorage(lista);
    } else {
      this.estudiantesSubject.next(lista);
    }
  }

  private guardarEnStorage(estudiantes: Estudiante[]): void {
    this.storageService.setItem(this.STORAGE_KEY, estudiantes);
    this.estudiantesSubject.next(estudiantes);
  }

  getEstudiantes(): Estudiante[] {
    return this.estudiantesSubject.getValue();
  }

  getEstudianteById(id: string): Estudiante | undefined {
    return this.getEstudiantes().find(e => e.id === id);
  }

  existeCarnet(carnet: string, idExcluir?: string): boolean {
    return this.getEstudiantes().some(e =>
      e.carnet.trim().toUpperCase() === carnet.trim().toUpperCase()
      && e.id !== idExcluir
    );
  }

  agregarEstudiante(estudiante: Estudiante): void {
    if (this.existeCarnet(estudiante.carnet)) {
      throw new Error('Este carnet ya está registrado.');
    }

    const nuevoEstudiante: Estudiante = {
      ...estudiante,
      id: crypto.randomUUID()
    };

    const lista = [
      ...this.getEstudiantes(),
      nuevoEstudiante
    ];

    this.guardarEnStorage(lista);
  }

  actualizarEstudiante(estudiante: Estudiante): void {
    if (this.existeCarnet(estudiante.carnet, estudiante.id)) {
      throw new Error('Este carnet ya está registrado.');
    }

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
