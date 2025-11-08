import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { PublicParentComponent } from './components/public-parent/public-parent.component';
import { RequirementsComponent } from './pages/requirements/requirements.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '',
    component: PublicParentComponent,
    children: [
      {
        path: 'requirements',
        component: RequirementsComponent
      },
      {
        path: 'services',
        component: ServicesComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
