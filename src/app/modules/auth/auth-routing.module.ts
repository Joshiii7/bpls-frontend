import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicParentComponent } from '../landing/components/public-parent/public-parent.component';
import { RegisterComponent } from './pages/register/register.component';

// Login now lives in the homepage hero (see LoginFormComponent in the landing
// module) instead of its own page, so there's no '/auth/login' route anymore.
const routes: Routes = [
  {
    path: '',
    component: PublicParentComponent,
    children: [
      {
        path: 'register',
        component: RegisterComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
