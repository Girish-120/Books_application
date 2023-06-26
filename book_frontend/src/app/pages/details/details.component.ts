import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppServiceService } from 'src/app/service/app-service.service';

declare var slider: any;
declare var $: any;
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  oneBook: any = [];

  constructor(private service: AppServiceService, private activatedRoute: ActivatedRoute, private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.getBookById();

    $('#descrp').show();
    $('#rate').hide();
  }

  getBookById() {
    this.activatedRoute.params.subscribe((data: any) => {

      this.service.getBooks("/getbook/" + data.id).subscribe((res: any) => {
        console.log(res);
        this.oneBook = res.books;
        setTimeout(() => {
          slider();
        }, 1000);
      })

    });

  }

  descriptionDiv() {
    $('#descrp').show();
    $('#rate').hide();

    const descriptionTab = this.elementRef.nativeElement.querySelector('#descriptionTab');
    const reviewTab = this.elementRef.nativeElement.querySelector('#reviewTab');

    this.renderer.removeClass(reviewTab, 'active');
    this.renderer.addClass(descriptionTab, 'active');
  }

  reviewDiv() {
    $('#descrp').hide();
    $('#rate').show();

    const descriptionTab = this.elementRef.nativeElement.querySelector('#descriptionTab');
    const reviewTab = this.elementRef.nativeElement.querySelector('#reviewTab');

    this.renderer.addClass(reviewTab, 'active');
    this.renderer.removeClass(descriptionTab, 'active');
  }

  getStarArray(quantity:any): number[] {
    const filledStars = quantity !== undefined ? quantity : 0;
    return Array(filledStars).fill(0);
  }

  getEmptyStarArray(quantity:any): number[] {
    const emptyStars = quantity !== undefined ? (5 -quantity) : 5;
    return Array(emptyStars).fill(0);
  }

}
