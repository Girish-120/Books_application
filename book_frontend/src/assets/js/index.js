// Get the elements with class="column"
var elements = document.getElementsByClassName("column");
var className = document.getElementsByClassName("like");

// Declare a loop variable
var i;

// List View
function listView() {
  for (i = 0; i < elements.length; i++) {
    // elements[i].style.width = "100%";
    elements[i].classList.remove('col-md-4');
    elements[i].classList.add('col-md-12');
    className[i].style.width = "100%";
    className[i].style.flexDirection = "row";
  }
}

// Grid View
function gridView() {
  for (i = 0; i < elements.length; i++) {
    elements[i].classList.remove('col-md-12');
    elements[i].classList.add('col-md-4');
    className[i].style.width = "18rem";
    className[i].style.flexDirection = "column";
  }
}

/* Optional: Add active class to the current button (highlight it) */
var container = document.getElementById("btnContainer");
var btns = container.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}
