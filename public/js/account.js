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
        console.log("test endItem button click");
        let id = event.target.getAttribute("data-id");
        console.log(id);
        let makeSureDelete = confirm("Are you sure you want to delete your item?");
        console.log(makeSureDelete);
        if (!makeSureDelete) {
            return alert("Item not deleted.");
        } else {
            console.log("send api post to delete");
            // testing different api routes to get userId
            let userId = -1;
            console.log(userId)
            console.log("before user api get call")
            $.ajax("/api/users", {
                type: "GET"
            }).then(results => {
                userId = results;
                console.log(id);
                $.ajax("api/postings/" + id, {
                    type: "DELETE",
                    userId: userId
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