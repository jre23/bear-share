// wait to attach our handlers until the DOM is fully loaded with document.ready
$(document).ready(() => {
    $(".no_members_fixed_btn").css("display", "none");
    $(".members_fixed_btn").css("display", "block");
    
    // this event listener is for when the user adds a post
    $(".post_item").on("submit", event => {
        // make sure to preventDefault on a submit event.
        event.preventDefault();
        // grab references to form inputs
        const postTitle = $("#title_post").val().trim();
        const postCategory = $("#bears_lists").val().trim();
        const postPhotoOne = $("#file-upload_1").val().trim();
        const postPhotoTwo = $("#file-upload_2").val().trim();
        const postPhotoThree = $("#file-upload_3").val().trim();
        const postPhotoFour = $("#file-upload_4").val().trim();
        const postDescription = $("#description_post").val().trim();
        const postPrice = $("#price_post").val().trim();
        // not sure how to add multiple photos to the post yet so just using postPhotoOne for now
        let newPost = {
            title: postTitle,
            description: postDescription,
            image_paths: postPhotoOne,
            ask_price: postPrice
        }
        console.log(newPost);
        // send the POST request.
        $.ajax("/api/postings", {
            type: "POST",
            data: newPost
        }).then(() => { // redirect to main page to see all of the listings (maybe redirect to a page that has just this new listing?)
            location.replace("/");
        }).catch((e) => {
            console.log(e)
        });
    });
    // search button event handler on index page
    $(".orange").on("click", event => {
        // make sure to preventDefault on a submit event.
        event.preventDefault();
        // grab reference to search input
        let searchInput = $(".input").val().trim();
        // send the GET request
        $.ajax("/api/postings/", {
            type: "GET"
        }).then(results => {
            let index = -1;
            let searchArray = [];
            for (let i = 0; i < results.length; i++) {
                if (results[i].title.toLowerCase() === searchInput.toLowerCase()) {
                    index = i;
                }
                if (results[i].title.toLowerCase().includes(searchInput.toLowerCase())) {
                    searchArray.push(results[i].title);
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
});