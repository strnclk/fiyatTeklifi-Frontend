const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'quote-request', component: () => import('pages/QuoteRequestPage.vue') },
      { path: 'contact', component: () => import('pages/ContactPage.vue') },
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'quotes', component: () => import('pages/QuotesListPage.vue') },
      { path: 'quotes/create', component: () => import('pages/QuoteCreatePage.vue') },
      { path: 'quotes/:id/pdf', component: () => import('pages/QuotePdfPage.vue') },
      { path: 'services', component: () => import('pages/ServicesPage.vue') },
      { path: 'service-categories', component: () => import('pages/ServiceCategoriesPage.vue') },
      { path: 'customers', component: () => import('pages/CustomersPage.vue') },
      { path: 'profile', component: () => import('pages/ProfilePage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
