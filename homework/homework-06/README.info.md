# Сервіси для розсилань та надсилань листів

Варіанти відправки пошти:

- використати сервіс-посередник
- підключитись до поштового сервера і через нього відправляти

[Сервіси з імейл маркетингу (огляд)](https://www.websiteplanet.com/uk/email-marketing-services/)

[Brevo (колишній Sendinblue)](https://www.brevo.com/) Sendinblue досить простий
та легкий у використанні, а його щедрий безкоштовний план дає вам необмежену
кількість контактів і дозволяє надсилати до 300 електронних листів на день.
Доступні інструменти автоматизації, а також легко генерувати готові шаблони у
власному корпоративному стилі.

[Amazon Simple Email Service](https://aws.amazon.com/ru/ses/)
[Mailgun](https://www.mailgun.com/)  
[ElasticEmail](https://elasticemail.com/)  
[SendGrid](https://sendgrid.com/en-us) від компанії Twilio

## Використання сервіс-посередника [SendGrid](https://sendgrid.com/en-us)

--> реєстрація  
--> Settings --> Sender Authentication --> Single Sender Verification --> Verify
a Single Sender (верифікувати e-mail)  
--> Settings --> API Keys --> Create API Key --> ввести API Key Name, вибрати
Full Access --> Create&View (зберегти, бо більше його не побачите 😂)

> Обмеження з надсилання листів для безкоштовного плану у SendGrid — 100 листів
> на день.

[Mail Service for the SendGrid v3 Web API](https://github.com/sendgrid/sendgrid-nodejs/tree/main/packages/mail)  
[Email API Quickstart for Node.js (documentation)](https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs)

```shell
npm install @sendgrid/mail
```

[Your Temporary Email Address](https://temp-mail.org/)  
[Шаблонізатор EJS — Embedded JavaScript templating](https://ejs.co/)

## Використання поштового сервера Nodemailer

[Nodemailer](https://nodemailer.com/) – це єдиний модуль з нульовими
залежностями для Node.js, призначений для надсилання електронних листів.

```shell
npm install nodemailer
```

Nodemailer пропонує готові вбудовані шляхи відправлення повідомлень:

- sendmail – звичайна команда sendmail для простих повідомлень.
- SES , щоб обробляти великий трафік електронних листів, відправляючи їх за
  допомогою Amazon SES.
- stream – буфер для тестування, для повернення повідомлень.

Але так само можна створити свій власний спосіб транспортування – це називається
зовнішній транспорт.

### Налаштування поштової скриньки

[Meta.ua](https://meta.ua/uk/) --> Налаштування --> Налаштування POP3/SMTP
сервера --> Дозволити доступ за протоколом POP3/SMTP --> Зберегти

У разі надсиланні листів через SMTP-сервер meta.ua накладаються наступні
обмеження:

- Лист повинен бути не більше 30Мб. При передачі листів за стандартом вкладені
  файли кодуються в base64, при цьому розмір вкладеного файлу збільшується в
  середньому в 1,5 рази.
- Не можна надсилати лист більше ніж 10 одержувачам (включно з копіями та
  прихованими копіями листів)
- З метою боротьби зі Спам-розповсюдженням не допускається надсилати більше 200
  листів на день.

Налаштування поштових програм (POP3-клієнтів) для роботи з Вашою скринькою на
meta.ua:  
Сервер вхідної пошти (POP3) pop.meta.ua порт 995,  
Сервер вихідної пошти (SMTP) smtp.meta.ua порт 465,  
Аутентифікація SMTP Обов'язково (як для POP3),  
Захищене з'єднання TLS / SSL

### Відправлення листа

Щоб надіслати текст у форматі HTML, жодних додаткових атрибутів не потрібно,
просто вставте текст HTML у повідомлення з атрибутом html, замість атрибута
text.

> Можна використати поштовий сервер по типу такого email-сервісу:  
> [Mailtrap — Email Delivery Platform](https://mailtrap.io/)

# Docker

Docker – це платформа, яка дозволяє «створювати, постачати та запускати
будь-який застосунок всюди».

Дає можливість творювати програмне забезпечення на локальній системі, точно
знаючи, що воно буде працювати однаково в будь-якому операційному середовищі.
Контейнери (containers) представляють засоби інкапсуляції застосунку разом із
його залежностями.

Платформа Docker складається з двох окремих компонентів:

- **Docker Engine** – механізму, що відповідає за створення та функціонування
  контейнерів;
- **Docker Hub** – хмарного сервісу для розповсюдження контейнерів (такий собі
  аналог GitHub).

Докер поставляється у вигляді Community Edition (CE) та Enterprise Edition (EE).

--> [Завантаження](https://www.docker.com/products/docker-desktop/) -->
Перевірка: `docker version`

[Офіційна онлайн-документація Docker](https://docs.docker.com/)

[ПовниЙ перелік команд](https://docs.docker.com/engine/reference/commandline/docker/)
[Підручник. Початок роботи з Docker](https://learn.microsoft.com/ru-ru/visualstudio/docker/tutorials/docker-tutorial)

[9 Tips for Containerizing Your Node.js Application(Docker)](https://www.docker.com/blog/9-tips-for-containerizing-your-node-js-application/)

# WebSockets

WebSocket – окремий протокол, який встановлює постійний зв'язок з бекендом і цей
зв'язок двосторонній (і фронтенд може відправити повідомлення бекенду, і бекенд
фронтенду).  
WebSocket – це протокол двонаправленого обміну даними, який характеризує
повністю дуплексний характер взаємодії. WebSockets встановлює одне, причому
єдине, з'єднання клієнта з сервером.
[Перевірити чи підтримує браузер WebSocket](http://websocket.org/echo.html)

```shell
npm install ws
```

## Socket.io

[Socket.io](https://socket.io/) складається з двох частин:

- Сервер, який інтегрується (або монтується) з HTTP-сервером Node.JS socket.io
- Клієнтська бібліотека, що завантажується на стороні браузера socket.io-client

```shell
npm install socket.io
```

Ідея побудови sосkеt.iо-застосунків полягає у тому, що її частини — серверна і
клієнтська, мають однакові властивості та методи, однак список обробників подій
у них різний.

У сервера визначених подій лише три:

- connection — подія настає при встановленні з'єднання з клієнтом;
- message — подія настає при отриманні повідомлення від клієнта;
- disconnect (дисконект) — розрив з'єднання.

У браузерної частини socket.io подій більше:

- connecting — подія настає в процесі встановлення з'єднання з сервером;
- connect_failed — подія настає при невдалій спробі з'єднання;
- connect — подія настає при встановленні з'єднання з сервером;
- message — подія настає при отриманні повідомлення від сервера;
- disconnect — подія настає при розриві з'єднання з сервером;
- reconnecting (може виникати неодноразово) — подія настає при спробі
  відновлення з'єднання;
- reconnect — подія настає при відновленні з'єднання;
- error — події помилки;
- anything — будь-яка подія.

# Створення чату

# Додаткова інформація

### Багатомовність

Фронтенд має присилати інформацію про мову:

- в параметрах запиту
- через форму

```html
<form action="">
  <input type="hidden" name="lang" value="ua" />
</form>
```

[i18next](https://www.i18next.com/)  
The i18next-community created integrations for frontend-frameworks such as
React, Angular, Vue.js and many more. But this is not where it ends. You can
also use i18next with Node.js, Deno, PHP, iOS, Android and other platforms.

### Генератори унікальних ідентифікаторів

[nanoid](https://www.npmjs.com/package/nanoid)  
[uuid](https://www.npmjs.com/package/uuid)  
[crypto.randomUUID()](https://nodejs.org/api/crypto.html#cryptorandomuuidoptions)
