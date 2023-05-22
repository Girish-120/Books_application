import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/service/app-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cartlist',
  templateUrl: './cartlist.component.html',
  styleUrls: ['./cartlist.component.css']
})
export class CartlistComponent implements OnInit {

  bookIds: any = [];
  cartBook:any=[];
  Profile:any;
  totalPrice:any;

  constructor(private service:AppServiceService, private toast:ToastrService) { }

  ngOnInit(): void {
    this.getCart();
  }

  getCart(){
    this.bookIds = []
    this.service.getprofile('/profile').subscribe((res:any)=>{

      this.Profile = res;

      for(let i=0; i < res.data.cart.length; i++){
        this.bookIds.push(res.data.cart[i]?.productId);
      }

      this.service.getBooks(`/getCartList?ids=${this.bookIds.join(',')}`).subscribe((data:any)=>{
        this.cartBook = data;
      })
    })
  }

  deleteCart(item:any){  
    this.service.deleteCart(`/deleteCart/${this.Profile.data._id}/${item._id}`).subscribe((data:any)=>{
      if(data.success == true){
        this.toast.success("Success message",data.message);
        this.getCart();
      }else{
        this.toast.error('Error message',data.message);
      }
    })
  }

  increment(id:any){
    this.service.books('/add-to-cart/',{userId:this.Profile.data._id,productId:id._id}).subscribe((data:any)=>{
      if(data.success == true){
        this.getCart();
      }
    })
  }

  decrement(id:any){
    this.service.deleteCart(`/deleteQty/${this.Profile.data._id}/${id._id}`).subscribe((data:any)=>{
      if(data.success == true){
        this.getCart();
      }
     
    })
  }

}
