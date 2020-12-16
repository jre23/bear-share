$(document).ready(function () {
  console.log("members JS");
  $(".no_members_fixed_btn").css("display", "none");
  $(".members_fixed_btn").css("display", "block");

  // search button event handler on index page
  $(".searchButton").on("click", event => {
    // make sure to preventDefault on a submit event.
    event.preventDefault();
    // grab reference to search input
    let searchInput = $(".input").val().trim().replace(/\s+/g, " ");
    if (searchInput === "") {
      return alert("Empty search input");
    }
    // send the GET request
    $.ajax("/api/postings/", {
      type: "GET"
    }).then(results => {
      let index = -1;
      let searchArray = [];
      let searchInputLower = searchInput.toLowerCase();
      let eachInputArray = searchInputLower.toString().split(" ");
      console.log(eachInputArray);
      for (let i = 0; i < results.length; i++) {
        if (results[i].title.toLowerCase() === searchInputLower) {
          index = i;
          console.log("item found!")
        }
        if (results[i].title.toLowerCase().includes(searchInputLower) || results[i].description.toLowerCase().includes(searchInputLower)) {
          searchArray.push(results[i].title);
        }
        for (let j = 0; j < eachInputArray.length; j++) {
          if (results[i].title.toLowerCase().toString().includes(eachInputArray[j]) || results[i].description.toLowerCase().toString().includes(eachInputArray[j])) {
            if (!searchArray.includes(results[i].title)) {
              searchArray.push(results[i].title);
            }
          }
        }
      }
      let newP = $("<p>");
      let newPTwo = $("<p>");
      let searchResultsText = "";
      // index is initialized to -1. if still -1, search is not in the database
      if (index < 0 && searchArray.length === 0) {
        $(".input").val("");
        return alert("Your search is not in the database!");
      } else if (index < 0) {
        searchResultsText = searchInput;
      } else {
        searchResultsText = results[index].title;
      }
      // joel - have to figure out where to put the result once it's found. I added some html to index.handlebars for now so I can test that this works. we can change how we show the search item if we don't like it this way.
      newP.text(searchResultsText);
      newPTwo.text(searchResultsText);
      $("div").removeClass("hide");
      $(".searchInputMed").empty().append(newP);
      $(".searchInputLarge").empty().append(newPTwo);
      for (let i = 0; i < searchArray.length; i++) {
        console.log(searchArray[i]);
      }
      $(".input").val("");
    }).catch((e) => {
      console.log(e)
    });
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
    $.get(`/api/product/${id}`).then((result) =>{
      // window.location.replace("/product");
      // location.reload();
    
      
      // res.end();
    });

  });

});