import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistsComponent } from './artists/artists.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { NotificationPageComponent } from './notification-page/notification-page.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  { path: 'contact', component: ContactComponent },
  { path: 'artists', component: ArtistsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'notificationpage', component: NotificationPageComponent },
  { path: 'authpage', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
