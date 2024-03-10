import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: MainComponent,
  },
  {
    path: 'playlist/:id',
    component: MainComponent,
  },
  {
    path: 'collection/songs',
    component: MainComponent,
  },
  {
    path: 'search',
    component: MainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
