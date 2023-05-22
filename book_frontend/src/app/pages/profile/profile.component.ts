import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AppServiceService } from 'src/app/service/app-service.service';

declare var $:any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileData:any;

  constructor(private service:AppServiceService,private fb:FormBuilder ) { }

  ngOnInit(): void {
    this.getProfileDet();
  }

  getProfileDet(){
    this.service.getprofile("/profile").subscribe((data:any)=>{
      if(data.success == true){
        this.profileData = data.data
        this.addAddress.patchValue({'userId':this.profileData._id})
      }
    });
  }

  uploadImage(event:any){
    const formData = new FormData();
    formData.append('profilePhoto', event.target.files[0], event.target.files[0].name);
    
    this.service.uploadImage('/upload-photo',formData).subscribe((res:any)=>{
      if(res.success == true){
        this.getProfileDet();
      }
      
    })
  }

  addAddress = this.fb.group({
    userId:[''],
    street:[''],
    city:[''],
    state:[''],
    country:[''],
    postalCode:['']
  })

  addressSubmit(){ 
    this.service.createUser('/addAddress', this.addAddress.value).subscribe((res:any)=>{
      if(res.success == true){
        $('#exampleModal').modal('hide');
      }
    })
  }

}
