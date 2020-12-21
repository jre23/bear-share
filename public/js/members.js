// This selects the document and runs after it loads.
$(document).ready(function () {
  // This selects the class no_members_fixed_btn and sets the css display to none.
  $(".no_members_fixed_btn").css("display", "none");
  // This selects the class members_fixed_btn and sets the css display to block.
  $(".members_fixed_btn").css("display", "block");
  // This puts a search button event handler on the index page.
  $(".searchButton").on("click", event => {
    // This grabs the reference to search input.
    let searchInput = $(".input").val().trim().replace(/\s+/g, " ");
    if (searchInput === "") {
      return alert("Empty search input");
    }
  });
  // This event handler is so the user can also press enter to search instead of having to click the search button.
  $(".searchField").keypress(enter => {
    if (enter.which === 13) {
      $(".searchButton").click();
      return false;
    }
  });
});