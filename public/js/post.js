// // wait to attach our handlers until the DOM is fully loaded with document.ready
// $(document).ready(() => {
//     $(".no_members_fixed_btn").css("display", "none");
//     $(".members_fixed_btn").css("display", "block");

//     // this event listener is for when the user adds a post
//     $(".post_item").on("submit", event => {
//         // make sure to preventDefault on a submit event.
//         event.preventDefault();
//         // grab references to form inputs
//         const postTitle = $("#title_post").val().trim();
//         const postCategory = $("#bears_lists").val().trim();
//         const postPhotoOne = $("#file-upload_1").val().trim();
//         const postPhotoTwo = $("#file-upload_2").val().trim();
//         const postPhotoThree = $("#file-upload_3").val().trim();
//         const postPhotoFour = $("#file-upload_4").val().trim();
//         const postDescription = $("#description_post").val().trim();
//         const postPrice = $("#price_post").val().trim();
//         // not sure how to add multiple photos to the post yet so just using postPhotoOne for now
//         let newPost = {
//             title: postTitle,
//             description: postDescription,
//             image_paths: postPhotoOne,
//             ask_price: postPrice
//         }
//         console.log(newPost);
//         // send the POST request.
//         $.ajax("/api/postings", {
//             type: "POST",
//             data: newPost
//         }).then(() => { // redirect to main page to see all of the listings (maybe redirect to a page that has just this new listing?)
//             location.replace("/");
//         }).catch((e) => {
//             console.log(e)
//         });
//     });
// });
