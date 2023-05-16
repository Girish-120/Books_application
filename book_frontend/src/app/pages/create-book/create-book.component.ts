import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppServiceService } from 'src/app/service/app-service.service';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent implements OnInit {

  constructor(private fb:FormBuilder, private service:AppServiceService) { }

  ngOnInit(): void {
  }

  bookDetails = this.fb.group({
    book_name:['', Validators.required],
    book_description:['', Validators.required],
    author_name:['', Validators.required],
    publish_date:['', Validators.required],
    price:['', Validators.required]
  })

  submitBook(){
    this.service.books('/createbook', this.bookDetails.value).subscribe((res:any)=>{
      console.log(res);
      if(res.success == true){
        this.bookDetails.reset();
      }
    })
  }

 

}
