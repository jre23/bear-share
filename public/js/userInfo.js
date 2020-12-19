$(document).ready(function () {
    console.log("userInfo JS");

    $(".no_members_fixed_btn").css("display", "none");
    $(".members_fixed_btn").css("display", "block");
    
    //select review div to append reviews
    let reviewDiv = $(".reviewsAbout");
    reviewDiv.empty();
    console.log($(".userReviewed").data("id"));
    $.ajax("/api/users/reviews/" + $(".userReviewed").data("id"), {
      type: "GET"
    }).then(results => {
      let reviews = results;
      // console.log(results);
      //Setting commenter name
      
      for(let i = 0; i < reviews.length; i++){
      let divCol = $("<div></div>");
      let divCard = $("<div></div>");
      let divCardContent = $("<div></div>");
      let pText = $("<p></p>");
      let divCardAction = $("<div></div>");
      let aUser = $("<a></a>");

      //set the class for element
      divCol.attr("class", "col s6");
      divCard.attr("class", "card");
      divCardContent.attr("class", "card-content");
      pText.attr("class", "review_text");
      divCardAction.attr("class", "card-action");
      
      pText.text(results[i].comment)
      aUser.text(results[i].fromName);

      aUser.attr("href", `../userInfo/${results[i].reviewerId}`)
      
      reviewDiv.append(divCol);
      divCol.append(divCard);
      divCard.append(divCardContent);
      divCardContent.append(results[i].comment);
      divCard.append(divCardAction);
      divCardAction.append(aUser);
      }
}).catch(err => {
  let pTagNoResult = $("<p></p>");
  pTagNoResult.text("Server had an error getting the reviews for this user");
  reviewDiv.append(pTagNoResult);
})

  // Message Tab - userInfo.js 

$(document).on("click","#messageSendbtnOnUserInfo", (e) => {
  e.preventDefault();
  location.reload();
  alert("Sent the message");
  let toId = $(e.target)[0].attributes[1].nodeValue;
  let contentUserInfo = $("#msg_text_user_info").val();
  console.log($("#msg_text_user_info"));
  console.log("toId");
  console.log(toId);
  console.log("contents");
  console.log(contentUserInfo);
    $.ajax("/api/userInfo/message/", {
        type: "POST",
        data: {
          "contents" : contentUserInfo,
          "toId" : toId
      }
    }).then(res => {
      
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