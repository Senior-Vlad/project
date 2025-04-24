# Weather Alert Subscription Service

This project was created as part of the Warsaw Internship task (Task.pdf) to build a service that sends users email alerts about weather conditions.

---

## Task Objectives (according to Task.pdf)

1. Implement a REST API using **Node.js** + **Express** to:
   - Create subscriptions via the `/subscriptions` endpoint or the form in `index.html`.
   - Retrieve current weather data via the `/weather?city=<city>` endpoint.
2. Store subscription data in **MongoDB** using **Mongoose**.
3. Integrate the external **WeatherAPI** to fetch up-to-date weather.
4. Set up a per-minute job using **node-cron**.
5. Send email alerts via **SendGrid** when:
   - Temperature is above or below a specified threshold (`temperatureAbove` / `temperatureBelow`).
   - Rain is detected (`rain`).
   - At least 24 hours have passed since the last alert for the same subscription.
6. Validate incoming data using **express-validator** and handle errors gracefully.

---

## Core Functional Blocks & Implementation

1. **Subscription API** (`src/routes/subscriptionRoutes.js` + `src/controllers/subscriptionController.js`):
   - `POST /subscriptions` — creates a new subscription.
   - Validates `email`, `city`, `condition.type`, and `condition.value`.
2. **Weather API** (`src/routes/weatherRoutes.js` + `src/controllers/weatherController.js`):
   - `GET /weather?city=` — returns JSON with `temperature`, `humidity`, and `description`.
3. **Subscription Schema** (`src/models/Subscription.js`):
   - Fields: `email`, `city`, `condition { type, value }`, `lastNotified`.
   - Unique index on `{ email, city }`.
4. **Email Service** (`src/services/emailService.js`):
   - Uses `@sendgrid/mail` to send messages.
   - Formats and dispatches the message object.
5. **Alert Logic** (`src/services/weatherAlertService.js`):
   - Fetches weather via `axios`.
   - Determines `shouldNotify` based on condition type and value.
   - Checks `lastNotified` to enforce the 24-hour limit.
   - Updates `lastNotified` in MongoDB.
6. **Cron Scheduler** (`server.js`):
   - `cron.schedule('* * * * *', checkWeatherAndNotify)` — runs every minute.

---

## Project Structure

```
project/
├─ node_modules/
├─ public/
│  └─ index.html
├─ src/
│  ├─ config/
│  │  └─ db.js
│  ├─ controllers/
│  │  ├─ subscriptionController.js
│  │  └─ weatherController.js
│  ├─ models/
│  │  └─ Subscription.js
│  ├─ routes/
│  │  ├─ subscriptionRoutes.js
│  │  └─ weatherRoutes.js
│  ├─ services/
│  │  ├─ emailService.js
│  │  └─ weatherAlertService.js
│  └─ utils/
│     └─ validators.js
├─ tests/
│  └─ subscription_test.js
├─ .env
├─ .gitignore
├─ docker-compose.yml
├─ Dockerfile
├─ package.json
├─ package-lock.json
├─ sendgrid.env
├─ README.md
└─ server.js
```

---

## Setup & Run

1. Create a `.env` file in the project root:
   ```dotenv
   MONGO_URI=<your_mongo_uri>
   WEATHER_API_KEY=<your_weatherapi_key>
   SENDGRID_API_KEY=<your_sendgrid_key>
   EMAIL_SENDER=<verified_sender_email>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start   # or npm run dev
   ```
4. Open `http://localhost:3000` in your browser and subscribe.

---

## Challenges & Solutions

- Started with almost zero familiarity with Node.js, Express.js, and MongoDB under a tight deadline, but stayed motivated to complete the task.
- **SendGrid emails** initially failed due to an incorrect `msg` format and API key configuration — fixed according to official documentation.
- Switched from the native MongoDB driver to **Mongoose** for clearer schema definitions and simpler model interactions.
- Refined **cron jobs** (`node-cron`) and **WeatherAPI** `axios` requests, especially error handling for external API failures.
- Corrected per-minute alert limit logic (`lastNotified`) by comparing timestamps in milliseconds.
- Adjusted the form in `public/index.html` to use the correct `/subscriptions` endpoint, ensuring successful subscription creation.

---

## Reflection

This project was my first in-depth practical experience where I:
- Mastered **JavaScript** and **Node.js** fundamentals: asynchronous programming (`Promise`, `async/await`), error handling, and event-driven design.
- Structured a server with **Express.js**, middleware, and routing.
- Deepened my understanding of **MongoDB** and **Mongoose**: designing schemas, indexes, and performing CRUD operations.
- Learned **node-cron** for scheduling tasks and **axios** for HTTP requests to external APIs.
- **Skillfully leveraged AI (ChatGPT)** for quick problem-solving, code examples, and best-practice guidance.

This experience fueled my passion for backend development and taught me to adapt rapidly to new tools within a short timeframe.

Author: Vladyslav Labuza



# Weather Alert Subscription Service

Цей проєкт створено у рамках завдання Internship Warsaw (Task.pdf) як сервіс розсилки користувачам сповіщень про погодні умови.

---

## Мета завдання (згідно з Task.pdf)

1. Реалізувати REST API на **Node.js** + **Express**, що дозволить:
   - Створювати підписки через маршрут `/subscriptions` або форму на `index.html`.
   - Отримувати поточні погодні дані через маршрут `/weather?city=<місто>`.
2. Зберігати дані підписок у **MongoDB** з використанням **Mongoose**.
3. Інтегрувати зовнішній API (**WeatherAPI**) для отримання актуальної погоди.
4. Налаштувати щохвилинний запуск перевірки умов за допомогою **node-cron**.
5. Відправляти email-сповіщення через **SendGrid**, якщо:
   - Температура вище/нижче заданого значення — умова `temperatureAbove`/`temperatureBelow`.
   - Виявлено дощ — умова `rain`.
   - Між повідомленнями про одну й ту ж підписку має пройти ≥24 години.
6. Забезпечити валідацію вхідних даних через **express-validator** та обробку помилок.

---

## Основні функціональні блоки та реалізація

1. **API-підписка** (`src/routes/subscriptionRoutes.js` + `src/controllers/subscriptionController.js`):
   - `POST /subscriptions` — створення нової підписки.
   - Валідація полів `email`, `city`, `condition.type` та `condition.value`.
2. **API погоди** (`src/routes/weatherRoutes.js` + `src/controllers/weatherController.js`):
   - `GET /weather?city=` — повернення JSON з полями `temperature`, `humidity`, `description`.
3. **Схема підписки** (`src/models/Subscription.js`):
   - Поля: `email`, `city`, `condition { type, value }`, `lastNotified`.
   - Унікальний індекс `{ email, city }`.
4. **Сервіс відправки email** (`src/services/emailService.js`):
   - Використання `@sendgrid/mail`.
   - Формування та відправка повідомлення.
5. **Перевірка та розсилка** (`src/services/weatherAlertService.js`):
   - Запит до WeatherAPI (`axios`).
   - Логіка `shouldNotify` за типом умови й значенням.
   - Обмеження частоти: перевірка `lastNotified`.
   - Оновлення `lastNotified` у MongoDB.
6. **Cron-розклад** (`server.js`):
   - `cron.schedule('* * * * *', checkWeatherAndNotify)` — виклик щохвилини.

---

## Структура проєкту

```
project/
├─ node_modules/
├─ public/
│  └─ index.html
├─ src/
│  ├─ config/
│  │  └─ db.js
│  ├─ controllers/
│  │  ├─ subscriptionController.js
│  │  └─ weatherController.js
│  ├─ models/
│  │  └─ Subscription.js
│  ├─ routes/
│  │  ├─ subscriptionRoutes.js
│  │  └─ weatherRoutes.js
│  ├─ services/
│  │  ├─ emailService.js
│  │  └─ weatherAlertService.js
│  └─ utils/
│     └─ validators.js
├─ tests/
│  └─ subscription_test.js
├─ .env
├─ .gitignore
├─ docker-compose.yml
├─ Dockerfile
├─ package.json
├─ package-lock.json
├─ sendgrid.env
├─ README.md
└─ server.js
```

---

## Налаштування та запуск

1. Створити файл `.env`:
   ```dotenv
   MONGO_URI=<your_mongo_uri>
   WEATHER_API_KEY=<your_weatherapi_key>
   SENDGRID_API_KEY=<your_sendgrid_key>
   EMAIL_SENDER=<verified_sender_email>
   ```
2. Встановити залежності:
   npm install

3. Запустити застосунок:
   npm start   # або npm run dev

4. Відкрити у браузері `http://localhost:3000` та підписатися.

---

## Виклики та рішення

- Початок із практично нульового рівня знань у Node.js, Express.js та MongoDB; обмежений час виконання завдання та висока мотивація досягти результату.
- Проблеми з відправкою листів через SendGrid: спочатку листи не надсилалися через неправильний формат об’єкта `msg` та налаштування ключа API — виправлено згідно з документацією SendGrid.
- Початкове використання нативного драйвера MongoDB викликало складнощі з валідацією та моделями — перейшов на Mongoose для чіткого опису схем та простішої взаємодії з БД.
- Закладені cron-задачі (`node-cron`) та запити до WeatherAPI через `axios` потребували глибшого опрацювання та тестування, особливо в частині обробки помилок API.
- Логіка обмеження частоти повідомлень (`lastNotified`) спочатку працювала некоректно через невірне обчислення різниці дат — виправлено шляхом порівняння timestamp у мілісекундах.
- Налаштування форми підписки в `public/index.html`.

---

## Рефлексія

Цей проєкт був моєю першою серйозною практикою з використанням Node.js, Js, MongoDB, під час якої я:
- Опановував **JS, **Node.js**, асинхронності (`Promise`, `async/await`).
- Створював сервер на **Express.js** з маршрутизацією, middleware та обробкою запитів.
- Поглиблено працював із **MongoDB** та частично **Mongoose**: створював схеми, моделі та реалізовував CRUD-операції.
- По ходу опанував **node-cron** для розкладу завдань та **axios** для HTTP-запитів до зовнішніх API.
- **Грамотно використовував AI (ChatGPT)** для швидкого пошуку рішень, генерації прикладів коду та оптимізації робочого процесу.

Цей досвід запалив у мене жагу у роботі з Node.js і навчив швидко адаптуватися до нових інструментів у доволі короткий час.

Автор: Владислав Лабуза