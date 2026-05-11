import { differenceInCalendarDays } from 'date-fns'

export function obtenerDiferenciaEnDias(fechaInicio: Date, fechaFin: Date): number {
  return differenceInCalendarDays(fechaFin, fechaInicio)
}
