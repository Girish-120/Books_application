import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AboutComponent } from './pages/about/about.component';
import { ListingComponent } from './pages/listing/listing.component';

const routes: Routes = [
  {path:'', component:RegistrationComponent},
  {path:'about',component:AboutComponent},
  {path:'listing',component:ListingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
