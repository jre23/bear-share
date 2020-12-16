$(document).ready(function () {
    console.log("members JS");
    $(".no_members_fixed_btn").css("display", "none");
    $(".members_fixed_btn").css("display", "block");


    //select review div to append reviews
    let reviewDiv = $(".reviews");
    reviewDiv.empty();
    
    $.ajax("/api/postings/comments/" + $(".productId").data("id"), {
      type: "GET"
    }).then(results => {
      let reviews = results;
      
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
      aUser.text(results[i].UserId)

      aUser.attr("href", `api/userInfo/${results[i].UserId}`)
      
      reviewDiv.append(divCol);
      divCol.append(divCard);
      divCard.append(divCardContent);
      divCardContent.append(results[i].comment);
      divCard.append(divCardAction);
      divCardAction.append(aUser);
      }
}).catch(err => {
  let pTagNoResult = $("<p></p>");
  pTagNoResult.text("Server had an error getting the reviews for this product");
  reviewDiv.append(pTagNoResult);
})

});