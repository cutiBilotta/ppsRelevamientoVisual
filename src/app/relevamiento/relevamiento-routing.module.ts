import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelevamientoPage } from './relevamiento.page';

const routes: Routes = [
  {
    path: '',
    component: RelevamientoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelevamientoPageRoutingModule {}
