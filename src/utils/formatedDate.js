import dayjs from 'dayjs';

/**
 * Форматирует ISO дату в формат "DD.MM.YYYY HH:mm"
 * @param {string|Date} date - ISO строка или объект Date
 * @returns {string} отформатированная дата
 */
export function formatedDate(date) {
  return dayjs(date).format('DD.MM.YYYY HH:mm');
}