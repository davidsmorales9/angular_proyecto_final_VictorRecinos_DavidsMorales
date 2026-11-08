import { Injectable } from '@angular/core';

export interface Curso {
  id: string;
  codigo: string;
  nombre: string;
  creditos: number;
}

@Injectable({ providedIn: 'root' })
export class CursosService {
  private readonly STORAGE_KEY = 'cursos_db';

  constructor() {}

  getCursos(): Curso[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  guardarCurso(curso: Omit<Curso, 'id'>): Curso[] {
    const cursos = this.getCursos();
    const nuevoCurso: Curso = { ...curso, id: Date.now().toString() };
    cursos.push(nuevoCurso);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cursos));
    return cursos;
  }

  actualizarCurso(cursoActualizado: Curso): Curso[] {
    let cursos = this.getCursos();
    cursos = cursos.map(c => c.id === cursoActualizado.id ? cursoActualizado : c);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cursos));
    return cursos;
  }

  eliminarCurso(id: string): Curso[] {
    let cursos = this.getCursos();
    cursos = cursos.filter(c => c.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cursos));
    return cursos;
  }
}
