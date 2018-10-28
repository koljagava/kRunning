import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SessionDetailsPage } from './session-details.page';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared-module';

const routes: Routes = [
  {
    path: '',
    component: SessionDetailsPage
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SessionDetailsPage]
})
export class SessionDetailsPageModule {}
