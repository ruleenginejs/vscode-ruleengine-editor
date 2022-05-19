import ReNotFound from '@/views/re-not-found.vue';

export default [
  {
    path: '/:pathMatch(.*)',
    name: 'not-found',
    component: ReNotFound
  }
];
