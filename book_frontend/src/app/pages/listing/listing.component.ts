import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/service/app-service.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

declare var $:any;
declare var listView:any;
declare var gridView:any;
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {

  authorList:boolean=true;
  languageList:boolean=false;
  reviewList:boolean=false;
  featuredList:boolean=false;

  allBooks:any;
  bookId: any;

  constructor(private service:AppServiceService,private fb:FormBuilder,private toast:ToastrService) { }

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

  editForm = this.fb.group({
    book_name:["",Validators.required],
    book_description:["",Validators.required],
    author_name:["",Validators.required],
    publish_date:["",Validators.required],
    price:["",Validators.required]
  })

  editBookById(id:any){
    this.bookId = id._id;
    this.editForm.patchValue({'book_name':id.book_name,'book_description':id.book_description,'author_name':id.author_name,'publish_date':id.publish_date,'price':id.price});
  }

  editBooks(){
    this.service.editBooks('/editbookbyid/'+this.bookId,this.editForm.value).subscribe((data:any)=>{
      if(data.error == 0){
        $('#exampleModal').modal('hide');
        this.toast.success("Success message",data.message);
        this.ngOnInit();
      }else{
        this.toast.error('Error message',data.message);
      }
    })
  }

  deleteBook(id:any){
    this.service.deleteBooks('/deletebook/',id).subscribe((data:any)=>{
      if(data.success == true){
        this.toast.success("Success message",data.message);
        this.ngOnInit();
      }else{
        this.toast.error('Error message',data.message);
      }
    })
  }

  listView(){
    listView();
  }

  gridView(){
    gridView();
  }

}
