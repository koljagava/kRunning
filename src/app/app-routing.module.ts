import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'sessions', pathMatch: 'full' },
  { path: 'session', loadChildren: './pages/session/session.module#SessionPageModule' },
  { path: 'sessions', loadChildren: './pages/sessions/sessions.module#SessionsPageModule'},
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },
  { path: 'session-details', loadChildren: './pages/session-details/session-details.module#SessionDetailsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
