# Корисні матеріали по ДЗ-2

## Express

[**Express**](https://expressjs.com/) — це мінімалістичний та гнучкий
веб-фреймворк для програм Node.js, що надає широкий набір функцій для мобільних
та веб-додатків.

[**Postman**](https://www.postman) — платформа API для створення та використання
API.

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
  // якщо нічого немає, що повернути користувачеві
  // і нам просто потрібно завершити запит
  res.end();
});

//запуск веб-сервера
app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
```

`'/'` шлях на сервері, у даному випадку це корінь сайту '/'.  
`request` - об'єкт, в якому зберігається вся інформація про запит, який
надійшов;  
`response` - об'єкт, який дозволяє налаштувати та відправити відповідь;

> Шляхи маршрутів, крім простих рядків, можуть також містити регулярні вирази чи
> спеціальні символи підстановок.  
> `?` — вказує, що попередній символ може зустрічатися 1 раз або відсутній.  
> `+` — вказує, що попередній символ може зустрічатися 1 і більше разів.  
> `*` — вказує, що на місці цього символу може бути будь-яка кількість символів.

## Методи Route

За допомогою класу express.Router можна створювати модульні, монтовані обробники
маршрутів.

Наприклад, коли прийде запит на адресу "/api/books", то contactsRouter вказує де
шукати обробних для цих запитів.

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

### Логування

[**morgan**](https://www.npmjs.com/package/morgan) — middleware, що виводить в
консоль інформацію про запит. Допомагає дебажити код.

```bash
npm i morgan
```

```js
const logger = require("morgan");

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
```

Є п'ять наперед визначених форматів, які використовують, щоб легко отримати
необхідну інформацію:

- combined - режим combined серверу Apache для формату журналів.
- common - режим common серверу Apache для формату журналів
- dev - формат журналу з колірним кодуванням (за статусом запиту). Маркер
  `:status` буде пофарбований у зелений колір для кодів успіху, у червоний для
  кодів помилок сервера, у жовтий для кодів помилок клієнта, у бірюзовий для
  кодів перенаправлення та незабарвлений для інформаційних кодів.
- short коротше, ніж формат за замовчуванням, включаючи час відповіді.
- tiny - найкоротший формат виводу.

### Виловлювання помилок

Щоб не дублювати виловлювання помилки, можемо самостійно згенерувати помилку в
try, а відповідь з помилкою відправиться в catch. А краще винести в окрему
функцію (Наприклад HttpError)!

> status(204) 'No Content' - нічого не повертає, тому немає сенсу, щось писати.

```js
router.get("/:contactId", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.getContactById(id);
    if (!result) {
      // return res.status(404).json({ message: "Not Found" });
      // замінимо на:
      const error = new Error("Not Found");
      error.status = 404;
      throw error;
    }
    res.json(result);
  } catch (error) {
    // res.status(500).json({ message: 'Server Error' });
    // замінимо на:
    const { status = 500, message = "Server Error" } = error;
    res.status(status).json({ message });
  }
});
```

### **Методи відповіді(res)**

Якщо жоден із цих методів не буде викликано з обробника маршруту, клієнтський
запит зависне.

| Метод              |                     Опис                     |
| ------------------ | :------------------------------------------: |
| **res.download()** |       Запрошення на завантаження файлу       |
| **res.end()**      |         Завершення процесу відповіді         |
| **res.json()**     |          Надсилання відповіді JSON           |
| **res.jsonp()**    | Надсилання відповіді JSON з підтримкою JSONP |
| **res.redirect()** |          Перенаправлення відповіді           |
| **res.render()**   |       Виведення шаблону представлення        |
| **res.send()**     |      Надсилання відповіді різних типів       |
| **res.sendFile()** | Надсилання файлу у вигляді потоку відповідей |

### **Ланцюжки методів**

Метод `app.route()` дозволяє створювати обробники маршрутів, що утворюють
ланцюжки для конкретного шляху маршруту.

```js
app
  .route("/blog")
  .get((req, res) => {
    res.send("Get a list of blog");
  })
  .post((req, res) => {
    res.send("Add a record to blog");
  })
  .put((req, res) => {
    res.send("Update blog");
  });
```

### **Middleware**

Функції проміжної обробки (**middleware**) - це функції, що мають доступ до
об'єкту запиту (**req**), об'єкту відповіді (**res**) і до наступної функції
проміжної обробки в циклі "запит-відповідь" програми (**next**).

```js
app.use((req, res, next) => {
  console.log("First middleware");
  next();
});
```

> Перша з основних задач middleware — логування. Наприклад записування в файл
> `public/server.log` інформації про запити.  
> [**moment**](https://www.npmjs.com/package/moment) — бібліотека дат JavaScript
> для аналізу, перевірки, обробки та форматування дат.

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

> Друга з основних задач middleware — обробка запитів на адреси, яких немає.
> Коли відправляємо запит на таку адресу, то у відповідь приходить 404 статус з
> HTML розміткою, а краще щоб приходила відповідь у форматі json. Тоді після
> всіх шляхів маршрутів можемо зловити цей запит:

```js
app.get("/products", async (req, res) => {
  res.json([]);
});

app.get("/books", async (req, res) => {
  res.json(books);
});

// next() приведе до цього middleware
app.use((req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

// next(err) приведе до цього middleware
app.use((err, req, res, next) => {
  // res.status(500).json({ message: "Server Error" });
  const { status = 500, message = "Server Error" } = err;
  res.status(status).json({ message });
});
```

> Третя з основних задач middleware — допомога на етапі розробки, коли потрібно
> дади дозвіл на кросдомені запити (якщо запит приходить з іншої адреси, то
> сервер відмовляє — помилка CORS).  
> **Cross-Origin Resource Sharing** (CORS, перехресний обмін ресурсами) - це
> механізм, який за допомогою HTTP-заголовків дає браузеру дозвіл завантажувати
> ресурси з певного джерела на запит web-додатка, отриманого з відмінного
> джерела.  
> [**cors**](https://www.npmjs.com/package/cors) — це пакет для надання
> проміжного програмного забезпечення Connect/Express, який можна
> використовувати для активації CORS із різними параметрами.  
> [link:](https://www.npmjs.com/package/cors#configuring-cors) використання cors
> для дозволу запитів лише з окремих адрес.  
> [link:](https://www.edu.goit.global/uk/learn/9057511/2439558/2439564/lessons)
> Run Chrome browser without CORS

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

### Передача JSON

При створенні веб-застосунків на Node.js, часто доводиться працювати з даними в
JSON форматі. Глобально парсер JSON у додатку підключається наступним чином.

```js
app.use(express.json());
```

Щоб зайвий раз не парсити `body` можемо викликати функцію там, де це лиш
необхідно.

```js
const jsonParser = express.json();

app.post("/books", jsonParser, (req, res) => {
  const { title, author, year } = req.body;

  console.log({ title, author, year });

  res.send("Book created");
});
```

### Генератор додатків від Express

Фреймворк Express представляє свій
[генератор додатків](https://expressjs.com/en/starter/generator.html).

```bash
npx express-generator --view=ejs simple-express
```

- `npx` - утиліта, яка вже є у системі якщо встановлено Node.js версії вище 8.x,
  вона дозволяє виконувати команди інших утиліт не встановлюючи їх глобально у
  системі.
- `--view=ejs` - параметр, яким ми вказуємо, що хочемо використати шаблон ejs.
- `simple-express` - параметр, яким ми вказуємо ім'я програми.

> Перше, що слід зробити це змінити var на const у всьому додатку.

## REST API

REST (REpresentational State Transfer) — підхід до архітектури мережевих
протоколів, які надають доступ до інформаційних ресурсів.  
Дані повинні передаватися у вигляді невеликої кількості стандартних форматів
(наприклад, HTML, XML, JSON).  
Будь-який REST протокол (HTTP в тому числі) повинен підтримувати кешування, не
повинен залежати від мережевого прошарку, не повинен зберігати інформації про
стан між парами «запит-відповідь». Стверджується, що такий підхід забезпечує
масштабовність системи і дозволяє їй еволюціонувати з новими вимогами.  
REST — це архітектурний стиль для розподілених гіпертекстових систем.

**Основні правила:**

1. Кінцева точка запиту (endpoint) — завжди іменник в множинні (/products,
   /users).
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
4. При додаванні/оновленні сутності потрібно повертати доданий в базу даних
   об'єкт з id.

**Основні методи HTTP:**

- **GET** запитує уявлення ресурсу. Запити з використанням цього методу можуть
  лише витягувати дані.

- **POST** використовується для надсилання сутностей до певного ресурсу.
  Викликає зміну стану та побічні ефекти на сервері, оскільки найчастіше створює
  новий ресурс за надісланим уявленням

- **PUT** замінює ресурс поточним поданням запиту

- **DELETE** видаляє вказаний ресурс.

- **PATCH** використовується для часткової зміни ресурсу

### **Основні статуси — коди відповіді HTTP**

**2xx Success — коди успішно виконаних HTTP запитів**

- HTTP 200 OK — «Успішно». Сервер успішно обробив запит.
- HTTP 201 Created — «Створено». Сервер успішно обробив запит і створив новий
  ресурс. (Успішний POST-запит)
- HTTP 204 No Content — «Немає вмісту». Сервер успішно обробив запит, але крім
  заголовків відповіді немає вмісту, який можна було б відправити у відповідь.
  (Успішний DELETE-запит)

**3xx Redirection — коди перенаправлень**

- HTTP 301 Moved Permanently — «Переміщено назавжди». Запитуваний ресурс тепер
  доступний за новою URI і на випадок повторних запитів варто використовувати
  саме його.
- HTTP 302 Found — «Знайдено». Раніше цей код називався 302 Moved Temporarily —
  «Переміщено тимчасово». Запитуваний ресурс тимчасово доступний по іншому URI і
  на випадок повторних запитів варто використовувати старий URI.

**4xx Client Error — коди помилок клієнта**

- HTTP 400 Bad Request — «Невірний запит». Сервер не може обробити запит, тому
  що не розуміє його. Наприклад, через синтаксичну помилку.
- HTTP 401 Unauthorized — «неавторизовано». Сервер не може обробити запит без
  аутентифікації. Потрібно додати до заголовків запиту поле Authorization або
  перевірити правильність даних у цьому полі, якщо воно вже присутнє.
- HTTP 402 Payment Required — «Необхідна оплата». Спочатку цей код повинен був
  використовуватися у платіжних системах, але наразі не використовується.
- HTTP 403 Forbidden — «Заборонено». Сервер відмовляється обробити запит, тому
  що у користувача немає прав на перегляд вмісту.
- HTTP 404 Not Found — «Не знайдено». Сервер не може знайти запитуваний ресурс.

**5xx Server Error — коди помилок сервера**

[Link](https://hostiq.ua/wiki/ukr/http-status-codes/): Статуси  
[Link](https://datatracker.ietf.org/doc/html/rfc2616#section-10): Стандарт RFC
2616

## Валідація даних

[**joi**](https://joi.dev/api) бібліотека для перевірки перевірки даних для
JavaScript (в нашому випадку для тіла запиту).

```bash
npm i joi
```

[Link](https://onestepcode.com/joi-js-custom-error-messages/): Як можна виводити
кастомний error.message в залежності від типу помилки при валідації за допомогою
joi.  
[Link](https://medium.com/@itskumarkrishna/custom-error-message-using-joi-b9a713b23b8f):
Custom Error Message Using Joi.  
[Link](https://github.com/hapijs/joi/blob/master/lib/types/string.js#L688):
Приклади того, як робити контекстно-залежне шаблонування/форматування
повідомлень.  
[Link](https://www.tabnine.com/code/javascript/functions/joi/StringSchema/email):
Приклади схем

```js
const Joi = require("joi");
const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

router.post("/", async (req, res, next) => {
  try {
    //так відбувається перехоплення першої помилки від валідації
    const { error } = addSchema.validate(req.body);
    //так відбувається перехоплення всіх помилок від валідації
    //const { error } = addSchema.validate(req.body, { abortEarly: false });

    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});
```

```js
messages: {
    'string.alphanum': '{{#label}} must only contain alpha-numeric characters',
    'string.base': '{{#label}} must be a string',
    'string.base64': '{{#label}} must be a valid base64 string',
    'string.creditCard': '{{#label}} must be a credit card',
    'string.dataUri': '{{#label}} must be a valid dataUri string',
    'string.domain': '{{#label}} must contain a valid domain name',
    'string.email': '{{#label}} must be a valid email',
    'string.empty': '{{#label}} is not allowed to be empty',
    'string.guid': '{{#label}} must be a valid GUID',
    'string.hex': '{{#label}} must only contain hexadecimal characters',
    'string.hexAlign': '{{#label}} hex decoded representation must be byte aligned',
    'string.hostname': '{{#label}} must be a valid hostname',
    'string.ip': '{{#label}} must be a valid ip address with a {{#cidr}} CIDR',
    'string.ipVersion': '{{#label}} must be a valid ip address of one of the following versions {{#version}} with a {{#cidr}} CIDR',
    'string.isoDate': '{{#label}} must be in iso format',
    'string.isoDuration': '{{#label}} must be a valid ISO 8601 duration',
    'string.length': '{{#label}} length must be {{#limit}} characters long',
    'string.lowercase': '{{#label}} must only contain lowercase characters',
    'string.max': '{{#label}} length must be less than or equal to {{#limit}} characters long',
    'string.min': '{{#label}} length must be at least {{#limit}} characters long',
    'string.normalize': '{{#label}} must be unicode normalized in the {{#form}} form',
    'string.token': '{{#label}} must only contain alpha-numeric and underscore characters',
    'string.pattern.base': '{{#label}} with value {:[.]} fails to match the required pattern: {{#regex}}',
    'string.pattern.name': '{{#label}} with value {:[.]} fails to match the {{#name}} pattern',
    'string.pattern.invert.base': '{{#label}} with value {:[.]} matches the inverted pattern: {{#regex}}',
    'string.pattern.invert.name': '{{#label}} with value {:[.]} matches the inverted {{#name}} pattern',
    'string.trim': '{{#label}} must not have leading or trailing whitespace',
    'string.uri': '{{#label}} must be a valid uri',
    'string.uriCustomScheme': '{{#label}} must be a valid uri with a scheme matching the {{#scheme}} pattern',
    'string.uriRelativeOnly': '{{#label}} must be a valid relative uri',
    'string.uppercase': '{{#label}} must only contain uppercase characters'
    }
```

[npm express-validator](https://www.npmjs.com/package/express-validator)  
[npm validator](https://www.npmjs.com/package/validator)

### Перевірка регулярних виразів

[regex101](https://regex101.com/)  
[regexr](https://regexr.com/)

### Автоматичний перезапуск при змінах — [**nodemon**](https://www.npmjs.com/package/nodemon)

Це інструмент, який допомагає розробляти програми на основі Node.js шляхом
автоматичного перезапуску програми node, коли виявляються зміни файлів у
каталозі.

```bash
npm install nodemon --save-dev
```

Починаючи з 18.11.0 версії Node.js модуль `nodemon`
[вже не потрібен](https://nodejs.org/en/blog/release/v18.11.0):

```bash
node --watch index.js
```
