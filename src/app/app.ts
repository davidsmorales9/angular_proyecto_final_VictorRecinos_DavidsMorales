
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { RespaldoService } from './services/respaldo';

interface ResumenRespaldo {
  estudiantes: number;
  cursos: number;
  inscripciones: number;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal(
    'angular_proyecto_final_VictorRecinos_DavidsMorales'
  );

  private readonly respaldoService = inject(RespaldoService);

  mensajeImportacion = '';
  erroresImportacion: string[] = [];
  resumenRespaldo: ResumenRespaldo | null = null;
  archivoValidado: unknown = null;
  importando = false;

  exportarJSON(): void {
    this.respaldoService.exportarJSON();
  }

  async seleccionarArchivo(evento: Event): Promise<void> {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];

    this.limpiarImportacion();

    if (!archivo) {
      return;
    }

    try {
      if (!archivo.name.toLowerCase().endsWith('.json')) {
        throw new Error('Selecciona un archivo con extensión .json.');
      }

      const contenido = await archivo.text();
      const datos: unknown = JSON.parse(contenido);
      const errores = this.respaldoService.validarJSON(datos);

      if (errores.length > 0) {
        this.erroresImportacion = errores;
        this.mensajeImportacion =
          `El archivo contiene ${errores.length} error(es).`;
        return;
      }

      const respaldo = datos as {
        estudiantes: unknown[];
        cursos: unknown[];
        inscripciones: unknown[];
      };

      this.archivoValidado = datos;

      this.resumenRespaldo = {
        estudiantes: respaldo.estudiantes.length,
        cursos: respaldo.cursos.length,
        inscripciones: respaldo.inscripciones.length
      };

      this.mensajeImportacion =
        'Archivo válido. Revisa los registros antes de importar.';
    } catch (error) {
      this.mensajeImportacion =
        error instanceof SyntaxError
          ? 'El archivo no contiene un JSON válido.'
          : error instanceof Error
            ? error.message
            : 'No se pudo leer el archivo.';
    } finally {
      input.value = '';
    }
  }

  confirmarImportacion(): void {
    if (!this.archivoValidado || this.importando) {
      return;
    }

    const confirmado = window.confirm(
      '¿Deseas reemplazar todos los estudiantes, cursos e inscripciones actuales? Esta acción sobrescribirá los registros existentes.'
    );

    if (!confirmado) {
      return;
    }

    this.importando = true;

    try {
      this.respaldoService.importarJSON(this.archivoValidado);

      this.limpiarImportacion();
      this.mensajeImportacion =
        'Los datos se importaron correctamente.';
    } catch (error) {
      this.mensajeImportacion =
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al importar los datos.';
    } finally {
      this.importando = false;
    }
  }

  cancelarImportacion(): void {
    this.limpiarImportacion();
    this.mensajeImportacion = 'Importación cancelada.';
  }

  private limpiarImportacion(): void {
    this.mensajeImportacion = '';
    this.erroresImportacion = [];
    this.resumenRespaldo = null;
    this.archivoValidado = null;
  }
}
