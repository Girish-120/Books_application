import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './includes/navbar/navbar.component';
import { FooterComponent } from './includes/footer/footer.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { AboutComponent } from './pages/about/about.component';
import { ListingComponent } from './pages/listing/listing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './pages/profile/profile.component';
import { CreateBookComponent } from './pages/create-book/create-book.component';
import { ToastrModule } from 'ngx-toastr';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CartlistComponent } from './pages/cartlist/cartlist.component';
import { BrowserAnimationsModule  } from '@angular/platform-browser/animations';
// import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    RegistrationComponent,
    AboutComponent,
    ListingComponent,
    ProfileComponent,
    CreateBookComponent,
    CartlistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    LazyLoadImageModule,
    BrowserAnimationsModule,
    NgxPaginationModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
