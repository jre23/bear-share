// This selects the document and runs after it loads
$(document).ready(function () {
  // This selects the class no_members_fixed_btn and sets the css display to none.
  $(".no_members_fixed_btn").css("display", "block");
  // This selects the class members_fixed_btn and sets the css display to block.
  $(".members_fixed_btn").css("display", "none");
  // search button event handler on index page
  $(".searchButton").on("click", event => {
    // grab reference to search input and cleans the data
    let searchInput = $(".input").val().trim().replace(/\s+/g, " ");
    if (searchInput === "") {
      //alerts the user that the search bar is empty
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