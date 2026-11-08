
export type PeriodoAcademico = '2026-1' | '2026-2' | '2027-1' | '2027-2';

export const PERIODOS_INSCRIPCION: PeriodoAcademico[] = [
  '2026-1',
  '2026-2',
  '2027-1',
  '2027-2'
];

export type EstatusInscripcion =
  | 'Borrador'
  | 'Registrada'
  | 'En revisión'
  | 'Aprobada'
  | 'Rechazada'
  | 'Cancelada';

export const ESTATUS_INSCRIPCION: EstatusInscripcion[] = [
  'Borrador',
  'Registrada',
  'En revisión',
  'Aprobada',
  'Rechazada',
  'Cancelada'
];

export interface Inscripcion {
  id: string;
  estudianteId: string;
  cursoIds: string[];
  fechaInscripcion: string;
  periodo: PeriodoAcademico;
  estatus: EstatusInscripcion;
}
