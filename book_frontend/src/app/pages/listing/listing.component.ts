import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/service/app-service.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

declare var $:any;
declare var listView:any;
declare var gridView:any;
declare var owl:any;

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
  dataSlice: any;
  profileData:any;
  items:any = [];
  p: number = 1;
  bookLength: any;

  constructor(private service:AppServiceService,private fb:FormBuilder,private toast:ToastrService) { }

  ngOnInit(): void {
    this.getAllBooks();
    this.service.getValueChanged().subscribe((res:any)=>{
      if(res != null){
        this.allBooks = res?.books  
      }  
    })
    this.getProfile();
  }

  getProfile(){
    this.service.getprofile("/profile").subscribe((data:any)=>{
      if(data.success == true){
        this.profileData = data.data
        this.service.cartFetched(this.profileData.cart.length)
      }
    });
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
      this.bookLength = res.book_length;
      owl();
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

  sortItemsByPrice(event:any){
    if(event.target.value == "default"){
      this.getAllBooks();
    }else{
      this.service.getFilteredData("/filter?query="+event.target.value).subscribe((data:any)=>{
        this.allBooks = data;
      })
    }
  }


  addToCart(id:any){
    this.service.books('/add-to-cart/',{userId:this.profileData._id,productId:id}).subscribe((data:any)=>{
      if(data.success == true){
        this.toast.success("Success message",data.message);
        this.getProfile();
      }else{
        this.toast.error('Error message',data.message);
      }
    })
  }

  getStarArray(quantity:any): number[] {
    const filledStars = quantity !== undefined ? quantity : 0;
    return Array(filledStars).fill(0);
  }

  getEmptyStarArray(quantity:any): number[] {
    const emptyStars = quantity !== undefined ? (5 -quantity) : 5;
    return Array(emptyStars).fill(0);
  }

}
