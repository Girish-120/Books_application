import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AboutComponent } from './pages/about/about.component';
import { ListingComponent } from './pages/listing/listing.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreateBookComponent } from './pages/create-book/create-book.component';
import { AuthguardGuard } from './authguard.guard';
import { CartlistComponent } from './pages/cartlist/cartlist.component';

const routes: Routes = [
  {path:'', component:RegistrationComponent},
  {path:'about',component:AboutComponent},
  {path:'listing',component:ListingComponent,canActivate:[AuthguardGuard]},
  {path:'profile',component:ProfileComponent,canActivate:[AuthguardGuard]},
  {path:'createBook',component:CreateBookComponent,canActivate:[AuthguardGuard]},
  {path:'cart-list',component:CartlistComponent, canActivate:[AuthguardGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
