
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EstudianteService } from '../../services/estudiante';
import { Estudiante, Contacto } from '../../models/estudiante';

function validarRangoEdad(minEdad: number, maxEdad: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const fechaNacimiento = new Date(control.value);

    if (isNaN(fechaNacimiento.getTime())) {
      return { fechaInvalida: true };
    }

    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();

    if (
      mes < 0 ||
      (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())
    ) {
      edad--;
    }

    if (edad < minEdad) {
      return { edadMinima: true };
    }

    if (edad > maxEdad) {
      return { edadMaxima: true };
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
export class Estudiantes implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private estudianteService = inject(EstudianteService);
  private estudiantesSubscription?: Subscription;

  estudiantes: Estudiante[] = [];
  formEstudiante!: FormGroup;

  modoEdicion: boolean = false;
  idEdicion: string | null = null;
  filtroEstudiantes: string = '';

  generosCatalogo: string[] = [
    'Masculino',
    'Femenino',
    'Otro',
    'Prefiero no indicar'
  ];

  tiposContacto: string[] = [
    'Móvil',
    'Casa',
    'Trabajo',
    'Otro'
  ];

  ngOnInit(): void {
    this.inicializarFormulario();

    this.estudiantesSubscription =
      this.estudianteService.estudiantes$.subscribe(estudiantes => {
        this.estudiantes = estudiantes;
      });
  }

  ngOnDestroy(): void {
    this.estudiantesSubscription?.unsubscribe();
  }

  inicializarFormulario(): void {
    this.formEstudiante = this.fb.group({
      carnet: ['', [
        Validators.required,
        Validators.pattern(/\S/)
      ]],
      primerNombre: ['', [
        Validators.required,
        Validators.pattern(/\S/)
      ]],
      segundoNombre: [''],
      primerApellido: ['', [
        Validators.required,
        Validators.pattern(/\S/)
      ]],
      segundoApellido: [''],
      correo: ['', [
        Validators.required,
        Validators.email
      ]],
      carrera: ['', [
        Validators.required,
        Validators.pattern(/\S/)
      ]],
      fechaNacimiento: ['', [
        Validators.required,
        validarRangoEdad(15, 100)
      ]],
      genero: ['', Validators.required],
      telefonos: this.fb.array([]),
      direccion: ['', [
        Validators.required,
        Validators.pattern(/\S/)
      ]],
      estatus: ['Activo', Validators.required]
    });
  }

  get telefonos(): FormArray {
    return this.formEstudiante.get('telefonos') as FormArray;
  }

  crearTelefono(contacto?: Contacto): FormGroup {
    return this.fb.group({
      numero: [
        contacto?.numero || '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{8}$/)
        ]
      ],
      tipo: [
        contacto?.tipo || 'Móvil',
        Validators.required
      ],
      activo: [
        contacto?.activo ?? true
      ]
    });
  }

  agregarTelefono(): void {
    this.telefonos.push(this.crearTelefono());
  }

  eliminarTelefono(index: number): void {
    this.telefonos.removeAt(index);
  }

  cargarEstudiantes(): void {
    this.estudiantes = this.estudianteService.getEstudiantes();
  }

  guardarEstudiante(): void {
    if (this.formEstudiante.invalid) {
      this.formEstudiante.markAllAsTouched();
      return;
    }

    const datos = this.formEstudiante.value;

    if (
      this.estudianteService.existeCarnet(
        datos.carnet,
        this.idEdicion || undefined
      )
    ) {
      this.formEstudiante.get('carnet')?.setErrors({
        duplicado: true
      });

      this.formEstudiante.get('carnet')?.markAsTouched();
      return;
    }

    const estudiantePayload: Estudiante = {
      id: this.idEdicion || crypto.randomUUID(),
      carnet: datos.carnet.trim(),
      nombres: `${datos.primerNombre.trim()} ${(datos.segundoNombre || '').trim()}`.trim(),
      apellidos: `${datos.primerApellido.trim()} ${(datos.segundoApellido || '').trim()}`.trim(),
      correo: datos.correo.trim(),
      carrera: datos.carrera.trim(),
      fechaNacimiento: datos.fechaNacimiento,
      genero: datos.genero,
      telefonos: datos.telefonos,
      direccion: datos.direccion.trim(),
      estatus: datos.estatus
    };

    try {
      if (this.modoEdicion && this.idEdicion !== null) {
        this.estudianteService.actualizarEstudiante(
          estudiantePayload
        );
      } else {
        this.estudianteService.agregarEstudiante(
          estudiantePayload
        );
      }

      this.resetearFormulario();

    } catch (error) {
      this.formEstudiante.get('carnet')?.setErrors({
        duplicado: true
      });

      this.formEstudiante.get('carnet')?.markAsTouched();
    }
  }

  editarEstudiante(estudiante: Estudiante): void {
    this.modoEdicion = true;
    this.idEdicion = estudiante.id;

    const nombresArr = estudiante.nombres.split(' ');
    const apellidosArr = estudiante.apellidos.split(' ');

    this.telefonos.clear();

    for (const contacto of estudiante.telefonos || []) {
      this.telefonos.push(this.crearTelefono(contacto));
    }

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
      direccion: estudiante.direccion,
      estatus: estudiante.estatus
    });
  }

  eliminarEstudiante(id: string): void {
    if (confirm('¿Deseas eliminar este estudiante?')) {
      this.estudianteService.eliminarEstudiante(id);

      if (this.idEdicion === id) {
        this.resetearFormulario();
      }
    }
  }

  resetearFormulario(): void {
    this.modoEdicion = false;
    this.idEdicion = null;

    this.formEstudiante.reset({
      estatus: 'Activo'
    });

    this.telefonos.clear();
  }

  get estudiantesFiltrados(): Estudiante[] {
    const filtro = this.filtroEstudiantes.trim().toLowerCase();

    if (!filtro) {
      return this.estudiantes;
    }

    return this.estudiantes.filter(e =>
      e.carnet.toLowerCase().includes(filtro) ||
      e.nombres.toLowerCase().includes(filtro) ||
      e.apellidos.toLowerCase().includes(filtro)
    );
  }
}
