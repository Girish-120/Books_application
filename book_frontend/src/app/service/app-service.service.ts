import{ Injectable } from '@angular/core';
import{ HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  constructor(private http:HttpClient) { }

  createUser(url:any,data:any){
    return this.http.post(environment.serverurl+url,data);
  }

  loginUser(url:any,data:any){
    return this.http.post(environment.serverurl+url,data);
  }

}
