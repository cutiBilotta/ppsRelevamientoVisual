import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RelevamientoPageRoutingModule } from './relevamiento-routing.module';

import { RelevamientoPage } from './relevamiento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RelevamientoPageRoutingModule
  ],
  declarations: [RelevamientoPage]
})
export class RelevamientoPageModule {}
