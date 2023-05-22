import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/service/app-service.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

declare var owl:any;
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  allBlogs: any;

  constructor(private service:AppServiceService,private fb:FormBuilder,private toastr:ToastrService) { }

  ngOnInit(): void {
    owl();
    this.getAllBlogs();
  }

  blogForm = this.fb.group({
    blog_name:["",Validators.required],
    blog_related_to:["",Validators.required],
    blog_content:["",Validators.required],
    blog_date:["",Validators.required],
  })

  createNewBlog(){
    this.service.createBlog("/createBlog",this.blogForm.value).subscribe((data:any)=>{
      if(data.success == true){
        this.toastr.success("Success message",data.message);
        this.getAllBlogs();
        this.blogForm.reset();
      }else{
        this.toastr.error('Error message',data.message);
      }
    },error=>{
      console.log(error);
    })
  }

  getAllBlogs(){
    this.service.getBlogs("/getallblogs").subscribe((data:any)=>{
      if(data.success == true){
      this.allBlogs = data.blogs;
      }
    },error=>{
      console.log(error);
    })
  }

}
