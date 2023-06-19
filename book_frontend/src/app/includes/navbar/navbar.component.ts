import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServiceService } from 'src/app/service/app-service.service';
import { ListingComponent } from 'src/app/pages/listing/listing.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [
    ListingComponent
  ]
})
export class NavbarComponent implements OnInit {

  query: any;
  cartLength:any;

  constructor(private route: Router, private service: AppServiceService, private listing: ListingComponent) { }

  ngOnInit(): void {
    this.service.cartChanged().subscribe((res: any) => {
      this.cartLength = res
    })
  }

  signOut() {
    localStorage.clear();
    this.route.navigate(['/']);
  }

  search() {
    if (!this.query) {
      this.listing.getAllBooks();
    } else {
      this.service.getBooks(`/search?query=${this.query}`).subscribe((res: any) => {
        this.service.bookFetched(res)
      })
    }
  }

}
