$(document).ready(function () {
  console.log("index.js")
  $(".no_members_fixed_btn").css("display", "block");
  $(".members_fixed_btn").css("display", "none");

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
});