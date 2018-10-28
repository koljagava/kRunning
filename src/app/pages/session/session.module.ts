import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SessionPage } from './session.page';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared-module';

const routes: Routes = [
  {
    path: '',
    component: SessionPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SessionPage]
})
export class SessionPageModule {}
