# principality-frontend

SPA «Удельные княжества Древней Руси»: плитка и лента княжеств с археологически измеренной площадью укреплений, добавление княжества археологом, лайки. Бэкенд — [principality-backend](https://github.com/dehwyy/principality-backend).

React 19 + TypeScript + Vite, React-Bootstrap, react-router-dom, Redux Toolkit (redux-thunk), axios, клиент API сгенерирован из Swagger бэкенда (`swagger-typescript-api`).

## Запуск

```bash
npm install
npm run generate-api   # src/api/Api.ts из ../principality-backend/docs/swagger.json
npx mkcert create-ca
npx mkcert create-cert --domains localhost,127.0.0.1,<IP ноутбука>
npm run dev
```

Приложение открывается на `https://localhost:3000/principality-frontend/`, корень перенаправляет на `/principalities`. Dev-сервер Vite работает по HTTPS с сертификатом `cert.crt`/`cert.key` и проксирует `/api` на веб-сервис `http://localhost:8080`, а `/principality-media` на Minio `http://localhost:9000`, поэтому CORS не возникает. Приватные ключи `ca.key` и `cert.key` в репозиторий не попадают. Первый запуск `npm run dev` просит пароль: `vite-plugin-mkcert` ставит локальный центр сертификации в системное хранилище.

С телефона в той же сети приложение открывается по адресу `https://<IP ноутбука>:3000/principality-frontend/` и работает с веб-сервисом ноутбука через тот же прокси.

Если веб-сервис недоступен, гость видит княжества из локальной коллекции `src/modules/mock.ts` (картинки — `public/mock-media`); авторизованному пользователю показывается ошибка.

## GitHub Pages и PWA

Сборка с локальной коллекцией развёрнута на https://dehwyy.github.io/principality-frontend/.

```bash
npm run build
npm run deploy         # gh-pages -d dist, ветка gh-pages
```

Приложение устанавливается как PWA: манифест и service worker создаёт `vite-plugin-pwa` (`vite.config.ts`), регистрация — `registerSW()` в `src/main.tsx`. После установки плитка открывается без сети.

## Адаптивность

| Ширина окна | Колонок в плитке | Высота изображения карточки | Лента | Добавление |
|---|---|---|---|---|
| больше 1200px | 4 | 180px | кадр 420px по центру | медиа и поля в две колонки |
| до 1200px | 3 | 150px | кадр 420px по центру | медиа и поля в две колонки |
| до 768px | 2 | 104px | кадр на всю ширину | одна колонка |

## Страницы

### Плитка `/principalities`

- Поле «Основано до» — дата (`input type="date"`), значение хранится в Redux (`principalities.foundedBefore`) и уходит в запрос `GET /api/principalities?foundedBefore=`.
- Кнопка «Найти» — запрашивает список у веб-сервиса; при пустом результате — «К сожалению, пока ничего не найдено :(».
- Карточка княжества — изображение из Minio (или `/DefaultImage.jpg`), счётчик лайков, название, год основания, плашка «коэф. земли». Нажатие открывает ленту с этого княжества.
- Кнопка удаления (корзина в углу карточки) — только у княжеств, созданных текущим археологом; `DELETE /api/principalities/{id}`, княжество переходит в статус `removed`.

### Лента `/principalities/feed/:id`

- Видео княжества во весь экран (или `/DefaultVideo.mp4`), поля «основано» и «коэф. земли».
- Кнопка лайка со счётчиком — доступна после входа, `POST /api/principalities/{id}/like` с `principality_liked` 0/1; у гостя кнопка неактивна.
- Кнопка «Далее» — `GET /api/principalities/feed/{id}?next=true`, следующее опубликованное княжество.
- Название и описание, кнопка «Больше» / «Меньше».

### Добавление `/principalities/draft`

Доступна после входа (гостя перенаправляет на вход). У археолога может быть один черновик.

- Нет черновика — форма создания: «Название княжества», «Изображение», «Видео» (файлы), кнопка «Создать черновик» → `POST /api/principalities` (multipart).
- Есть черновик — карточка черновика и форма публикации: «Описание», «Дата основания», «Коэффициент земли», кнопки «Опубликовать» (`PUT /api/principalities/draft/publish`) и «Удалить» (`DELETE /api/principalities/{id}`).

### Вход `/archaeologists/login`

- Поля «Логин» и «Пароль», кнопка «Войти» → `POST /api/archaeologists/login` голым axios, токен кладётся в Redux (`archaeologist`) и в `localStorage`.
- После входа пункт меню «Вход» становится «Выход», пункт «Добавление» становится доступен. «Выход» — `POST /api/archaeologists/logout`, сброс состояния Redux и фильтра плитки.
- После перезагрузки страницы Redux возвращается в состояние гостя, токен остаётся в `localStorage`.

## Меню

Нижняя панель из четырёх пунктов: «Лента», «Добавление», «Плитка», «Вход»/«Выход». Гостю доступны «Лента», «Плитка» и «Вход».

## Redux

| Слайс | Состояние | Запросы |
|---|---|---|
| `archaeologist` | `accessToken`, `archaeologistLogin`, `isAuthenticated` | логин/логаут — `axios` без thunk (`src/modules/archaeologistApi.ts`) |
| `principalities` | `foundedBefore`, `principalities`, `feedPrincipality`, `loading`, `fromMock`, `error` | `fetchPrincipalities`, `fetchFeedPrincipality`, `likePrincipality`, `deletePrincipality` — `createAsyncThunk` + `api.principalities.*` |
| `principalityDraft` | `draft`, `loading`, `error` | `fetchPrincipalityDraft`, `createPrincipalityDraft`, `publishPrincipalityDraft` |

Во время запросов показывается блокирующий `Spinner` (`BlockingSpinner`), кнопки неактивны.
