// utils/mapToSelectOptions.ts

/**
 * Универсальный метод для преобразования массива объектов
 * в массив опций формата { label, value },
 * при этом optionally логируем поле, которое используется как label.
 */
export function mapToSelectOptions<T extends Record<string, any>>(
  items: T[],
  labelKey: keyof T,
  valueKey: keyof T,
  logLabel = false
) {
  return items.map((item) => {
    if (logLabel) {
      console.log(item[labelKey]);
    }
    return {
      label: item[labelKey],
      value: item[valueKey],
    };
  });
}
