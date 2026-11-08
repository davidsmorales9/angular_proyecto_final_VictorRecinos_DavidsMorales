
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { InscripcionService } from '../../services/inscripcion';
import {
  Inscripcion,
  ESTATUS_INSCRIPCION,
  PERIODOS_INSCRIPCION
} from '../../models/inscripcion';

import { EstudianteService } from '../../services/estudiante';
import { Estudiante } from '../../models/estudiante';

import {
  CursosService,
  Curso
} from '../../services/cursos.service';

@Component({
  selector: 'app-inscripciones',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './inscripciones.html',
  styleUrl: './inscripciones.css'
})
export class Inscripciones implements OnInit {

  inscripciones: Inscripcion[] = [];
  estudiantes: Estudiante[] = [];
  cursosDisponibles: Curso[] = [];

  formInscripcion!: FormGroup;

  modoEdicion = false;
  idEdicion: string | null = null;

  listaEstatus = ESTATUS_INSCRIPCION;
  listaPeriodos = PERIODOS_INSCRIPCION;

  filtroEstudiante = '';
  filtroPeriodo = '';
  filtroEstatus = '';

  constructor(
    private fb: FormBuilder,
    private inscripcionService: InscripcionService,
    private estudianteService: EstudianteService,
    private cursosService: CursosService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarDatos();
  }

  inicializarFormulario(): void {
    this.formInscripcion = this.fb.group({
      estudianteId: ['', Validators.required],
      cursoIds: [[], Validators.required],
      fechaInscripcion: [
        this.obtenerFechaActual(),
        Validators.required
      ],
      periodo: ['2026-1', Validators.required],
      estatus: ['Registrada', Validators.required]
    });
  }

  obtenerFechaActual(): string {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  cargarDatos(): void {
    this.estudiantes = this.estudianteService.getEstudiantes();
    this.cursosDisponibles = this.cursosService.getCursos();
    this.inscripciones = this.inscripcionService.getInscripciones();
  }

  cambiarCurso(cursoId: string, seleccionado: boolean): void {
    const cursos: string[] =
      this.formInscripcion.get('cursoIds')?.value || [];

    const nuevosCursos = seleccionado
      ? [...new Set([...cursos, cursoId])]
      : cursos.filter(id => id !== cursoId);

    this.formInscripcion.get('cursoIds')?.setValue(nuevosCursos);
    this.formInscripcion.get('cursoIds')?.markAsTouched();
  }

  cursoSeleccionado(cursoId: string): boolean {
    const cursos: string[] =
      this.formInscripcion.get('cursoIds')?.value || [];

    return cursos.includes(cursoId);
  }

  guardarInscripcion(): void {
    this.cargarDatos();

    if (this.formInscripcion.invalid) {
      this.formInscripcion.markAllAsTouched();
      return;
    }

    const datos = this.formInscripcion.value;

    const estudianteExiste = this.estudiantes.some(
      e => e.id === datos.estudianteId
    );

    const cursosValidos =
      Array.isArray(datos.cursoIds) &&
      datos.cursoIds.length > 0 &&
      datos.cursoIds.every((id: string) =>
        this.cursosDisponibles.some(c => c.id === id)
      );

    if (!estudianteExiste || !cursosValidos) {
      alert('Seleccione un estudiante y cursos válidos.');
      return;
    }

    const payload: Inscripcion = {
      id: this.idEdicion || '',
      estudianteId: datos.estudianteId,
      cursoIds: datos.cursoIds,
      fechaInscripcion: datos.fechaInscripcion,
      periodo: datos.periodo,
      estatus: datos.estatus
    };

    if (this.modoEdicion && this.idEdicion !== null) {
      this.inscripcionService.actualizarInscripcion(payload);
    } else {
      this.inscripcionService.agregarInscripcion(payload);
    }

    this.resetearFormulario();
    this.cargarDatos();
  }

  editarInscripcion(inscripcion: Inscripcion): void {
    this.modoEdicion = true;
    this.idEdicion = inscripcion.id;

    this.formInscripcion.patchValue({
      estudianteId: inscripcion.estudianteId,
      cursoIds: [...inscripcion.cursoIds],
      fechaInscripcion: inscripcion.fechaInscripcion,
      periodo: inscripcion.periodo,
      estatus: inscripcion.estatus
    });
  }

  cancelarInscripcion(id: string): void {
    if (confirm('¿Desea cancelar esta inscripción?')) {
      this.inscripcionService.cancelarInscripcion(id);

      if (this.idEdicion === id) {
        this.resetearFormulario();
      }

      this.cargarDatos();
    }
  }

  eliminarInscripcion(id: string): void {
    if (confirm('¿Desea eliminar esta inscripción?')) {
      this.inscripcionService.eliminarInscripcion(id);

      if (this.idEdicion === id) {
        this.resetearFormulario();
      }

      this.cargarDatos();
    }
  }

  resetearFormulario(): void {
    this.modoEdicion = false;
    this.idEdicion = null;

    this.formInscripcion.reset({
      estudianteId: '',
      cursoIds: [],
      fechaInscripcion: this.obtenerFechaActual(),
      periodo: '2026-1',
      estatus: 'Registrada'
    });
  }

  getNombreEstudiante(estudianteId: string): string {
    const estudiante = this.estudiantes.find(
      e => e.id === estudianteId
    );

    return estudiante
      ? `${estudiante.carnet} - ${estudiante.nombres} ${estudiante.apellidos}`
      : 'Estudiante no encontrado';
  }

  getNombreCurso(cursoId: string): string {
    const curso = this.cursosDisponibles.find(
      c => c.id === cursoId
    );

    return curso
      ? `${curso.codigo} - ${curso.nombre}`
      : 'Curso no encontrado';
  }

  getNombresCursos(cursoIds: string[]): string {
    return cursoIds.map(id => this.getNombreCurso(id)).join(', ');
  }

  get inscripcionesFiltradas(): Inscripcion[] {
    return this.inscripciones.filter(inscripcion => {
      const coincideEstudiante =
        !this.filtroEstudiante ||
        inscripcion.estudianteId === this.filtroEstudiante;

      const coincidePeriodo =
        !this.filtroPeriodo ||
        inscripcion.periodo === this.filtroPeriodo;

      const coincideEstatus =
        !this.filtroEstatus ||
        inscripcion.estatus === this.filtroEstatus;

      return coincideEstudiante &&
             coincidePeriodo &&
             coincideEstatus;
    });
  }
}
