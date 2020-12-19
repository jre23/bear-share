$(document).ready(function () {
  console.log("members JS");
  $(".no_members_fixed_btn").css("display", "none");
  $(".members_fixed_btn").css("display", "block");

  // search button event handler on index page
  $(".searchButton").on("click", event => {
    // grab reference to search input
    let searchInput = $(".input").val().trim().replace(/\s+/g, " ");
    if (searchInput === "") {
      return alert("Empty search input");
    }
  });

  // this event handler is so the user can also press enter to search instead of having to click the search button
  $(".searchField").keypress(enter => {
    if (enter.which === 13) {
      $(".searchButton").click();
      return false;
    }
  });

  $(".testBtn").on('click', (e) => {
    e.preventDefault();

    let id = $(e.target).data("id");
    console.log(id);
    $.get(`/api/product/${id}`).then((result) => {
      // window.location.replace("/product");
      // location.reload();


      // res.end();
    });

  });

});