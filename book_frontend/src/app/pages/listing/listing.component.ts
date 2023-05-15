import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/service/app-service.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {

  authorList:boolean=false;
  languageList:boolean=true;
  reviewList:boolean=false;
  featuredList:boolean=true;

  allBooks:any;

  constructor(private service:AppServiceService) { }

  ngOnInit(): void {
    this.getAllBooks();
  }

  openDiv(event:any){
    if(event == 'author'){
      this.authorList = !this.authorList;
    }
    else if(event == 'language'){
      this.languageList = !this.languageList;
    }
    else if(event == 'review'){
      this.reviewList = !this.reviewList;
    }
    else if(event == 'featured'){
      this.featuredList = !this.featuredList;
    }
  }

  getAllBooks(){
    this.service.getBooks('/getallbooks').subscribe((res:any)=>{
      this.allBooks = res.books
    })
  }

}
