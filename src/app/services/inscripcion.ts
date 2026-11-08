
import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

import {
  Inscripcion,
  PeriodoAcademico
} from '../models/inscripcion';

type InscripcionAnterior = Partial<Inscripcion> & {
  cursoId?: string;
  periodo?: PeriodoAcademico | string;
};

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {

  private readonly STORAGE_KEY = 'academic_inscripciones';
  private readonly storageService = inject(StorageService);

  private inscripcionesSubject = new BehaviorSubject<Inscripcion[]>([]);

  public inscripciones$: Observable<Inscripcion[]> =
    this.inscripcionesSubject.asObservable();

  constructor() {
    this.cargarDeStorage();
  }

  private cargarDeStorage(): void {
    const inscripciones =
      this.storageService.getItem<InscripcionAnterior>(this.STORAGE_KEY);

    let corregidos = false;

    const lista: Inscripcion[] = inscripciones.map(inscripcion => {

      const cursoIds = Array.isArray(inscripcion.cursoIds)
        ? inscripcion.cursoIds
        : inscripcion.cursoId
          ? [inscripcion.cursoId]
          : [];

      const periodosValidos: PeriodoAcademico[] = [
        '2026-1',
        '2026-2',
        '2027-1',
        '2027-2'
      ];

      const periodo = periodosValidos.includes(
        inscripcion.periodo as PeriodoAcademico
      )
        ? inscripcion.periodo as PeriodoAcademico
        : '2026-1';

      if (
        !Array.isArray(inscripcion.cursoIds) ||
        inscripcion.periodo !== periodo ||
        !inscripcion.id
      ) {
        corregidos = true;
      }

      return {
        id: inscripcion.id || crypto.randomUUID(),
        estudianteId: inscripcion.estudianteId || '',
        cursoIds,
        fechaInscripcion: inscripcion.fechaInscripcion || '',
        periodo,
        estatus: inscripcion.estatus || 'Registrada'
      };
    });

    if (corregidos) {
      this.guardarEnStorage(lista);
    } else {
      this.inscripcionesSubject.next(lista);
    }
  }

  private guardarEnStorage(inscripciones: Inscripcion[]): void {
    this.storageService.setItem(this.STORAGE_KEY, inscripciones);
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
      id: crypto.randomUUID()
    };

    const lista = [
      ...this.getInscripciones(),
      nuevaInscripcion
    ];

    this.guardarEnStorage(lista);
  }

  actualizarInscripcion(inscripcion: Inscripcion): void {
    const lista = this.getInscripciones().map(i =>
      i.id === inscripcion.id ? inscripcion : i
    );

    this.guardarEnStorage(lista);
  }

  cancelarInscripcion(id: string): void {
    const lista = this.getInscripciones().map(i =>
      i.id === id
        ? { ...i, estatus: 'Cancelada' as const }
        : i
    );

    this.guardarEnStorage(lista);
  }

  eliminarInscripcion(id: string): void {
    const lista = this.getInscripciones().filter(i => i.id !== id);

    this.guardarEnStorage(lista);
  }
}
