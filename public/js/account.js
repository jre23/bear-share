$(document).ready(() => {
    $(".no_members_fixed_btn").css("display", "none");
    $(".members_fixed_btn").css("display", "block");

    $('.tabs').tabs();
    $('.dropdown-trigger').dropdown({constrain_width: true});
});