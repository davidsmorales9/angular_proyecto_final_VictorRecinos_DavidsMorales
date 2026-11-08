
import { Injectable, inject } from '@angular/core';
import { CursoService } from './curso';
import { EstudianteService } from './estudiante';
import { InscripcionService } from './inscripcion';

@Injectable({
  providedIn: 'root'
})
export class RespaldoService {
  private readonly cursoService = inject(CursoService);
  private readonly estudianteService = inject(EstudianteService);
  private readonly inscripcionService = inject(InscripcionService);

  exportarJSON(): void {
    const respaldo = {
      version: 1,
      fechaExportacion: new Date().toISOString(),
      estudiantes: this.estudianteService.getEstudiantes(),
      cursos: this.cursoService.getCursos(),
      inscripciones: this.inscripcionService.getInscripciones()
    };

    const contenido = JSON.stringify(respaldo, null, 2);

    const archivo = new Blob(
      [contenido],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.download = 'respaldo_academico.json';

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);

    URL.revokeObjectURL(url);
  }

  validarJSON(datos: unknown): string[] {
    const errores: string[] = [];

    const esObjeto = (
      valor: unknown
    ): valor is Record<string, unknown> =>
      typeof valor === 'object' &&
      valor !== null &&
      !Array.isArray(valor);

    const textoValido = (
      valor: unknown
    ): valor is string =>
      typeof valor === 'string' &&
      valor.trim().length > 0;

    const fechaValida = (valor: unknown): boolean => {
      if (
        typeof valor !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(valor)
      ) {
        return false;
      }

      const fecha = new Date(`${valor}T00:00:00Z`);

      return !Number.isNaN(fecha.getTime()) &&
        fecha.toISOString().slice(0, 10) === valor;
    };

    if (!esObjeto(datos)) {
      return ['El archivo JSON debe contener un objeto válido.'];
    }

    if (datos['version'] !== 1) {
      errores.push('La versión del archivo debe ser 1.');
    }

    if (
      !textoValido(datos['fechaExportacion']) ||
      Number.isNaN(Date.parse(
        String(datos['fechaExportacion'])
      ))
    ) {
      errores.push('La fecha de exportación no es válida.');
    }

    if (
      !Array.isArray(datos['estudiantes']) ||
      !Array.isArray(datos['cursos']) ||
      !Array.isArray(datos['inscripciones'])
    ) {
      errores.push(
        'El archivo debe contener estudiantes, cursos e inscripciones.'
      );
      return errores;
    }

    const estudiantes: unknown[] = datos['estudiantes'];
    const cursos: unknown[] = datos['cursos'];
    const inscripciones: unknown[] = datos['inscripciones'];

    const idsEstudiantes = new Set<string>();
    const carnets = new Set<string>();
    const idsCursos = new Set<string>();
    const codigosCursos = new Set<string>();
    const idsInscripciones = new Set<string>();

    estudiantes.forEach((item, indice) => {
      const fila = `Estudiante ${indice + 1}`;

      if (!esObjeto(item)) {
        errores.push(`${fila}: estructura inválida.`);
        return;
      }

      if (!textoValido(item['id'])) {
        errores.push(`${fila}: ID obligatorio.`);
      } else if (idsEstudiantes.has(item['id'])) {
        errores.push(`${fila}: ID duplicado.`);
      } else {
        idsEstudiantes.add(item['id']);
      }

      
if (!textoValido(item['carnet'])) {
  errores.push(`${fila}: carnet obligatorio.`);
} else {
  const carnet = item['carnet'];

  if (!/^EST[0-9]{4}$/.test(carnet)) {
    errores.push(
      `${fila}: carnet inválido. Debe comenzar con EST seguido de 4 números. Ejemplo: EST1234.`
    );
  }

  if (carnets.has(carnet)) {
    errores.push(`${fila}: carnet duplicado.`);
  } else {
    carnets.add(carnet);
  }
}


      for (const campo of [
        'nombres',
        'apellidos',
        'correo',
        'carrera',
        'fechaNacimiento',
        'genero',
        'estatus'
      ]) {
        if (!textoValido(item[campo])) {
          errores.push(`${fila}: ${campo} obligatorio.`);
        }
      }

      if (typeof item['direccion'] !== 'string') {
        errores.push(`${fila}: dirección inválida.`);
      }

      if (
        textoValido(item['correo']) &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item['correo'])
      ) {
        errores.push(`${fila}: correo inválido.`);
      }

      if (!fechaValida(item['fechaNacimiento'])) {
        errores.push(`${fila}: fecha de nacimiento inválida.`);
      } else {
        const nacimiento = new Date(
          `${item['fechaNacimiento']}T00:00:00Z`
        );

        const hoy = new Date();

        let edad = hoy.getUTCFullYear() -
          nacimiento.getUTCFullYear();

        const mes = hoy.getUTCMonth() -
          nacimiento.getUTCMonth();

        if (
          mes < 0 ||
          (mes === 0 &&
            hoy.getUTCDate() < nacimiento.getUTCDate())
        ) {
          edad--;
        }

        if (edad < 15 || edad > 100) {
          errores.push(
            `${fila}: la edad debe estar entre 15 y 100 años.`
          );
        }
      }

      if (
        !['Activo', 'Inactivo', 'Suspendido'].includes(
          String(item['estatus'])
        )
      ) {
        errores.push(`${fila}: estatus inválido.`);
      }

      if (!Array.isArray(item['telefonos'])) {
        errores.push(`${fila}: teléfonos debe ser un arreglo.`);
      } else {
        item['telefonos'].forEach(
          (telefono: unknown, posicion: number) => {
            if (
              !esObjeto(telefono) ||
              !textoValido(telefono['numero']) ||
              !textoValido(telefono['tipo']) ||
              typeof telefono['activo'] !== 'boolean'
            ) {
              errores.push(
                `${fila}: teléfono ${posicion + 1} inválido.`
              );
            }
          }
        );
      }
    });

    cursos.forEach((item, indice) => {
      const fila = `Curso ${indice + 1}`;

      if (!esObjeto(item)) {
        errores.push(`${fila}: estructura inválida.`);
        return;
      }

      if (!textoValido(item['id'])) {
        errores.push(`${fila}: ID obligatorio.`);
      } else if (idsCursos.has(item['id'])) {
        errores.push(`${fila}: ID duplicado.`);
      } else {
        idsCursos.add(item['id']);
      }

      if (
        !textoValido(item['codigo']) ||
        !/^[A-Z]{5}[0-9]{3}$/.test(item['codigo'])
      ) {
        errores.push(
          `${fila}: código inválido. Debe tener 5 letras y 3 números.`
        );
      } else if (codigosCursos.has(item['codigo'])) {
        errores.push(`${fila}: código duplicado.`);
      } else {
        codigosCursos.add(item['codigo']);
      }

      if (!textoValido(item['nombre'])) {
        errores.push(`${fila}: nombre obligatorio.`);
      }

      if (
        typeof item['creditos'] !== 'number' ||
        !Number.isInteger(item['creditos']) ||
        item['creditos'] <= 0
      ) {
        errores.push(`${fila}: créditos inválidos.`);
      }

      if (!textoValido(item['carrera'])) {
        errores.push(`${fila}: carrera obligatoria.`);
      }

      if (
        ![
          'Planificado',
          'Abierto',
          'En curso',
          'Cerrado',
          'Cancelado'
        ].includes(String(item['estatus']))
      ) {
        errores.push(`${fila}: estatus inválido.`);
      }
    });

    inscripciones.forEach((item, indice) => {
      const fila = `Inscripción ${indice + 1}`;

      if (!esObjeto(item)) {
        errores.push(`${fila}: estructura inválida.`);
        return;
      }

      if (!textoValido(item['id'])) {
        errores.push(`${fila}: ID obligatorio.`);
      } else if (idsInscripciones.has(item['id'])) {
        errores.push(`${fila}: ID duplicado.`);
      } else {
        idsInscripciones.add(item['id']);
      }

      if (
        !textoValido(item['estudianteId']) ||
        !idsEstudiantes.has(item['estudianteId'])
      ) {
        errores.push(`${fila}: estudiante inexistente.`);
      }

      if (
        !Array.isArray(item['cursoIds']) ||
        item['cursoIds'].length === 0
      ) {
        errores.push(
          `${fila}: debe contener al menos un curso.`
        );
      } else {
        const cursosDeInscripcion = new Set<string>();

        item['cursoIds'].forEach((id: unknown) => {
          if (
            typeof id !== 'string' ||
            !idsCursos.has(id)
          ) {
            errores.push(
              `${fila}: contiene un curso inexistente.`
            );
          } else if (cursosDeInscripcion.has(id)) {
            errores.push(
              `${fila}: contiene un curso repetido.`
            );
          } else {
            cursosDeInscripcion.add(id);
          }
        });
      }

      if (!fechaValida(item['fechaInscripcion'])) {
        errores.push(
          `${fila}: fecha de inscripción inválida.`
        );
      }

      if (
        ![
          '2026-1',
          '2026-2',
          '2027-1',
          '2027-2'
        ].includes(String(item['periodo']))
      ) {
        errores.push(`${fila}: período inválido.`);
      }

      if (
        ![
          'Borrador',
          'Registrada',
          'En revisión',
          'Aprobada',
          'Rechazada',
          'Cancelada'
        ].includes(String(item['estatus']))
      ) {
        errores.push(`${fila}: estatus inválido.`);
      }
    });

    return errores;
  }

  importarJSON(datos: unknown): void {
  const errores = this.validarJSON(datos);

  if (errores.length > 0) {
    throw new Error(errores.join('\n'));
  }

  const respaldo = datos as {
    version: number;
    estudiantes: ReturnType<EstudianteService['getEstudiantes']>;
    cursos: ReturnType<CursoService['getCursos']>;
    inscripciones: ReturnType<InscripcionService['getInscripciones']>;
  };

  const claves = [
    'academic_estudiantes',
    'cursos_db',
    'academic_inscripciones'
  ];

  const valoresAnteriores = claves.map(
    clave => localStorage.getItem(clave)
  );

  try {
    localStorage.setItem(
      claves[0],
      JSON.stringify(respaldo.estudiantes)
    );

    localStorage.setItem(
      claves[1],
      JSON.stringify(respaldo.cursos)
    );

    localStorage.setItem(
      claves[2],
      JSON.stringify(respaldo.inscripciones)
    );
  } catch (error) {
    claves.forEach((clave, indice) => {
      try {
        const anterior = valoresAnteriores[indice];

        if (anterior === null) {
          localStorage.removeItem(clave);
        } else {
          localStorage.setItem(clave, anterior);
        }
      } catch {
        console.error(`No se pudo restaurar ${clave}`);
      }
    });

    throw new Error(
      'No se pudo guardar el respaldo. Verifica el almacenamiento del navegador.'
    );
  }

  this.estudianteService.reemplazarTodos(respaldo.estudiantes);
  this.cursoService.reemplazarTodos(respaldo.cursos);
  this.inscripcionService.reemplazarTodos(respaldo.inscripciones);
}
  
}
