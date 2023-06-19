import { Component, OnInit } from '@angular/core';
import { AppServiceService } from 'src/app/service/app-service.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';

declare var $:any;
@Component({
  selector: 'app-cartlist',
  templateUrl: './cartlist.component.html',
  styleUrls: ['./cartlist.component.css']
})
export class CartlistComponent implements OnInit {

  bookIds: any = [];
  cartBook: any = [];
  Profile: any;
  totalPrice: any;
  quantity: any = [];
  orderDetails:any;
  allCoupons:any;
  cartTotal:any;
  couponData:any;
  oneCoupon:any;
  paymentMethod:any;

  cartPage:boolean= true;
  orderPage:boolean= false;

  codBtn:boolean = true;
  cardBtn:boolean  = false;

  constructor(private service: AppServiceService, private toast: ToastrService, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.getCart();
    this.getCoupons();
  }

  getCart() {
    this.bookIds = []
    this.service.getprofile('/profile').subscribe((res: any) => {

      this.Profile = res;
      this.service.cartFetched(this.Profile.data.cart.length);
      this.orderForm.patchValue({'userId':res.data._id});

      if(this.Profile.data.cart?.length == 0){
        this.cartBook = []
      }else{
        for (let i = 0; i < res.data.cart.length; i++) {
          this.bookIds.push(res.data.cart[i]?.productId);
        }
        this.quantity = []
        this.service.getBooks(`/getCartList?ids=${this.bookIds.join(',')}`).subscribe((data: any) => {
          this.cartBook = data;

          if(this.oneCoupon){
            const discountPercentage = this.oneCoupon.discount / 100;
            const discountedPrice = this.cartBook.totalPrice - (this.cartBook.totalPrice * discountPercentage);
            this.cartTotal = Math.round(discountedPrice);;
            this.orderForm.patchValue({'totalPrice':this.cartTotal});
            this.orderForm.patchValue({'coupons':this.oneCoupon.discount});
            this.orderForm.patchValue({'subTotal':this.cartBook.totalPrice});
            this.cardForm.patchValue({"amount":this.cartTotal})
          }else{
            this.cartTotal = this.cartBook.totalPrice
            this.orderForm.patchValue({'totalPrice':this.cartBook.totalPrice});
            this.orderForm.patchValue({'subTotal':this.cartBook.totalPrice});
            this.cardForm.patchValue({"amount":this.cartBook.totalPrice})
          }
          
          
          for (let i = 0; i < data.books.length; i++) {
            for (let j = 0; j < res.data.cart.length; j++) {
              if (res.data.cart[j].productId == data.books[i]._id) {
                this.quantity.push(res.data.cart[j].quantity)
              }
            }
          }
        })
      }
    
    })
  }

  deleteCart(item: any) {
    this.service.deleteCart(`/deleteCart/${this.Profile.data._id}/${item._id}`).subscribe((data: any) => {
      if (data.success == true) {
        this.toast.success("Success message", data.message);
        this.getCart();
      } else {
        this.toast.error('Error message', data.message);
      }
    })
  }

  increment(id: any) {
    this.service.books('/add-to-cart/', { userId: this.Profile.data._id, productId: id }).subscribe((data: any) => {
      if (data.success == true) {
        this.getCart();
      }
    })
  }

  decrement(id: any) {
    this.service.deleteCart(`/deleteQty/${this.Profile.data._id}/${id._id}`).subscribe((data: any) => {
      if (data.success == true) {
        this.getCart();
      }

    })
  }

  addressChng(ev:any){
    this.orderForm.patchValue({'address':ev.target.value});
  }

  generateCaptcha(){
    this.service.getBooks('/captcha').subscribe((res: any) => {
      const svgContainer = document.getElementById('svgContainer');
      if (svgContainer) {
        svgContainer.innerHTML = res.data;
      }
      this.paymentMethod = "COD"
    });
  }

  orderForm = this.fb.group({
    userId : ['', Validators.required],
    address : ['', Validators.required],
    totalPrice : ['', Validators.required],
    captchaTxt : ['', Validators.required],
    subTotal:[''],
    coupons: [''],
    orderNumber:['']
  })

  placeOrder(){
    this.service.createUser('/place-order', this.orderForm.value).subscribe((res:any)=>{
      
      if(res.success == true){
        $("#captcha").modal('hide')
        this.cartPage = false;
        this.orderPage = true;
      
        this.getOrder(res.orderNumber, res.userId)
      }
    }, err => {
      console.log("er - ",err.error.err.message);
      
    })
  }

  getOrder(order:any, userId:any){
    this.service.getBooks('/getOrder/'+order+'/'+userId).subscribe((res: any) => {
      this.orderDetails = res;
    })
  }

  getCoupons(){
    this.service.getBooks('/getAllCoupons').subscribe((res: any) => {
      this.allCoupons = res.coupons;
    })
  }

  couponSubmit(){
    this.service.books('/validateCoupon',{code:this.couponData}).subscribe((res: any) => {
      this.oneCoupon = res;
      this.getCart();
      
    })
  }

  paymentRadio(ev:any){
    if(ev == 'card'){
      this.codBtn = false;
      this.cardBtn = true;
    }else if(ev == 'cod'){
      this.codBtn = true;
      this.cardBtn = false;
    }
  }

  
  monthData(ev:any){
    this.cardForm.patchValue({"expiryMonth":ev.target.value})
  }

  yearData(ev:any){
    this.cardForm.patchValue({"expiryYear":ev.target.value})
  }

  cardForm = this.fb.group({
    cardNumber: [''],
    expiryMonth: [''],
    expiryYear: [''],
    cvc: [''],
    amount: [''],
    customerName: ['Kuldeep Singh'],
    customerAddress: ['IMG Alwar'],
    description: ['THis is for testing purpose.']
  })


  confirmOrder(){
    this.service.books('/payment',this.cardForm.value).subscribe((res: any) => {
      this.paymentMethod = res.paymentDetails.paymentMethod
      this.orderForm.patchValue({"orderNumber": res.paymentDetails.orderNumber})
      this.orderForm.patchValue({"orderNumber": res.paymentDetails.orderNumber})
      this.placeOrder();
    })
  }

}
