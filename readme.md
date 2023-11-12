👉 [Links](./homework/Links.md)

# REST API

П'ять завдань логічно пов'язані між собою і представляють собою написання REST
API.

### Вимоги до виконання домашніх завдань:

1. Для виконання домашнього завдання, слід використовувати наступний
   [бойлерплейт](https://github.com/goitacademy/nodejs-homework-template).
2. Для кожної домашньої роботи створена своя гілка:

- hw02-express 👉 [ДЗ-2](./homework/homework-02/README.ua.md)
  👉[Нотатки](./homework/homework-02/README.info.md)
- hw03-mongodb 👉 [ДЗ-3](./homework/homework-03/README.ua.md)
  👉[Нотатки](./homework/homework-03/README.info.md)
- hw04-auth 👉 [ДЗ-4](./homework/homework-04/README.ua.md)
- hw05-avatars 👉 [ДЗ-5](./homework/homework-05/README.ua.md)
- hw06-email 👉 [ДЗ-6](./homework/homework-06/README.ua.md)

3. Кожна нова гілка повинна робитися з master
4. JS-код чистий та зрозумілий, для форматування використовується Prettier
5. Перед пушем виконана перевірка якості коду командою npm run lint
6. Код відповідає технічному завданню проекта
7. При виконанні коду не виникає необроблених помилок
8. Назва змінних, властивостей і методів починається з малої літери і
   записуються в нотації CamelCase. Використовуються англійські іменники
9. Назва функції або методу містить дієслово
10. Проект коректно працює з актуальною LTS-версією Node

### Команди:

- `npm start` &mdash; старт сервера в режимі production
- `npm run start:dev` &mdash; старт сервера в режимі розробки (development)
- `npm run lint` &mdash; запустити виконання перевірки коду з eslint, необхідно
  виконувати перед кожним PR та виправляти всі помилки лінтера
- `npm lint:fix` &mdash; та ж перевірка лінтера, але з автоматичними
  виправленнями простих помилок

## REST API

### @ GET /api/contacts

- нічого не отримує
- повертає масив всіх контактів в json-форматі зі статусом `200`

### @ GET /api/contacts/:id

- Не отримує `body`
- Отримує параметр `id`
- якщо такий `id` є, повертає об'єкт контакту в json-форматі зі статусом `200`
- якщо такого `id` немає, повертає json з ключем `"message": "Not found"` і
  статусом `404`

### @ POST /api/contacts

- Отримує `body` в форматі `{name, email, phone, favorite}` (name, email,
  phone - обов'язкові поля)
- Якщо в `body` немає якихось обов'язкових полів, повертає json з ключем
  `{"message": "missing required name field"}` і статусом `400`
- Якщо в `body` не вказано поле `favorite`, то при збереженні в базу нового
  контакту, зроби поле `favorite` рівним за замовчуванням `false`
- Якщо з `body` все добре, додає унікальний ідентифікатор в об'єкт контакту
- Повертає об'єкт з доданим `id` `{id, name, email, phone, favorite}` і статусом
  `201`

### @ DELETE /api/contacts/:id

- Не отримує `body`
- Отримує параметр `id`
- якщо такий `id` є, повертає json формату `{"message": "contact deleted"}` і
  статусом `200`
- якщо такого `id` немає, повертає json з ключем `"message": "Not found"` і
  статусом `404`

### @ PUT /api/contacts/:id

- Отримує параметр `id`
- Отримує `body` в json-форматі з оновленням будь-яких полів
  `name, email и phone`
- Якщо `body` немає, повертає json з ключем `{"message": "missing fields"}` і
  статусом `400`
- Повертає оновлений об'єкт контакту і статусом `200`. В іншому випадку,
  повертає json з ключем `"message": "Not found"` і статусом `404`

### @ PATCH /api/contacts/:id/favorite

- Отримує параметр `contactId`
- Отримує `body` в json-форматі з оновленням поля `favorite`
- Якщо `body` немає, повертає json з
  ключем`{ "message": "missing field favorite"}`і статусом` 400`
- Повертає оновлений об'єкт контакту і статусом `200`. В іншому випадку,
  повертає json з ключем `" message ":" Not found "` і статусом `404`

[Рендер DB з hw](https://hw-rest-api-contacts.onrender.com/api/contacts)
