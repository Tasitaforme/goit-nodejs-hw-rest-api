# MongoDB

MongoDB є нереляційною базою даних типу NoSQL.  
MongoDB належить до документоорієнтованого типу бази даних. Тобто заснована на
моделі документів — об'єкти даних зберігаються у вигляді окремих документів у
колекції.

Колекція (масив об'єктів) — це сукупність документів, які мають однакове
призначення.  
Документ – це представлення елемента інформації у базі даних. Максимальний
розмір документа обмежений 16 Мб.

У якості мови запитів використовується JavaScript та JSON-структури.

Розгорнута в хмарі база даних в термінах компанії «MongoDB» називається
«кластером» (cluster).

У MongoDB первинний ключ автоматично встановлюється у полі \_id.

```js
_id: ObjectId("5f15996fbbde793a107af359");
```

## MongoDB Atlas

Замість встановлення бази даних локально, можна використовувати хмарне сховище
[MongoDB Atlas](https://www.mongodb.com/atlas/database). Це варіант служби
MongoDB, розміщеної у хмарі, яка не вимагає додаткових витрат на встановлення та
пропонує безкоштовний рівень для початку роботи.

1. Реєстрація [MongoDB Atlas](https://account.mongodb.com/account/login)
2. Вкладка **Projects** -> New project. Ввести назву проекту -> Next -> Create
   project
3. Вкладка **Overview** -> Create a deployment -> Create  
   Заповнити інформацію для створення кластеру (безкоштовний кластер - 512 MB
   Storage):  
   (cluster - M0, Provider - AWS, Region - Frankfurt, Name - ...)  
    -> Create

4. Вкладка **Database Access** -> Add New Database User.  
    Вибрати метод автентифікації за допомогою пароля.  
    Придумати ім'я та пароль користувачеві і запам'ятайти (надалі цю інформація
   слід помістити в змінні оточення).  
    Виставити привілеї доступу як читання та запис до бази даних.  
   -> Create User

5. Вкладка **Network Access** -> Add IP address  
   Додати IP адреси у яких буде доступ до хмарної бази даних.  
   Як варіант можна дозволити доступ із будь-якої IP адреси 0.0.0.0/0. Але можна
   і вказати лише необхідні адреси.

6. Вкладка **Database** -> Browse Collections (можна: Load a Sample Dataset або
   Add My Own Data)

7. **Підключення до БД (MongoDB Compass)** Вкладка Database -> Cluster: Connect
   -> Compass  
   Скопіювати рядок для доступу до бази даних.  
   В MongoDB Compass (вставити рядок та дописати пароль користувача, сформований
   раніше)

8. **Підключення до БД (Node.js)**  
   Вкладка Database -> Cluster: Connect -> Connect your application -> Drivers  
   Скопіювати рядок для доступу до бази даних:  
   `mongodb+srv://user:<password>@cluster.vviuhr8.mongodb.net/<db>?retryWrites=true&w=majority`  
   Замінити `<password>` на пароль користувача, сформований раніше. При
   використанні Mongoose `<db>` замінити на назву БД.

В проекті:

```bash
npm install mongodb
```

**Безкоштовні MongoDB курси:**  
👉 [Free MongoDB courses](https://learn.mongodb.com/)  
👉
[MongoDB Node.js Developer Path](https://learn.mongodb.com/learning-paths/mongodb-nodejs-developer-path)

## Графічні інструменти управління MongoDB

### MongoDB Compass

[MongoDB Compass](https://www.mongodb.com/products/tools/compass) — графічний
інтерфейс для MongoDB від самої компанії.  
Підключення до бази даних здійснюється за допомогою рядка SRV. Ліворуч буде меню
з нашими базами та колекціями. При виборі колекції ми потрапляємо до панелі
управління колекції. Замість консолі Compass надає панель для пошуку та
фільтрації за нашими документами. І повну функціональність за CRUD операціям над
документами без необхідності використання мови запитів.

### Robo 3T

[Robo 3T](https://robomongo.org/) — графічний інтерфейс для MongoDB від 3T
Software. Має кросплатформну підтримку, а також вбудовує оболонку mongo у свій
інтерфейс для забезпечення взаємодії як на основі оболонки, так і на основі
графічного інтерфейсу.  
Підключення до бази даних здійснюється за допомогою рядка SRV. Дайте своєму
підключенню ім'я, заповніть поле "from SRV" (скопіюйте рядок підключення, який
нам надає MongoDB Atlas), натисніть save, а після виконайте connect до хмарної
бази даних.  
Вгорі знаходиться консоль із запитами до бази даних.  
Виконання команд виконується клавішею F5 чи комбінацією клавіш Ctrl+Enter.

### **Основні команди роботи в графічних інтерфейсах:**

👉 [Детальніше](/homework/homework-03/interface-basic-commands.md)

# Mongoose

[Mongoose](https://mongoosejs.com/docs/guide.html) — спеціальна ODM-бібліотека
(Object Data Modelling) для роботи з базою даних MongoDB.  
Модуль служить зручним засобом застосування структурних схем до документів.
Також дає можливість достовірної перевірки типів даних та можливостей
валідації.  
Mongoose працює з колекцією MongoDB за допомогою моделі.

Встановлення бібліотеки:

```bash
npm install mongoose -S
```

```js
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
```

Підключення до бази даних:

```js
mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
```

Відключення від бази даних:

```js
mongoose.disconnect();
```

[Link](https://code.tutsplus.com/uk/an-introduction-to-mongoose-for-mongodb-and-nodejs--cms-29527a):
Вступ до Mongoose для MongoDB та Node.js

## Схема документа

Дані можна описати певною
[схемою](https://mongoosejs.com/docs/guide.html#schemas) (опис змісту, структури
та обмежень об'єкта в колекції).  
Схема містить метадані об'єктів. Тут вказується, які властивості буде мати
об'єкт і який буде тип даних (String, Number, Date, Buffer, Boolean, Mixed,
Objectid, Array).

```js
const Schema = mongoose.Schema;
const dateRegexp = /^\d{2}-\d{2}-\d{4}$/; // 16-10-2009
const genderList = ["male", "female"];
// Встановлення схеми
const cats = new Schema(
  {
    nickname: {
      type: String,
      minlength: 2,
      maxlength: 7,
      required: [true, "Nickname is required"],
    },
    age: {
      type: Number,
      min: 1,
      max: 50,
    },
    gender: {
      type: String,
      enum: genderList,
      required: true,
    },
    date: {
      type: String,
      match: dateRegexp,
      required: true,
    },
    deletedAt: { type: Date, default: null },
    owner: {
      username: { type: String, required: true },
      email: { type: String, unique: true, required: true },
    },
  },
  { versionKey: false, timestamps: true }
);

// Створення моделі, використовуючи схему:
//'cat' - перший параметр - назва моделі
//cats - другий параметр - схема
const Cat = mongoose.model("cat", cats);

// Створення об'єктів для цієї моделі
const cat = new Cat({
  nickname: "Marcus",
  age: 2,
});

// Збереження об'єкта в базі даних
const result = cat.save();
console.log("Кіт збережений у базу! ", result);
```

### [Індекси](<https://mongoosejs.com/docs/api/schema.html#Schema.prototype.index()>)

Якщо поле часто використовується при пошуку документів йому можна призначити
індекс.

### Методи у об'єкта схеми

```js
const user = new Schema({
  firstName: String,
  lastName: String,
});

user.methods.fullName = function () {
  return `${this.firstName} ${this.lastName}`;
};
```

### [Validation mongoose](https://mongoosejs.com/docs/validation.html)

**joi** перевіряє тіло запиту (що нам приходить);  
**mongoose** перевіряє те, що ми зберігаємо в базі даних.

При визначенні схеми Mongoose має вбудовані правила валідації, які можна вказати
у схемі:

- **unique**: робить поле унікальним, тобто в в інших документах колекції не
  може бути такого поля з таким же значенням;
- **required**: вимагає обов'язкової наявності значення для якості
- **min** та **max**: задають мінімальне та максимальне значення для числових
  даних
- **minlength** та **maxlength**: задають мінімальну та максимальну довжину для
  рядків
- **enum**: рядок повинен представляти одне із значень у зазначеному масиві
  рядків
- **match**: рядок повинен відповідати регулярному виразу
- `{versionKey: false, timestamps: true}` — вказує схемі, що замість версії
  об'єкта в базі потрібно зберігати час створення і час останнього оновлення.

Методи mongoose викидають помилку без статусу, а якщо так то обробка помилок
відправляє її в 500 статус. Але помилка валідації це 400 статус, щоб це
виправити потрібно до схеми додати middleware

```js
contactSchema.post("save", (error, data, next) => {
  error.status = 400;
  next();
});
```

## Основні операції з даними в Mongoose

Запити Mongoose не повертають "чистий проміс", хоча в них і є `.then()` метод
для `async/await`.  
Якщо потрібно щоб повернувся "чистий проміс", то слід використовувати
[.exec()](https://mongoosejs.com/docs/queries.html#executing)

```js
const books = await Book.find().exec();
```

### **Створення документів:**

Існує два варіанти додати об'єкт в колекцію:

1. Використання методу `save()` від об'єкта
   ([The active record pattern](https://blog.savetchuk.com/overview-of-the-active-record-pattern)):

```js
// Створення екземпляра (об'єкта) для моделі
const cat = new Cat({
  nickname: "Marcus",
  age: 2,
});
// Збереження об'єкта в базі даних
const result = cat.save();
```

2. Використання методу `create()` від моделі об'єкта:

```js
Cat.create({
  nickname: "Barsik",
  age: 1,
});
```

### **Отримання даних:**

_find_ — пошук, який повертає масив об'єктів типу Document, які збігаються із
запитом;  
_findOne_ — пошук одного документа, що повертає перший об'єкт Document, який
збігається із запитом;  
_findById_ — пошук у колекції об'єкта з певним Id

```js
find([query], [options]);
// наприклад
const result = await Book.findOne({ _id: id });
// або
const result = await Book.findById(id, {
  new: true,
});
```

### **Видалення даних:**

_remove_ — видалення, під час якого з колекції видаляються всі об'єкти, що
збігаються із запитом;  
_findOneAndDelete_ — пошук та видалення, під час яких з колекції видаляється
лише перший документ, що збігається із запитом;  
_findByIdAndDelete_ — пошук та видалення у колекції об'єкта з певним Id;

```js
remove([query], [options]);
```

### **Зміна даних:**

_update_ — оновлення, під час якого в колекції оновлюються всі документи, що
збігаються із запитом;  
_findOneAndUpdate_ — пошук та оновлення, під час яких в колекції оновлюється
лише перший документ, що збігається із запитом; _findByIdAndUpdate_ — пошук та
оновлення у колекції об'єкта з певним Id.  
Повертає за замовчуванням не оновлений об'єкт із колекції (щоб змінити це —
потрібно дописати: `{ returnOriginal: false }` або `{new: true}`).

```js
update([query], [update], [options]);

const result = await Contact.findByIdAndUpdate(id, req.body, {
  new: true,
});
```

## Змінні оточення

Це локальні змінні, які доступні нашому додатку. Створення цих змінних
виконується за допомогою модуля `dotenv`. Цей модуль завантажує змінні
середовища з файлу `.env`, який створюється наприклад у кореневому каталозі
програми.  
Після підключається модуль у додатку і він додає змінні оточення в глобальний
об'єкт `process.env` (що містить змінні оточення сервера, на якому запускається
код), і вже звідти, не показуючи значення цих змінних, можемо використовувати їх
у додатку.

> ОБОВ'ЯЗКОВО файл `.env` потрібно додати до файлу `.gitignore`.  
> ДОДАТКОВО можна створити файл `.env.example` і в ньому вказати, які існують
> змінні оточення.

```bash
npm install dotenv -D
```

```js
// .env файл
DB_HOST = 123456;
NODE_ENV = development;

// .env.example файл
DB_HOST =...
NODE_ENV =...

// app.js файл
require("dotenv").config();

process.env.DB_HOST;
process.env.NODE_ENV;
```

Надалі завжди слід використовувати змінні оточення для доступу до секретних
даних, таких як секретні слова для cookie або jwt, url підключення до бази даних
та інше.

Починаючи з 20.6.0 версії Node.js модуль `dotenv`
[вже не потрібен](https://nodejs.org/en/blog/release/v20.6.0):

```bash
node --env-file=config.env index.js
# або
node --env-file .env index.js
```

```js
// .env файл
MESSAGE = HELLO!!!;

// app.js файл
console.log(process.env["MESSAGE"]);
```

Можна використовувати
[command line option](https://www.npmjs.com/package/dotenv#preload) для
підключення dotenv:

```js
$ node -r dotenv/config your_script.js
```

## Render

[Render.com](https://render.com/)  
Краще реєструватись одразу через github.  
deploy відбувається з github  
New+ -> Web Service -> Build and deploy from Git repository -> Next  
Вибираємо репозиторій -> Connect  
Вводимо дані:  
**Name**: hw-rest-api-contacts  
**Region**: Frankfurt(EU Central) - вибираємо найближчий регіон  
**Branch**: main (або інша гілка)  
**Root Directory**: якщо не в корені проекту  
**Runtime**: Node Build  
**Command**: yarn -> npm i  
**Start Command**: yarn start -> npm start

**Advanced** -> Add Environment Variable (key, value)  
-> Create Web Service

Попередньо слід прописати в файлі `package.json` версію Node:

```js
"engines": {
    "node": "^18.*",
    "npm": "^9.*"
  },
```

[Або слідувати цією інструкцією](https://render.com/docs/node-version)
