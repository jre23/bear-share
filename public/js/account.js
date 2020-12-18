$(document).ready(() => {
    $(".no_members_fixed_btn").css("display", "none");
    $(".members_fixed_btn").css("display", "block");

    $(".tabs").tabs();
    $(".dropdown-trigger").dropdown({
        constrain_width: true,
    });

    // this event listener is for when the user is logged in, in their account page, under the selling tab, and wants to delete an item
    $(".endItem").on("click", (event) => {
        event.preventDefault();
        let postingId = event.target.getAttribute("data-id");
        postingId = parseInt(postingId);
        console.log(event.target);
        console.log(postingId);
        let makeSureDelete = confirm("Are you sure you want to delete your item?");
        if (!makeSureDelete) {
            return alert("Item not deleted.");
        } else {
            $.ajax("/api/postings/" + postingId, {
                    type: "DELETE",
                })
                .then((res) => {
                    console.log(res);
                    console.log("test log after ajax to api/postings");
                    if (res === 0) {
                        return alert("Item to delete not found!");
                    } else {
                        alert("Item deleted!");
                        location.reload();
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    });

    document.getElementById("file").onchange = function () {
        document.getElementById("pp-form").submit();
    };


    // Message Tab on Account Page
    $(".delete-message").on("click", (e) => {
        e.preventDefault();
        let id = $(e.target).data("id");
        console.log(id);
        let questionDelete = confirm("Are you sure you want to delete the message?");
        if (!questionDelete) {
            return alert("Message not deleted.");
        } else {
            $.ajax("/api/messages/" + id, {
                    type: "DELETE",
                }).then((res) => {
                    if (res === 0) {
                        return alert("Message to delete not found!");
                    } else {
                        alert("Message deleted!");
                        location.reload();
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    })

});