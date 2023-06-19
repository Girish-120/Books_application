import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/service/app-service.service';

@Component({
  selector: 'app-get-orders',
  templateUrl: './get-orders.component.html',
  styleUrls: ['./get-orders.component.css']
})
export class GetOrdersComponent implements OnInit {

  orderPage:boolean=true;
  viewOrder:boolean=false;

  orderDetails:any =[];
  showOrder:any;
  userId:any;

  constructor(private service:AppServiceService) { }

  ngOnInit(): void {
    this.service.getprofile('/profile').subscribe((res: any) => {
      console.log(res.data._id);
      this.userId = res.data._id
      
      this.service.cartFetched(res.data.cart.length);
      this.getOrder(res.data._id);
    })
  }

  getOrder(userId:any){
    this.service.getBooks('/getAllOrders/'+userId).subscribe((res: any) => {
      this.orderDetails = res.allOrders;
      
    })
  }

  viewOrderPage(item:any){
    this.showOrder = item;
    console.log(this.showOrder.products);
    
    
    this.viewOrder = true
    this.orderPage = false;
  }

  getStarArray(quantity: number): number[] {
    const maxStars = 5;
    const filledStars = Math.min(quantity, maxStars);
    return Array(filledStars).fill(0);
  }
  
  
  getEmptyStarArray(quantity: number | null): number[] {
    const maxStars = 5; 
    const emptyStars = quantity === null ? maxStars : maxStars - quantity;
    return Array(emptyStars).fill(0);
  }
  

  selectStar(starCount: number, item:any) {
    this.service.books('/star-rating',{id:item._id, ratingValue:starCount, userId:this.userId}).subscribe((res: any) => {
      console.log(res);
      
    })
  }

}
