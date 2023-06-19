import{ Injectable } from '@angular/core';
import{ HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  private valueChanged = new BehaviorSubject<any>(null);
  private valueChanged1 = new BehaviorSubject<any>(null);

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

  uploadImage(url:any, data:any){
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.post(environment.serverurl+url,data, {headers:headers});
  }
  

  books(url:any, data:any){
    return this.http.post(environment.serverurl+url,data);
  }

  getBooks(url:any){
    return this.http.get(environment.serverurl+url);
  }

  editBooks(url:any,id:any){
    return this.http.put(environment.serverurl+url,id)
  }

  deleteBooks(url:any,id:any){
    return this.http.delete(`${environment.serverurl}${url}${id}`);
  }

  deleteCart(url:any){
    return this.http.delete(environment.serverurl+url);
  }




  bookFetched(data:any){
    this.valueChanged.next(data);
  }
  getValueChanged():Observable<any>{
    return this.valueChanged.asObservable();
  }

  getBlogs(url:any){
   return this.http.get(environment.serverurl+url);
  }

  createBlog(url:any,data:any){
    return this.http.post(environment.serverurl+url,data);
  }

  getFilteredData(url:any){
    return this.http.get(environment.serverurl+url);
  }

  cartFetched(data:any){
    this.valueChanged1.next(data);
  }
  cartChanged():Observable<any>{
    return this.valueChanged1.asObservable();
  }

}
