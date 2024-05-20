import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VotacionPage } from './votacion.page';

const routes: Routes = [
  {
    path: '',
    component: VotacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VotacionPageRoutingModule {}
