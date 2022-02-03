const routes = [
  {
    path: "/cliente",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "cadastro",
        component: () => import("pages/client/Schools.vue"),
      },
      {
        path: "cadastro/adicionar",
        component: () => import("pages/client/SchoolsAdd.vue"),
      },
      {
        path: "contrato",
        component: () => import("pages/client/Contracts.vue"),
      },
      {
        path: "contrato/adicionar",
        component: () => import("pages/client/ContractsAdd.vue"),
      },
      {
        path: "pedido",
        component: () => import("pages/client/Orders.vue"),
      },
      {
        path: "pedido/adicionar",
        component: () => import("pages/client/OrdersAdd.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("pages/Login.vue"),
  },
  {
    path: "/registrar",
    component: () => import("pages/Register.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
