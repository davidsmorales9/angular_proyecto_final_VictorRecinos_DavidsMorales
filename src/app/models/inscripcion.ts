// Definición de tipos permitidos para el periodo académico
export type PeriodoAcademico = 'Matutino' | 'Vespertino' | 'Nocturno' | 'Fin de semana';

// Catálogo exportado para alimentar el combo dinámicamente
export const PERIODOS_INSCRIPCION: PeriodoAcademico[] = [
    'Matutino',
    'Vespertino',
    'Nocturno',
    'Fin de semana'
];

export type EstatusInscripcion = 'Borrador' | 'Registrada' | 'En revisión' | 'Aprobada' | 'Rechazada' | 'Cancelada';

export const ESTATUS_INSCRIPCION: EstatusInscripcion[] = [
    'Borrador',
    'Registrada',
    'En revisión',
    'Aprobada',
    'Rechazada',
    'Cancelada'
];

// Interfaz principal del modelo de inscripción
export interface Inscripcion {
    id: string;
    estudianteId: string;
    cursoId: string;
    fechaInscripcion: string;
    periodo: PeriodoAcademico;
    estatus: EstatusInscripcion;
}