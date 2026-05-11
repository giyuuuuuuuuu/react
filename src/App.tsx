import { useState } from 'react'
import { DataTable, type DataColumn } from './components/DataTable'
import { obtenerDiferenciaEnDias } from './utils/date-difference'
import './App.css'

interface ProyectoAcademico {
  id: string
  estudiante: string
  asignatura: string
  creditos: number
  fechaInicio: Date
  fechaEntrega: Date
}

const proyectosIniciales: ProyectoAcademico[] = [
  {
    id: 'PR-001',
    estudiante: 'Ana Torres',
    asignatura: 'Matematicas Discretas',
    creditos: 4,
    fechaInicio: new Date('2026-05-01'),
    fechaEntrega: new Date('2026-05-18'),
  },
  {
    id: 'PR-002',
    estudiante: 'Luis Perez',
    asignatura: 'Arquitectura de Software',
    creditos: 5,
    fechaInicio: new Date('2026-05-04'),
    fechaEntrega: new Date('2026-05-23'),
  },
  {
    id: 'PR-003',
    estudiante: 'Marta Gil',
    asignatura: 'Bases de Datos',
    creditos: 3,
    fechaInicio: new Date('2026-05-08'),
    fechaEntrega: new Date('2026-05-28'),
  },
]

const crearColumnaProyecto = <K extends keyof ProyectoAcademico>(
  column: DataColumn<ProyectoAcademico, K>,
) => column

const columnasProyecto: DataColumn<ProyectoAcademico>[] = [
  crearColumnaProyecto({ key: 'id', header: 'Codigo' }),
  crearColumnaProyecto({ key: 'estudiante', header: 'Estudiante' }),
  crearColumnaProyecto({ key: 'asignatura', header: 'Asignatura' }),
  crearColumnaProyecto({
    key: 'creditos',
    header: 'Creditos',
    parse: (value) => Number(value),
  }),
  crearColumnaProyecto({
    key: 'fechaInicio',
    header: 'Inicio',
    render: (value) => value.toLocaleDateString('es-ES'),
    parse: (value) => new Date(value),
  }),
  crearColumnaProyecto({
    key: 'fechaEntrega',
    header: 'Entrega',
    render: (value) => value.toLocaleDateString('es-ES'),
    parse: (value) => new Date(value),
  }),
]

function App() {
  const [proyectos, setProyectos] = useState<ProyectoAcademico[]>(proyectosIniciales)

  const actualizarProyecto = (rowIndex: number, proyectoActualizado: ProyectoAcademico) => {
    setProyectos((proyectosActuales) =>
      proyectosActuales.map((proyecto, index) =>
        index === rowIndex ? proyectoActualizado : proyecto,
      ),
    )
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Laboratorio practico 3</p>
          <h1>Tabla generica con TypeScript estricto</h1>
          <p>
            El componente <code>DataTable&lt;T&gt;</code> renderiza entidades distintas usando
            columnas tipadas con <code>keyof T</code> y edicion temporal con{' '}
            <code>Partial&lt;T&gt;</code>.
          </p>
        </div>
      </section>

      <DataTable
        caption="Proyectos academicos"
        data={proyectos}
        columns={columnasProyecto}
        getRowId={(proyecto) => proyecto.id}
        onRowUpdate={actualizarProyecto}
      />

      <section className="summary-card">
        <h2>Calculo de fechas tipado</h2>
        <p>
          El primer proyecto tiene{' '}
          <strong>
            {obtenerDiferenciaEnDias(proyectos[0].fechaInicio, proyectos[0].fechaEntrega)} dias
          </strong>{' '}
          entre la fecha de inicio y la fecha de entrega.
        </p>
      </section>
    </main>
  )
}

export default App
