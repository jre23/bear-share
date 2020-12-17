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
            $.ajax("/api/postings/" + postingId, {
                type: "DELETE",
            }).then(res => {
                console.log(res);
                console.log("test log after ajax to api/postings");
                if (res === 0) {
                    return alert("Item to delete not found!")
                } else {
                    alert("Item deleted!");
                    location.reload();
                }
            }).catch((e) => {
                console.log(e)
            });
        }
    });
    // this function gets the user's info for the account tab
    const getUserData = () => {
        $.ajax("/api/userInfo/", {
            type: "GET",
        }).then(res => {
            console.log(res);
            console.log(res[0].firstName);
            console.log("test getUserData route response");
            $("#user_name").text(`${res[0].firstName} ${res[0].lastName}`)
            $("#user_address").text(`${res[0].address}`)
            $("#user_email").text(`${res[0].email}`)
            $("#user_phone").text(`${res[0].phoneNumber}`)
        })
    }
    getUserData();
});