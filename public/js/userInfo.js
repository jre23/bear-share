// This selects the document and runs after it loads
$(document).ready(function () {
    // This selects the class no_members_fixed_btn and sets the css display to none.
    $(".no_members_fixed_btn").css("display", "none");
    // This selects the class members_fixed_btn and sets the css display to block.
    $(".members_fixed_btn").css("display", "block");
    // This assigns reviewDiv to element that has the class reviewsAbout.
    let reviewDiv = $(".reviewsAbout");
    // This emptys the reviewDiv of its children elements.
    reviewDiv.empty();
    // This calls an ajax get request to "/api/users/reviews/:userReviewedId"
    $.ajax("/api/users/reviews/" + $(".userReviewed").data("id"), {
      type: "GET"
    })
      // The callback then creates new html that is rendered to the user.
      .then(results => {
        // This assigns reviews to the results.
        let reviews = results;
        // This loops through each review and appends a new card to reviewDiv.
        for(let i = 0; i < reviews.length; i++){
          // This assigns variables to create new elements.
          let divCol = $("<div></div>");
          let divCard = $("<div></div>");
          let divCardContent = $("<div></div>");
          let pText = $("<p></p>");
          let divCardAction = $("<div></div>");
          let aUser = $("<a></a>");
          // This sets the class for the elements
          divCol.attr("class", "col s6");
          divCard.attr("class", "card");
          divCardContent.attr("class", "card-content");
          pText.attr("class", "review_text");
          divCardAction.attr("class", "card-action");
          // This adds the text to the p and a tags
          pText.text(results[i].comment)
          aUser.text(results[i].fromName);
          // This adds a href to the a tag.
          aUser.attr("href", `../userInfo/${results[i].reviewerId}`)
          // This appends the card to the reviewDiv.
          reviewDiv.append(divCol);
          divCol.append(divCard);
          divCard.append(divCardContent);
          divCardContent.append(results[i].comment);
          divCard.append(divCardAction);
          divCardAction.append(aUser);
        }
      })
      // This catches the error and displays a message to the user.
      .catch(err => {
        let pTagNoResult = $("<p></p>");
        pTagNoResult.text("Server had an error getting the reviews for this user");
        reviewDiv.append(pTagNoResult);
      });
  //This adds a click handler to the messageSendbtnOnUserInfo Id
  $(document).on("click","#messageSendbtnOnUserInfo", (e) => {
    // This prevents the default on the event click.
    e.preventDefault();
    // This reloads the page.
    location.reload();
    // This alerts the user the message was sent.
    alert("Sent the message");
    // This assigns toId to the event target first child second attribute nodeValue.
    let toId = $(e.target)[0].attributes[1].nodeValue;
    // This assigns contentUserInfo the value of the msg_text_user_info value.
    let contentUserInfo = $("#msg_text_user_info").val();
    // This calls an ajax post request to "/api/userInfo/message/" with the data we just selected.
    $.ajax("/api/userInfo/message/", {
        type: "POST",
        data: {
          "contents" : contentUserInfo,
          "toId" : toId
        }
    })
      // The call back checks if the message is to the user and alerts the user that they can't send messages to themseleves or that the message sent. Then reloads the location.
      .then(res => {
        if(res.toId == res.fromId){
          alert("You can't send a message to yourself.");
          location.reload();
        }else{
          alert("Sent the message");
          location.reload();
        }
      });
  });
});