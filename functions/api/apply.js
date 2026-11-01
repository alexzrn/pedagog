/**
 * Приём заявок: ЗАГЛУШКА.
 *
 * Эндпоинт отвечает успехом и НИЧЕГО НЕ СОХРАНЯЕТ и НИКУДА НЕ ОТПРАВЛЯЕТ:
 * ни письма, ни записи в CRM, ни вызова FamilyOS API. Заявка живёт только
 * в ответе на запрос и теряется. Это сделано намеренно, чтобы форма на сайте
 * была рабочей и проверяемой до подключения реального приёмника.
 *
 * TODO: заменить тело onRequestPost на реальную отправку (почтовый сервис или
 * FamilyOS API https://familyos.beliberde.net/api/v1) и убрать этот комментарий.
 *
 * Cloudflare Pages Functions: файл в /functions автоматически становится
 * маршрутом /api/apply, сборка Astro остаётся статической.
 */

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export async function onRequestPost({ request }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Ожидается JSON." }, 400);
  }

  const name = String(data?.name ?? "").trim();
  const email = String(data?.email ?? "").trim();
  const contact = String(data?.contact ?? "").trim();
  const program = String(data?.program ?? "").trim();

  if (name.length < 2) return json({ ok: false, error: "Не указано имя." }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: "Не указана почта." }, 400);
  }
  if (contact.length < 5) return json({ ok: false, error: "Не указан контакт." }, 400);
  if (!program) return json({ ok: false, error: "Не выбрана программа." }, 400);
  if (data?.consent !== true) {
    return json({ ok: false, error: "Нет согласия на обработку данных." }, 400);
  }

  // Ничего не пишем: заглушка. Ответ нужен только для проверки формы.
  return json({
    ok: true,
    stub: true,
    message: "Заявка принята заглушкой. Данные не сохранены и не отправлены.",
  });
}

export async function onRequestGet() {
  return json({ ok: false, error: "Метод не поддерживается. Используйте POST." }, 405);
}
