$(document).ready(function () {
    console.log("search.js")

    // this ajax call checks if a user is logged in or not to determine what nav bar to show when a user conducts a search
    $.ajax("/api/users", {
            type: "GET",
        })
        .then(data => {
            console.log(data);
            if (isNaN(data)) {
                // show navbar for user not logged in
                $(".no_members_fixed_btn").css("display", "block");
                $(".members_fixed_btn").css("display", "none");
            } else {
                // show navbar for user logged in
                $(".no_members_fixed_btn").css("display", "none");
                $(".members_fixed_btn").css("display", "block");
            }
        })
        .catch((e) => {
            console.log(e)
        });

    // search button event handler on search page
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