import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/service/app-service.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

declare var owl:any;
declare var $:any;
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  allBlogs: any;
  image: any;

  constructor(private service:AppServiceService,private fb:FormBuilder,private toastr:ToastrService) { }

  ngOnInit(): void {
    this.getAllBlogs();
  }

  blogForm = this.fb.group({
    blog_name:["",Validators.required],
    blog_related_to:["",Validators.required],
    blog_content:["",Validators.required],
    blog_date:["",Validators.required],
  })

  onSelectFile(event:any) {
    this.image = event.target.files[0];
  }

  createNewBlog(){

    const formData = new FormData();
    formData.append('blog_name', this.blogForm.value.blog_name);
    formData.append('blog_related_to', this.blogForm.value.blog_related_to);
    formData.append('blog_content', this.blogForm.value.blog_content);
    formData.append('blog_date', this.blogForm.value.blog_date);
    formData.append('image', this.image, this.image.name);

    this.service.createBlog("/createBlog",formData).subscribe((data:any)=>{
      if(data.success == true){
        this.toastr.success("Success message",data.message);
        this.getAllBlogs();
        this.blogForm.reset();
        $('#exampleModal').modal('hide');
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
      owl();
      this.allBlogs = data.blogs;
      }
    },error=>{
      console.log(error);
    })
  }

}
