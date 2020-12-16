$(document).ready(() => {
    $(".no_members_fixed_btn").css("display", "none");
    $(".members_fixed_btn").css("display", "block");

    $('.tabs').tabs();
    $('.dropdown-trigger').dropdown({
        constrain_width: true
    });

    // this event listener is for when the user is logged in, in their account page, under the selling tab, and wants to delete an item
    $(".endItem").on("click", event => {
        event.preventDefault();
        let postingId = event.target.getAttribute("data-id");
        postingId = parseInt(postingId);
        console.log(postingId);
        let makeSureDelete = confirm("Are you sure you want to delete your item?");
        if (!makeSureDelete) {
            return alert("Item not deleted.");
        } else {
            let userId = -1;
            console.log(userId)
            console.log("before user api get call")
            // make ajax call to get the user's id
            $.ajax("/api/users", {
                type: "GET"
            }).then(results => {
                userId = results;
                console.log(userId)
                console.log(postingId);
                // use the user id from the first ajax call along with the posting id from the account.handlebars data-id to make delete ajax call
                $.ajax("/api/postings/" + postingId + "/" + userId, {
                    type: "DELETE",
                }).then(res => {
                    console.log("Item deleted!")
                    location.reload();
                })
            }).catch((e) => {
                console.log(e)
            });
        }
    });
});