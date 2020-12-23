// This selects the document and runs after it loads.
$(document).ready(() => {
    // This selects the class no_members_fixed_btn and sets the css display to none.
    $(".no_members_fixed_btn").css("display", "none");
    // This selects the class members_fixed_btn and sets the css display to block.
    $(".members_fixed_btn").css("display", "block");
    // This click handler is to make sure the user has chosen a category when posting an item.
    $(".testCat").on("click", event => {
        if ($(".validateCat").val() === null) {
            event.preventDefault();
            return alert("Please select a category!");
        }
    })
});