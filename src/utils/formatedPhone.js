/**
 * Форматирует номер телефона в формат +7(XXX) XXX-XX-XX
 * @param {string} phone - Входной номер (может быть в любом виде)
 * @returns {string|null} Отформатированный номер или null, если невалидный
 */
export function formatedPhone(phone) {
  if (!phone) return null;

  // Удаляем всё, кроме цифр
  const digits = phone.replace(/\D/g, '');

  // Обрезаем или дополняем до нужных 10 цифр после +7
  let cleaned = digits;

  // Удаляем первую 8 или +7
  if (cleaned.startsWith('8')) {
    cleaned = cleaned.slice(1);
  } else if (cleaned.startsWith('7')) {
    cleaned = cleaned.slice(1);
  } else if (cleaned.startsWith('007')) {
    cleaned = cleaned.slice(3);
  }

  // Должно остаться 10 цифр
  if (cleaned.length !== 10) return null;

  // Форматируем
  return `+7(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 8)}-${cleaned.slice(8)}`;
}