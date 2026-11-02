export interface Estudiante {
    id: string;
    carnet: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    genero: string;
    correo: string;
    telefono: string;
    direccion: string;
    carrera: string;
    estatus: 'Activo' | 'Inactivo' | 'Suspendido';
}
