## **Основні команди роботи в графічних інтерфейсах для MongoDB:**

`use animals-app` — перехід до вказаної БД ("animals-app"). Якщо її не буде, то
вона створиться і відбудеться перехід до неї.  
`db.stats()` — отримати статистику з поточної БД.  
`db.createCollection('cats')` — створення колекції ("cats") в поточній БД
("animals-app").

**Методи додавання до колекції:**  
_insertOne_: додає один документ  
_insertMany_: додає кілька документів  
_insert_: може додавати як один, так і кілька документів

```js
db.cats.insert([
  {
    name: "Marcus",
    age: 12,
    features: ["ходить у лоток", "не дає себе гладити", "сірий"],
  },
  {
    name: "Murzik",
    age: 1,
    features: ["ходить у лоток", "дає себе гладити", "чорний"],
  },
]);
```

**Пошук у колекції:**  
`db.cats.find()` — виведення документів колекції.

> У MongoDB у запитах можна використовувати умовні конструкції за допомогою
> операторів порівняння:
>
> - $eq (дорівнює)
> - $gt (більше ніж)
> - $lt (менше ніж)
> - $gte (більше або дорівнює)
> - $lte (менше або дорівнює)

```js
db.cats.find({ age: { $lte: 3 }, features: "дає себе гладити" }, { name: 0 });
```

`age: { $lte: 3 }` - вказали, що age менше або дорівнює 3;  
`features: 'дає себе гладити'` - вказали, щоб features містив "дає себе
гладити";  
`{ name: 0 }` - другим об'єктом у функції find виключили виведення поля name,
якщо б вказали `{ name: 1, age: 1 }`, то навпаки, залишити б виведення лише двох
необхідних полів.

**Обмеження вибірки:**  
`db.cats.find().limit(3)` - показати перші три документи в колекції.

**Пропуск кількох документів у вибірці:**  
`db.cats.find().skip(3)` - пропустити три документи у вибірці.

**Сортування у вибірці:**  
Якщо в об'єкті з полями для сортування вказано значення: 1, то відбудеться
сортування за зростанням, -1 по спаданню. `db.cats.find().sort({ name: 1 })` -
сортувати за зростанням.

**Отримання кількості елементів у колекції:**  
`db.cats.count()`

Оператор $exists дозволяє витягти тільки ті документи, в яких певний ключ
присутній або відсутній:  
`db.cats.find({ owners: { $exists: true } })`  
Оператор $type витягує лише ті документи, у яких визначений ключ має значення
певного типу, наприклад, рядок чи число:  
`db.cats.find({ age: { $type: 'number' } })`  
Оператор $regex задає регулярний вираз, якому має відповідати значення поля:  
`db.cats.find({ name: { $regex: 'L' } })` - показати з name, що починається на
'L'.  
Оператор логічного множення $or, дозволяє об'єднати вибірки:  
`db.cats.find({ $or: [{ name: { $regex: 'L' } }, { age: { $lte: 3 } }] })`  
Оператор логічного множення $and, знаходить збіг вибірок:  
`db.cats.find({ $and: [{ name: { $regex: 'L' } }, { age: { $lte: 3 } }] });`

**Збереження документів у колекції:**  
`db.cats.save({ name: 'Bars', age: 3 })`.

**Оновлення документів у колекції:**  
_updateOne_: оновлює лише один документ;  
_updateMany_: оновлює всі документи, які відповідають критерію; _update_: може
оновлювати як один, так і кілька документів.

```js
db.cats.update(
  { name: "Tom" },
  {
    name: "Tom",
    age: 5,
    $set: { features: ["будить зранку"] },
    $unset: { owner: 1 },
  },
  { upsert: true, multi: true }
);
```

Функція оновлення приймає три параметри:

1. **query**: приймає запит на вибірку документа, який потрібно оновити;

2. **objNew**: представляє документ із новою інформацією, який замістить старий
   при оновленні.  
   Можна вказати наступні оператори:

- $set означає, що якщо документ не містить оновлюване поле, то воно
  створиться:  
  `{ $set: { features: ['будить зранку'] } }`
- $unset означає видалення окремого ключа:  
  `{ $unset: { age: 1 } }`

3. **options**: визначає додаткові параметри під час оновлення документів.  
   Може приймати два аргументи: upsert та multi.

- upsert:  
  `{ upsert: true }` (за замовчуванням) - оновлюватиме документ, якщо його
  знайдено, і створюватиме новий, якщо такого документа немає.  
  `{ upsert: false }` - не буде створювати новий документ, якщо запит на вибірку
  не знайде жодного документа.
- multi:  
  `{multi:true}` - оновлюватиме всі документи у вибірці `{multi:false}` (за
  замовчуванням) - оновлюватиме перший елемент у вибірці.

**Видалення документа з колекції:**  
`db.cats.remove({ name: 'Tom' })` - видалення всіх документів із зазначеним
запитом.  
 `db.cats.remove({ name: 'Tom' }, true)` - видалення лише одного докумена із зазначеним
запитом.