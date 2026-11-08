# Sistema de Gestión Académica (Angular + LocalStorage)

Proyecto colaborativo desarrollado con Angular y TypeScript para administrar estudiantes, cursos e inscripciones académicas. Utiliza formularios reactivos, validaciones dinámicas y almacenamiento local del navegador.

## Características principales

### Módulo de Cursos
Permite registrar, consultar, actualizar y eliminar cursos. Incluye validaciones para el código, nombre y cantidad de créditos.

### Módulo de Estudiantes
Permite administrar la información de los estudiantes, incluyendo carnet, nombres, apellidos, carrera y otros datos académicos. Incorpora validaciones para evitar registros incompletos.

### Módulo de Inscripciones
Permite relacionar estudiantes con cursos mediante formularios dinámicos. Los desplegables utilizan la información registrada en los módulos correspondientes.

### Persistencia de datos
El sistema utiliza `localStorage` para conservar los registros en el navegador, incluso después de actualizar la página.

La información se administra mediante servicios de Angular, evitando depender de listas fijas para los registros creados por el usuario.

### Diseño y validaciones
Los formularios utilizan etiquetas flotantes, indicadores visuales de error y botones de envío que se deshabilitan cuando los datos son inválidos.

## Tecnologías utilizadas

- Angular y TypeScript.
- HTML5 y CSS3.
- ReactiveFormsModule.
- FormBuilder y Validators.
- Servicios e inyección de dependencias.
- localStorage.
- Git y GitHub para el control de versiones.

## Arquitectura del proyecto

El sistema está organizado mediante componentes, modelos y servicios.

```text
src/
├── app/
│   ├── components/
│   │   ├── cursos/
│   │   ├── estudiantes/
│   │   └── inscripciones/
│   ├── models/
│   │   ├── curso.ts
│   │   ├── estudiante.ts
│   │   └── inscripcion.ts
│   ├── services/
│   │   ├── cursos.service.ts
│   │   ├── estudiante.ts
│   │   ├── inscripcion.ts
│   │   └── storage.service.ts
│   └── app.routes.ts
├── main.ts
└── styles.css
```

Los componentes administran la interfaz, los modelos representan los datos y los servicios gestionan la lógica y la persistencia.

## Instalación y ejecución

**1. Clonar el repositorio**

```bash
git clone https://github.com/davidsmorales9/angular_proyecto_final_VictorRecinos_DavidsMorales.git
```

**2. Ingresar al proyecto**

```bash
cd angular_proyecto_final_VictorRecinos_DavidsMorales
```

**3. Instalar dependencias**

```bash
npm install
```

**4. Ejecutar la aplicación**

```bash
npx ng serve
```

**5. Abrir en el navegador**

`http://localhost:4200/`

## Verificación del sistema

Durante el desarrollo se realizaron pruebas de compilación y funcionamiento de los módulos.

Se comprobó la integración de estudiantes, cursos e inscripciones, así como la persistencia de los registros después de actualizar la página.

Los botones de envío utilizan condiciones basadas en el estado de los formularios para impedir el envío cuando los datos son inválidos.

## Trabajo colaborativo e historial de commits

El proyecto se desarrolló de manera colaborativa mediante Git y GitHub.

Se organizaron los cambios en commits independientes para facilitar su seguimiento, revisión e integración.

Entre los trabajos realizados se encuentran:

- Implementación de la gestión de cursos.
- Desarrollo de formularios reactivos para estudiantes.
- Integración de inscripciones con estudiantes y cursos.
- Incorporación de validaciones dinámicas.
- Mejoras visuales en los formularios.
- Optimización de los servicios de almacenamiento.
- Verificación de formularios y botones de envío.
- Elaboración de documentación técnica.

Los cambios fueron integrados mediante Pull Request al repositorio compartido.

## Consideraciones

Los datos se almacenan localmente en cada navegador. No se utiliza una base de datos externa ni existe sincronización automática entre diferentes computadoras.

Para conservar la información, se debe evitar eliminar los datos del sitio almacenados en el navegador.

## Repositorio

https://github.com/davidsmorales9/angular_proyecto_final_VictorRecinos_DavidsMorales