# Аутентифікація за допомогою JSON Web Token (JWT)

**Автентифікація** — процес знаходження користувача в базі та перевірки
правильності його пароля.

[JSON Web Token (JWT)](https://jwt.io/) — безпечний URL-рядок, що містить
закодований об'єкт JSON (метод RFC 7519).

Приклад:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Токен містить три частини, які розділені крапкою "." Ці три частини є
наступними:

- **header** містить інформацію, яка визначає алгоритм хешування, щоб його можна
  було використовувати для правильного розшифрування та перевірки справжності.
- **payload** містить інформацію, яку слід надіслати за допомогою JWT.
  Інформація в ньому не захищена і може бути розшифрована без секретного ключа,
  це звичайне кодування Base64.
- **signature** об'єднує закодований header та payload із секретним ключем і
  надійно кодує це з використанням алгоритму хешування, визначеного в header.

### Кодування токена

Для створення jwt-токенів використовують пакет npm з ім'ям
[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), який дозволяє
шифрувати та розшифровувати jwt-токени.

Для створення SECRET_KEY можна використати
[рандомне генерування ключів](https://randomkeygen.com/).

Для декодування можна використати
[Decode from Base64 format](https://www.base64decode.org/)

```bash
npm i jsonwebtoken
```

```js
const jwt = require("jsonwebtoken");

const SECRET_KEY = "secret word";
// зберігаємо в змінних оточення
// require("dotenv").config();
// const {SECRET_KEY} = process.env;

const payload = {
  id: "63fe4a5a68b27c947e28495b",
  username: "Larson",
};

const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

console.log(token);
```

### Декодування токена

```js
const decode = jwt.decode(token);

console.log(decode);
```

### Перевірка справжності токена (функція верифікації)

Якщо токен валідний (тобто він був шифрований цим ключем і його час дії ще не
сплив) jwt.verify повертає payload.  
Якщо токен не валідний (тобто він не був шифрований цим ключем, або його час дії
вже закінчився) jwt.verify повертає помилку, які слід ловити.

```js
try {
  const { id } = jwt.verify(token, SECRET_KEY);
  console.log(id);
  const invalidToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZmU0YTVhNjhiMjdjOTQ3ZTI4NDk1YiIsImlhdCI6MTY3NzYxMDczNSwiZXhwIjoxNjc3NjkzNTM1fQ.YELvZzq9k2ErXHMwufOFfJUtEi2jxl6W5wtG4tiKnxS";
  const result = jwt.verify(invalidToken, SECRET_KEY);
  console.log(result);
} catch (error) {
  console.log(error.message);
}
```

## Хешування

**Хешування** — процес незворотної зміни даних.  
Пакети, що використовують для хешування в Node.js: bcryptjs, bcrypt, crypto.

```bash
npm i bcrypt
```

**bcrypt** — працює швидше, але має обмеження щодо версій Node.js (працює лише з
останьою стабільною версією Node.js або зі старішими версіями);  
**bcryptjs** — працює повільніше, але запускається навіть з експериментальними
версіями Node.js.

Для асинхронного хешування використовується метод пакету bcryptjs/bcrypt:
**hash**.

Для асинхронної перевірки пароля та його хеш-варіанту використовується метод
метод пакету bcryptjs/bcrypt: **compare**.

```js
const bcrypt = require("bcrypt");

const createHashPassword = async password => {
  // const salt = await bcrypt.genSalt(10);
  // console.log(salt);
  const result = await bcrypt.hash(password, 10);
  // console.log(result);
  const compareResult1 = await bcrypt.compare(password, result);
  console.log(compareResult1);
  const compareResult2 = await bcrypt.compare("123457", result);
  console.log(compareResult2);
};

createHashPassword("123456");
```

[Bcrypt-Generator.com - Online Bcrypt Hash Generator & Checker](https://bcrypt-generator.com/)

# Авторизація

## Авторизація за допомогою JWT

**Авторизація** — процес перевірки права користувача на виконання певної дії.

```js
const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers");
const User = require("../models/user");

const { SECRET_KEY } = process.env;
const authenticate = async (req, res, next) => {
  // Якщо не буде нічого в headers authorization, то прийде undefined, тоді split поламає бекенд, тому найпростіше поставити дефолтне значення ""
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  // перевірка на наявність Bearer в headers.authorization
  if (bearer !== "Bearer") {
    next(HttpError(401, "Not authorized!"));
  }
  // перевірка на валідність токену
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(HttpError(401, "Not authorized! User not found!"));
    }

    // можна записати в req, хто робить цей запит, щоб потім використати це в controllers
    req.user = user;
    next();
  } catch {
    next(HttpError(401, "Not authorized!"));
  }
};

module.exports = authenticate;
```

[Інший варіант написання authenticate middleware](middleware-auth.md)

## Авторизація за допомогою стороніх бібліотек

### [passportjs](https://www.passportjs.org/)

Passport is Express-compatible authentication middleware for Node.js.

```bash
npm i passport
```

### [passport-jwt](https://www.npmjs.com/package/passport-jwt)

This module lets you authenticate endpoints using a JSON web token. It is
intended to be used to secure RESTful endpoints without sessions.

```bash
npm i passport-jwt
```

Стратегія JWT:

```js
const passport = require("passport");
const passportJWT = require("passport-jwt");
const User = require("../schemas/user");
require("dotenv").config();
const secret = process.env.SECRET;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

// JWT Strategy
passport.use(
  new Strategy(params, function (payload, done) {
    User.find({ _id: payload.id })
      .then(([user]) => {
        if (!user) {
          return done(new Error("User not found"));
        }
        return done(null, user);
      })
      .catch(err => done(err));
  })
);
```

## Авторизація за допомогою стороніх сервісів

[Доповідь про Auth for React.js (відео)](https://youtu.be/nb4kM9CBhbY)

### [okta](https://www.okta.com/)

Вартість користування: платно.  
Ця помпанія викупила свого конкурента, а саме — auth0 👇

### [auth0](https://auth0.com)

Вартість користування: безкоштовно до 7 000 активних користувачів.

### [Amazon Cognito](https://aws.amazon.com/cognito/)

Вартість користування: безкоштовно до 50 000 активних користувачів.  
Немає можливості робити деякі кастомні елементи.

### [Firebase Authentication](https://firebase.google.com/docs/auth)

Вартість користування: безкоштовно (без автентифікації по телефону).  
Немає можливості робити деякі кастомні елементи.

# Додаткова інформація

## Регулярні вирази (email regex js)

[https://regexr.com/](https://regexr.com/)  
[Регулярні вирази (відео від каналу SavchukIT)](https://youtu.be/Qo1FZRvhYsI)  
[Регулярні вирази на uk.javascript.info (навч.посібник)](https://uk.javascript.info/regular-expressions)

```js
const regexpEmail = = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/
```

[email regex js (article)](https://stackabuse.com/validate-email-addresses-with-regular-expressions-in-javascript/)

```js
let regex = new RegExp(
  "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
);

let testEmails = [
  "notanemail.com",
  "workingexample@stackabuse.com",
  "example@yale.edu.com",
];

testEmails.forEach(address => {
  console.log(regex.test(address));
});

// false
// true
// true
```

### HttpError

Для HttpError можна використати пакети
[http-errors](https://www.npmjs.com/package/http-errors) або
[http-errors-enhanced](https://www.npmjs.com/package/http-errors-enhanced)

### Пагінація

Щоб отримати параметри пошуку, потрібно звернутись до req.query. В ньому
містяться всі параметри пошуку. Одразу краще записати значення за
замовчуванням.  
**skip** — скільки елементів спочатку пропустити  
**limit** — скільки елементів повернути

```js
const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Book.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name email");
  res.json(result);
};
```

### Фільтрація

1-й варіант

```js
const getAll = async (req, res) => {
  const { _id: owner } = req.user;

  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  const query = Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email subscription");

  if (favorite) {
    query.where("favorite").equals(favorite);
  }
  const result = await query.exec();

  res.status(200).json(result);
};
```

2-й варіант

```js
const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;
  const query = { owner };

  if (favorite) {
    query.favorite = favorite;
  }
  const result = await Contact.find({ ...query }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email subscription");

  res.status(200).json(result);
};
```

[Використання індексів в MongoDB (документація)](https://www.mongodb.com/docs/manual/indexes/)  
[Хешування, кодування, шифрування. В чому різниця? (відео)](https://youtu.be/GQ0rDbJCKhQ)

JWT (відео від каналу JavaScript.Ninja):  
[JWT. Часть 1. Теория](https://youtu.be/vQldMjSJ6-w)  
[JWT. Часть 2. Проблемы](https://youtu.be/601CnGGp_MU)  
[JWT. Часть 3. Сервер](https://youtu.be/_BSag4ABBMY)  
[JWT. Часть 4. Клиент](https://youtu.be/XG-xOHogPkY)

Сесії (stateful) та токени (stateless):  
[Аутентификация в Веб-Приложениях: JWT и Сессии (відео)](https://youtu.be/w8ENQfaYIT8)
