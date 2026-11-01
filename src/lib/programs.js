import data from "../data/programs.json";

/** Все программы из src/data/programs.json. Новую программу достаточно добавить в JSON. */
export const programs = data.programs;

export const updated = data.updated;

/** Направления для фильтра каталога, без повторов. */
export const directions = [...new Set(programs.map((p) => p.direction))];

export const findProgram = (slug) => programs.find((p) => p.slug === slug);

const nf = new Intl.NumberFormat("ru-RU");

/** 29900 -> "29 900 ₽" */
export const price = (value) => (value ? `${nf.format(value)} ₽` : "уточняется");

export const hours = (modules) =>
  modules.reduce(
    (acc, m) => ({ theory: acc.theory + m.theory, practice: acc.practice + m.practice }),
    { theory: 0, practice: 0 },
  );

/** Строка карточки: 144 ч, формат, ближайший поток. */
export const cardMeta = (p) => [
  `${p.hours} ак. ч`,
  p.modulesCount ? `${p.modulesCount} модулей` : null,
  p.format && p.format !== "уточняется" ? p.format : "формат уточняется",
  p.nextCohort && p.nextCohort !== "уточняется" ? `поток: ${p.nextCohort}` : "поток уточняется",
].filter(Boolean);
