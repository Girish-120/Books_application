import{ Injectable } from '@angular/core';
import{ HttpClient, HttpHeaders } from '@angular/common/http';
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

  getprofile(url: any) {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.get(environment.serverurl + url, {headers:headers});
  }

  books(url:any, data:any){
    return this.http.post(environment.serverurl+url,data);
  }

  getBooks(url:any){
    return this.http.get(environment.serverurl+url);
  }

}
