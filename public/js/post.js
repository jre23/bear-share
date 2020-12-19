// wait to attach our handlers until the DOM is fully loaded with document.ready
$(document).ready(() => {
    $(".no_members_fixed_btn").css("display", "none");
    $(".members_fixed_btn").css("display", "block");

    // this click handler is to make sure the user has chosen a category when posting an item
    $(".testCat").on("click", event => {
        if ($(".validateCat").val() === null) {
            event.preventDefault();
            return alert("Please select a category!");
        }
    })
});