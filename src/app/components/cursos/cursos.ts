  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
  import { CursosService, Curso } from '../../services/cursos.service';

  @Component({
    selector: 'app-cursos',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './cursos.html',
    styleUrl: './cursos.css'
  })
  export class Cursos implements OnInit {
    formCurso!: FormGroup;
    cursos: Curso[] = [];
    modoEdicion: boolean = false;
    idEdicion: string | null = null;

    constructor(
      private fb: FormBuilder,
      private cursosService: CursosService
    ) {}

    ngOnInit(): void {
      this.inicializarFormulario();
      this.cargarCursos();
    }

    inicializarFormulario(): void {
    this.formCurso = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern(/\S/)]],
      nombre: ['', [Validators.required,Validators.pattern(/\S/),Validators.minLength(3),Validators.maxLength(100)]],
      creditos: ['', [Validators.required, Validators.min(1)]],
    });
  }

    cargarCursos(): void {
      this.cursos = this.cursosService.getCursos();
    }

    guardarCurso(): void {
      if (this.formCurso.invalid) {
        this.formCurso.markAllAsTouched();
        return;
      }

      if (this.modoEdicion && this.idEdicion) {
        const cursoEditado: Curso = {
          id: this.idEdicion,
          ...this.formCurso.value
        };
        this.cursos = this.cursosService.actualizarCurso(cursoEditado);
      } else {
        this.cursos = this.cursosService.guardarCurso(this.formCurso.value);
      }

      this.resetearFormulario();
    }

    editarCurso(item: Curso): void {
      this.modoEdicion = true;
      this.idEdicion = item.id;
      this.formCurso.patchValue({
        codigo: item.codigo,
        nombre: item.nombre,
        creditos: item.creditos
      });
    }

    eliminarCurso(id: string): void {
      this.cursos = this.cursosService.eliminarCurso(id);
      if (this.idEdicion === id) {
        this.resetearFormulario();
      }
    }

    resetearFormulario(): void {
      this.formCurso.reset();
      this.modoEdicion = false;
      this.idEdicion = null;
    }
  }
