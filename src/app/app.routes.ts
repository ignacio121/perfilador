import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'onepay', loadComponent: () => import('./pages/simulador-onepay/simulador-onepay.component').then(m => m.SimuladorOnepayComponent), canActivate: [AuthGuard]},

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'home', loadComponent: () => import('./pages/post-login-home/post-login-home.component').then(m => m.PostLoginHomeComponent)},
      { path: 'permision', loadComponent: () => import('./pages/permision/permision.component').then(m => m.PermisosTestComponent)},
      { path: 'my-users', loadComponent: () => import('./pages/my-users/my-users.component').then(m => m.MyUsersComponent)},
      { path: 'organizations', loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent)},
      { path: 'users', loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent)},
      { path: 'create-users', loadComponent: () => import('./pages/create-user/create-user.component').then(m => m.UserCreateComponent)}
    ]
  },
  { path: "**", redirectTo: "" },
];
