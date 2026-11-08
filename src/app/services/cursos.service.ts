import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';

export interface Curso {
  id: string;
  codigo: string;
  nombre: string;
  creditos: number;
}

@Injectable({ providedIn: 'root' })
export class CursosService {
  private readonly STORAGE_KEY = 'cursos_db';
  private readonly storageService = inject(StorageService);

  constructor() {}

  getCursos(): Curso[] {
    return this.storageService.getItem<Curso>(this.STORAGE_KEY);
  }

  guardarCurso(curso: Omit<Curso, 'id'>): Curso[] {
    const cursos = this.getCursos();
    const nuevoCurso: Curso = { ...curso, id: Date.now().toString() };
    cursos.push(nuevoCurso);
    this.storageService.setItem(this.STORAGE_KEY, cursos);
    return cursos;
  }

  actualizarCurso(cursoActualizado: Curso): Curso[] {
    let cursos = this.getCursos();
    cursos = cursos.map(c => c.id === cursoActualizado.id ? cursoActualizado : c);
    this.storageService.setItem(this.STORAGE_KEY, cursos);
    return cursos;
  }

  eliminarCurso(id: string): Curso[] {
    let cursos = this.getCursos();
    cursos = cursos.filter(c => c.id !== id);
    this.storageService.setItem(this.STORAGE_KEY, cursos);
    return cursos;
  }
}
