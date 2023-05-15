import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/service/app-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileData:any;

  constructor(private service:AppServiceService) { }

  ngOnInit(): void {
    this.getProfileDet();
  }

  getProfileDet(){
    this.service.getprofile("/profile").subscribe((data:any)=>{
      if(data.success == true){
        this.profileData = data.data
      }
    });
  }

}
