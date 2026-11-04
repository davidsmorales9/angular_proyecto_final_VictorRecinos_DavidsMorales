import { Routes } from '@angular/router';
import { Estudiantes } from './components/estudiantes/estudiantes';
import { Cursos } from './components/cursos/cursos';
import { Inscripciones} from './components/inscripciones/inscripciones';

export const routes: Routes = [
{ path: "", redirectTo: "estudiantes", pathMatch: "full" },
{ path: "estudiantes", component: Estudiantes },
{ path: "cursos", component: Cursos },
{ path: "inscripciones", component: Inscripciones }
];
