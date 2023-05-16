import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppServiceService } from 'src/app/service/app-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  signUp:boolean = true;
  login:boolean = false;

  signUpBtn = true;
  loginBtn = false;

  constructor(private fb:FormBuilder,private service:AppServiceService,private router:Router,private toast:ToastrService) { }

  ngOnInit(): void {
  }

  signUpForm(){
    this.signUp = true;
    this.login = false;

   this.signUpBtn = true;
    this.loginBtn = false;
  }

  loginForm(){
    this.login = true;
    this.signUp = false;
    
    this.signUpBtn = false;
    this.loginBtn = true;
  }

  registerForm = this.fb.group({
    userName:["",Validators.required],
    mobile:["",Validators.required],
    email:["",Validators.required],
    password:["",Validators.required]
  })

  LoginForm = this.fb.group({
    email:["",Validators.required],
    password:["",Validators.required]
  })

  createAccount(){
    if(this.registerForm.valid){
      this.service.createUser('/register',this.registerForm.value).subscribe((data:any)=>{
        console.log(data);
        if(data.success == true){
          this.toast.success('Success message',data.message);
          this.loginForm();
        }else{
          this.toast.error('Error message',data.message);
        }
      })
    }
  }

  loginAccount(){
    this.service.createUser('/login',this.LoginForm.value).subscribe((data:any)=>{
      console.log(data);
      if(data.success == true){
        this.toast.success('Success message',data.message);
        localStorage.setItem('token', data.token);
        this.router.navigateByUrl("/listing");
      }else{
        this.toast.error('Error message',data.message);
      }
    })
  }

}
