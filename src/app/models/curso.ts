export interface Curso {
    id: string;
    codigo: string;
    nombre: string;
    creditos: number;
    jornada: string;
    modalidad: string;
    periodo: string;
    cupoMaximo: number;
    estatus: 'Planificado' | 'Abierto' | 'En curso' | 'Cerrado' | 'Cancelado';
}
