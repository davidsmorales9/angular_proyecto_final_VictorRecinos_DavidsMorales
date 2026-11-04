export interface Inscripcion {
    id: string;
    estudianteId: string;
    cursoId: string;
    fechaInscripcion: string;
    periodo: string;
    estatus: 'Borrador' | 'Registrada' | 'En revisión' | 'Aprobada' | 'Rechazada' | 'Cancelada';
}
