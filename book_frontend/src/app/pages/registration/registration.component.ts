import { Component, OnInit } from '@angular/core';

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

  constructor() { }

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

}
