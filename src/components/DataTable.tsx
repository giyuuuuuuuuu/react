import { useMemo, useState, type ReactNode } from 'react'

export interface DataColumn<T extends object, K extends keyof T = keyof T> {
  key: K
  header: string
  render?: (value: T[K], row: T) => ReactNode
  parse?: (value: string, row: T) => T[K]
}

interface DataTableProps<T extends object> {
  caption: string
  data: T[]
  columns: DataColumn<T>[]
  getRowId: (row: T) => string
  onRowUpdate: (rowIndex: number, row: T) => void
}

function toInputValue(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  if (value === null || value === undefined) {
    return ''
  }

  return String(value)
}

export function DataTable<T extends object>({
  caption,
  data,
  columns,
  getRowId,
  onRowUpdate,
}: DataTableProps<T>) {
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState<Partial<T>>({})

  const editableRow = useMemo(
    () => (editingRowIndex === null ? undefined : data[editingRowIndex]),
    [data, editingRowIndex],
  )

  const startEditing = (rowIndex: number, row: T) => {
    setEditingRowIndex(rowIndex)
    setEditDraft(row)
  }

  const cancelEditing = () => {
    setEditingRowIndex(null)
    setEditDraft({})
  }

  const updateDraft = <K extends keyof T>(column: DataColumn<T, K>, value: string) => {
    if (!editableRow) {
      return
    }

    const parsedValue = column.parse ? column.parse(value, editableRow) : (value as T[K])
    setEditDraft((currentDraft) => ({
      ...currentDraft,
      [column.key]: parsedValue,
    }))
  }

  const saveDraft = () => {
    if (editingRowIndex === null || !editableRow) {
      return
    }

    onRowUpdate(editingRowIndex, {
      ...editableRow,
      ...editDraft,
    })
    cancelEditing()
  }

  return (
    <div className="table-card">
      <table className="data-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} scope="col">
                {column.header}
              </th>
            ))}
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const isEditing = rowIndex === editingRowIndex

            return (
              <tr key={getRowId(row)}>
                {columns.map((column) => {
                  const currentValue = editDraft[column.key] ?? row[column.key]
                  const renderedValue = column.render
                    ? column.render(row[column.key], row)
                    : toInputValue(row[column.key])

                  return (
                    <td key={String(column.key)}>
                      {isEditing ? (
                        <input
                          aria-label={`${column.header} de ${getRowId(row)}`}
                          value={toInputValue(currentValue)}
                          onChange={(event) => updateDraft(column, event.target.value)}
                        />
                      ) : (
                        renderedValue
                      )}
                    </td>
                  )
                })}
                <td>
                  {isEditing ? (
                    <div className="row-actions">
                      <button type="button" onClick={saveDraft}>
                        Guardar
                      </button>
                      <button type="button" className="secondary" onClick={cancelEditing}>
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => startEditing(rowIndex, row)}>
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
