import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EstudianteService } from '../../services/estudiante';
import { Estudiante } from '../../models/estudiante';

// Función de validación personalizada para el rango de edad (Paso 1)
function validarRangoEdad(minEdad: number, maxEdad: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; 
    }

    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();
    
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }

    if (edad < minEdad) {
      return { edadMinima: { minPermitida: minEdad, edadActual: edad } };
    }
    
    if (edad > maxEdad) {
      return { edadMaxima: { maxPermitida: maxEdad, edadActual: edad } };
    }

    return null; 
  };
}

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule
  ],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.css'
})
export class Estudiantes implements OnInit {
  private fb = inject(FormBuilder);
  private estudianteService = inject(EstudianteService);

  estudiantes: Estudiante[] = [];
  formEstudiante!: FormGroup;
  modoEdicion: boolean = false;
  idEdicion: string | null = null;

  // Catálogo requerido para alimentar el combobox de género
  generosCatalogo: string[] = ['Masculino', 'Femenino', 'Otro', 'Prefiero no indicar'];

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarEstudiantes();
  }

  inicializarFormulario(): void {
    this.formEstudiante = this.fb.group({
      carnet: ['', Validators.required],
      primerNombre: ['', Validators.required],
      segundoNombre: [''],
      primerApellido: ['', Validators.required],
      segundoApellido: [''],
      correo: ['', [Validators.required, Validators.email]],
      carrera: ['', Validators.required],
      // Validación de rango de edad aplicada (Ej: Mínimo 15 años, Máximo 100 años) (Paso 2)
      fechaNacimiento: ['', [Validators.required, validarRangoEdad(15, 100)]],
      genero: ['', Validators.required],
      telefono: [''],      
      direccion: [''],     
      estatus: ['Activo']  
    });
  }

  cargarEstudiantes(): void {
    this.estudiantes = this.estudianteService.getEstudiantes();
  }

  guardarEstudiante(): void {
    if (this.formEstudiante.invalid) return; 

    const datos = this.formEstudiante.value;
    
    const estudiantePayload: Estudiante = {
      id: this.idEdicion || '',
      carnet: datos.carnet,
      nombres: `${datos.primerNombre} ${datos.segundoNombre || ''}`.trim(),
      apellidos: `${datos.primerApellido} ${datos.segundoApellido || ''}`.trim(),
      correo: datos.correo,
      carrera: datos.carrera,
      fechaNacimiento: datos.fechaNacimiento,
      genero: datos.genero || 'Otro',
      telefono: datos.telefono || '',
      direccion: datos.direccion || '',
      estatus: datos.estatus || 'Activo'
    };

    if (this.modoEdicion && this.idEdicion !== null) {
      this.estudianteService.actualizarEstudiante(estudiantePayload);
    } else {
      this.estudianteService.agregarEstudiante(estudiantePayload);
    }

    this.resetearFormulario();
    this.cargarEstudiantes();
  }

  editarEstudiante(estudiante: Estudiante): void {
    this.modoEdicion = true;
    this.idEdicion = estudiante.id;
    
    const nombresArr = estudiante.nombres.split(' ');
    const apellidosArr = estudiante.apellidos.split(' ');

    this.formEstudiante.patchValue({
      carnet: estudiante.carnet,
      primerNombre: nombresArr[0] || '',
      segundoNombre: nombresArr.slice(1).join(' ') || '',
      primerApellido: apellidosArr[0] || '',
      segundoApellido: apellidosArr.slice(1).join(' ') || '',
      correo: estudiante.correo,
      carrera: estudiante.carrera,
      fechaNacimiento: estudiante.fechaNacimiento,
      genero: estudiante.genero,
      telefono: estudiante.telefono,
      direccion: estudiante.direccion,
      estatus: estudiante.estatus
    });
  }

  eliminarEstudiante(id: string): void {
    if (confirm('¿Deseas eliminar este estudiante?')) {
      this.estudianteService.eliminarEstudiante(id);
      this.cargarEstudiantes();
    }
  }

  resetearFormulario(): void {
    this.modoEdicion = false;
    this.idEdicion = null;
    this.formEstudiante.reset({ estatus: 'Activo' });
  }
}