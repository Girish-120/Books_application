import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AppServiceService } from 'src/app/service/app-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent implements OnInit {

  // bookDetails: FormGroup;
  image: any;
  
  constructor(private fb:FormBuilder, private service:AppServiceService,private toast:ToastrService,private router:Router) { }

  ngOnInit(): void {
  }

  bookDetails = this.fb.group({
    book_name:['', Validators.required],
    book_description:['', Validators.required],
    author_name:['', Validators.required],
    publish_date:['', Validators.required],
    price:['', Validators.required]
  })

  onSelectFile(event:any) {
    this.image = event.target.files;
  }
 
  submitBook(){

    const formData = new FormData();
    formData.append('book_name', this.bookDetails.value.book_name);
    formData.append('book_description', this.bookDetails.value.book_description);
    formData.append('author_name', this.bookDetails.value.author_name);
    formData.append('publish_date', this.bookDetails.value.publish_date);
    formData.append('price', this.bookDetails.value.price);
    // formData.append('image', this.image, this.image.name);

    for (let i = 0; i < this.image.length; i++) {
      formData.append('image', this.image[i]);
    }
    
    this.service.books('/createbook',formData).subscribe((res:any)=>{
      if(res.success == true){
        this.toast.success('Success message',res.message);
        this.router.navigateByUrl("/listing");
      }else{
        this.toast.error('Error message',res.message);
      }
    })
  }

 

}
