
export interface Contacto {
  numero: string;
  tipo: string;
  activo: boolean;
}

export interface Estudiante {
  id: string;
  carnet: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  genero: string;
  correo: string;
  telefonos: Contacto[];
  telefono?: string;
  direccion: string;
  carrera: string;
  estatus: 'Activo' | 'Inactivo' | 'Suspendido';
}
