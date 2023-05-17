import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppServiceService } from 'src/app/service/app-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  query:any;

  constructor(private route:Router, private service:AppServiceService) { }

  ngOnInit(): void {
  }

  signOut(){
    localStorage.clear();
    this.route.navigate(['/']);
  }

  search() {
    if (!this.query) {
      return;
    }else{
      this.service.getBooks(`/search?query=${this.query}`).subscribe((res:any)=>{
        // console.log(res);
        this.service.bookFetched(res)
      })
    }
  }

}
