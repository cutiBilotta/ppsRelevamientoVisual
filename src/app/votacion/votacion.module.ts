import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VotacionPageRoutingModule } from './votacion-routing.module';

import { VotacionPage } from './votacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VotacionPageRoutingModule
  ],
  declarations: [VotacionPage]
})
export class VotacionPageModule {}
