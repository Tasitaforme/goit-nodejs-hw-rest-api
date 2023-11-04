👉 [Скріншоти CLI](./README.md)
👉 [ДЗ](./HomeWorkTask.md)
👉 [Корисні матеріали](./INFO.md)

# Корисні матеріали по ДЗ 2

## Express

Express - це мінімалістичний та гнучкий веб-фреймворк для програм Node.js, що надає широкий набір функцій для мобільних та веб-додатків.

[**Postman**](https://www.postman) — платформа API для створення та використання API..

```bash
npm init -y
npm install express
```

```js
const express = require("express");
const app = express(); //веб-сервер

app.get("/", (request, response) => {
  console.log(request.url);
  console.log(request.method);
  //відправка розмітки у відповідь
  res.send("<h1>Contact page</h1>");
  //відправка даних з файлу contacts.json у відповідь
  res.json(contacts);
});

//запуск веб-сервера
app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
```

`'/'` шлях на сервері, у даному випадку це корінь сайту '/'.  
`request` - об'єкт, в якому зберігається вся інформація про запит, який надійшов;  
`response` - об'єкт, який дозволяє налаштувати та відправити відповідь;

> Шляхи маршрутів, крім простих рядків, можуть також містити регулярні вирази чи спеціальні символи підстановок.  
> `?` — вказує, що попередній символ може зустрічатися 1 раз або відсутній.  
> `+` — вказує, що попередній символ може зустрічатися 1 і більше разів.  
> `*` — вказує, що на місці цього символу може бути будь-яка кількість символів.

### **Middleware**

Функції проміжної обробки (**middleware**) - це функції, що мають доступ до об'єкту запиту (**req**), об'єкту відповіді (**res**) і до наступної функції проміжної обробки в циклі "запит-відповідь" програми (**next**).

```js
app.use((req, res, next) => {
  console.log("First middleware");
  next();
});
```

> Перша з основних задач middleware — логування. Наприклад записування в файл `public/server.log` інформації про запити.  
> [**moment**](https://www.npmjs.com/package/moment) — бібліотека дат JavaScript для аналізу, перевірки, обробки та форматування дат.

```bash
npm i moment
```

```js
const express = require("express");
const app = express();
const moment = require("moment");
const fs = require("node:fs/promises");

app.use(async (req, res, next) => {
  const { method, url } = req;
  const date = moment().format("DD-MM-YYYY_hh:mm:ss");
  await fs.appendFile("./public/server.log", `\n${method} ${url} ${date}`);
  next();
});
```

> Друга з основних задач middleware — обробка запитів на адреси, яких немає. Коли відправляємо запит на таку адресу, то у відповідь приходить 404 статус з HTML розміткою, а краще щоб приходила відповідь у форматі json. Тоді після всіх шляхів маршрутів можемо зловити цей запит:

```js
app.get("/products", async (req, res) => {
  res.json([]);
});

app.get("/books", async (req, res) => {
  res.json(books);
});

app.use((req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});
```

> Третя з основних задач middleware — допомога на етапі розробки, коли потрібно дади дозвіл на кросдомені запити (якщо запит приходить з іншої адреси, то сервер відмовляє (помилка CORS)).  
> [**cors**](https://www.npmjs.com/package/cors) — це пакет для надання проміжного програмного забезпечення Connect/Express, яке можна використовувати для активації CORS із різними параметрами.  
> [link:](https://www.npmjs.com/package/cors#configuring-cors) — використання cors для дозволу запитів лише з окремих адрес.

```bash
npm i cors
```

```js
const cors = require("cors");
//повний запис:
const corsMiddleware = cors();
app.use(corsMiddleware);

//або скорочений:
app.use(cors());
```

```js

```

```js

```

```js

```

## REST API

**Основні правила:**

1. Кінцева точка запиту (endpoint) — завжди іменник в множинні (/products, /users).
2. CRUD-операція визначається методом HTTP-запиту.  
   GET/products — поверне всі товари,  
   POST/products — додасть новий товар.
3. Звернення до окремої одиниці здійснюється через /:id (параметри маршруту)
   GET/products/:id — поверне товар з id, вказаним в адресному рядку,
   PUT/products/:id — оновить товар з id, вказаним в адресному рядку.

**Додаткові правила:**

1. Адресу запиту краще починати з /api (/api/products, /api/orders)
2. Версія API зазначається в адресі (/api/v1/products, /api/v2/products)
3. Код відповіді (статус) показує як пройшла обробка запиту на сервері
4. При додаванні/оновленні сутності потрібно повертати доданий в базу даних об'єкт з id.

[**Статуси**](https://hostiq.ua/wiki/ukr/http-status-codes/)  
**2xx Success — коди успішно виконаних запитів**

- HTTP 200 OK — «Успішно». Сервер успішно обробив запит.
- HTTP 201 Created — «Створено». Сервер успішно обробив запит і створив новий ресурс. (Успішний POST-запит)
- HTTP 204 No Content — «Немає вмісту». Сервер успішно обробив запит, але крім заголовків відповіді немає вмісту, який можна було б відправити у відповідь. (Успішний DELETE-запит)

**3xx Redirection — коди перенаправлень**

- HTTP 301 Moved Permanently — «Переміщено назавжди». Запитуваний ресурс тепер доступний за новою URI і на випадок повторних запитів варто використовувати саме його.
- HTTP 302 Found — «Знайдено». Раніше цей код називався 302 Moved Temporarily — «Переміщено тимчасово». Запитуваний ресурс тимчасово доступний по іншому URI і на випадок повторних запитів варто використовувати старий URI.

**4xx Client Error — коди помилок клієнта**

- HTTP 400 Bad Request — «Невірний запит». Сервер не може обробити запит, тому що не розуміє його. Наприклад, через синтаксичну помилку.
- HTTP 401 Unauthorized — «неавторизовано». Сервер не може обробити запит без аутентифікації. Потрібно додати до заголовків запиту поле Authorization або перевірити правильність даних у цьому полі, якщо воно вже присутнє.
- HTTP 402 Payment Required — «Необхідна оплата». Спочатку цей код повинен був використовуватися у платіжних системах, але наразі не використовується.
- HTTP 403 Forbidden — «Заборонено». Сервер відмовляється обробити запит, тому що у користувача немає прав на перегляд вмісту.
- HTTP 404 Not Found — «Не знайдено». Сервер не може знайти запитуваний ресурс.

**5xx Server Error — коди помилок сервера**

### Методи Route

За допомогою класу express.Router можна створювати модульні, монтовані обробники маршрутів.

Наприклад, коли прийде запит на адресу "/api/books", то contactsRouter вказує де шукати обробних для цих запитів.

```js
//app.js
const express = require("express");
const cors = require("cors");
const contactsRouter = require("./routes/api/contacts");

const app = express();

app.use(cors());

app.use("/api/books", contactsRouter);

app.listen(3000);
```

```js
//contacts.js
const express = require("express");

const books = require("../../data/books");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(books);
});

router.get("/:id", (req, res) => {
  res.json(books[0]);
});

router.post("/", (req, res) => {
  res.json(books[0]);
});

router.put("/:id", (req, res) => {
  res.json(books[0]);
});

router.delete("/:id", (req, res) => {
  res.json(books[0]);
});

module.exports = router;
```

[**morgan**](https://www.npmjs.com/package/morgan) — middleware, що виводить в консоль інформацію про запит. Допомагає дебажити код.

```bash
npm i morgan
```

```js
const logger = require("morgan");
//чи
const morgan = require("morgan");
const logger = morgan("combined");
```
