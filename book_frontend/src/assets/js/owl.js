function owl(){
    $(document).ready(function () {
        $('.owl-carousel').owlCarousel({
          items: 3,
          loop: true,
          margin: 10,
          nav: true,
          navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
          responsive: {
            0: {
              items: 1
            },
            768: {
              items: 2
            },
            992: {
              items: 4
            }
          }
        });
      });
}