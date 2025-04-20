import { parse, format, isValid } from 'date-fns'

const DATE_FORMAT = 'yyyy-MM-dd'
const TIME_FORMAT = 'HH:mm:ss'
const DATE_TIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`

export function parseDate(dateStr: string): Date | null {
  const parsed = parse(dateStr, DATE_FORMAT, new Date())
  return isValid(parsed) ? parsed : null
}

export function parseTime(timeStr: string): Date | null {
  const parsed = parse(timeStr, TIME_FORMAT, new Date())
  return isValid(parsed) ? parsed : null
}

export function parseDateTime(dateTimeStr: string): Date | null {
  const full = ensureDateTime(dateTimeStr)
  const parsed = parse(full, DATE_TIME_FORMAT, new Date())
  return isValid(parsed) ? parsed : null
}

export function formatDate(date: Date): string {
  return format(date, DATE_FORMAT)
}

export function formatTime(date: Date): string {
  return format(date, TIME_FORMAT)
}

export function formatDateTime(date: Date): string {
  return format(date, DATE_TIME_FORMAT)
}

export function combineDateAndTime(dateStr: string, timeStr: string): string {
  const datePart = dateStr.trim()
  let t = timeStr.trim()
  if (/^\d{2}:\d{2}$/.test(t)) t = `${t}:00`
  return `${datePart} ${t}`
}

/**
 * Удостоверяемся, что строка содержит дату и время в формате "YYYY-MM-DD HH:mm:ss".
 * - Если есть только дата, добавляем " 00:00:00".
 * - Если есть время без секунд, добавляем ":00" к времени.
 */
export function ensureDateTime(dateTimeStr: string): string {
  const dt = dateTimeStr.trim()
  const parts = dt.split(' ')
  // Только дата
  if (parts.length === 1) {
    return `${parts[0]} 00:00:00`
  }
  // Дата и время
  const [datePart, timePart] = parts
  // Если время без секунд
  if (/^\d{2}:\d{2}$/.test(timePart)) {
    return `${datePart} ${timePart}:00`
  }
  // Уже полный формат
  return dt
}

export function nowDateTime(): string {
  return formatDateTime(new Date())
}

export function normalizeFlexible(
  input: string,
  baseDate: string = formatDate(new Date())
): string | null {
  const str = input.trim()
  // дата+время (с секундами или без)
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?$/.test(str)) {
    // гарантируем секунды
    const full = ensureDateTime(str)
    const dt = parseDateTime(full)
    return dt ? formatDateTime(dt) : null
  }
  // только дата
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return `${str} 00:00:00`
  }
  // только время
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(str)) {
    const timePart = str.length === 5 ? `${str}:00` : str
    return `${baseDate} ${timePart}`
  }
  return null
}

/**
 * Форматирует для UI: "dd.MM.yy HH:mm" или только "dd.MM.yy" если время 00:00.
 */
export function formatForDisplay(
  input: string,
  alwaysShowTime = false
): string | null {
  const norm = normalizeFlexible(input)
  if (!norm) return null
  const dt = parseDateTime(norm)
  if (!dt) return null
  const datePart = format(dt, 'dd.MM.yy')
  const timePart = format(dt, 'HH:mm')
  if (alwaysShowTime) {
    return `${datePart} ${timePart}`
  }
  return timePart === '00:00' ? datePart : `${datePart} ${timePart}`
}
