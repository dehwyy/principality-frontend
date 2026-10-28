export const ROUTES = {
  PRINCIPALITIES: "/principalities",
  FEED: "/principalities/feed",
  DRAFT: "/principalities/draft",
  LOGIN: "/archaeologists/login",
}
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  PRINCIPALITIES: "Плитка",
  FEED: "Лента",
  DRAFT: "Добавление",
  LOGIN: "Вход",
};
