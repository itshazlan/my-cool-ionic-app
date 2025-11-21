import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/todo-list/todo-list.page').then((m) => m.TodoListPage),
  },
  {
    path: 'todo-form',
    loadComponent: () => import('./pages/todo-form/todo-form.page').then((m) => m.TodoFormPage),
  },
  {
    path: 'todo-form/:id',
    loadComponent: () => import('./pages/todo-form/todo-form.page').then((m) => m.TodoFormPage),
  },
];
