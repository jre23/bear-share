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
      console.log(results);
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
      aUser.text(results[i].commenterId)

      aUser.attr("href", `../api/userInfo/${results[i].commenterId}`)
      
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


// Message Function 
$("#message_btn").on("click", (e) => {
  e.preventDefault();
  let id = $(e.target).data("id");
  
  const getProductData = () => {
    $.ajax("/api/product/" + id, {
        type: "GET"
    }).then(res => {
        console.log(res.User);

        const productInfo = {
          id: res.id,
          title: res.title,
          category: res.category,
          price: res.ask_price,
          userId: res.userId,
          imgPath: res.image_paths
        }

        let fullName = res.User.firstName +" "+res.User.lastName;
        const userInfo = {
          id: res.User.id,
          name: fullName
        }
      let query = `
        <div class="row" style="border:1px solid #ccc; padding: 10px;">
        <div class="row" style="margin-bottom: 0;">
            <div class="col s3 m2 l1">
                <img src="${productInfo.imgPath}" width="75px" height="100px" alt="product image"
                    style="border:1px solid #ccc;">
            </div>
            <div class="col s4 m4">
                <h5 style="margin-top:0;">${productInfo.title}</h5>
                <p>${productInfo.category}</p>
                <p>$ ${productInfo.price}</p>
            </div>
        </div>
        <div class="row">
            <form class="col s12">
                <div class="row" style="margin-bottom:0; height:100;">
                    <div class="col s12">
                        <textarea maxlength="500" id="textarea_message_product" placeholder="Write something to ${userInfo.name}"
                            style="border:1px solid #ccc; padding:10px; margin-bottom:0; height:100px;"></textarea>
                    </div>
                </div>
            </form>
        </div>
            <div class="row">
                <div class="col">
                <button id="messageSendbtn" class="waves-effect waves-green btn">Send</button>
                </div>
                <div class="col">
                <a href="/product/${id}" class="waves-effect waves-green btn">Cancel</a>
                </div>
            </div>
        </div>
    </div>`
    
      $("#message_form").html(query);
    });

    $(document).on("click","#messageSendbtn", (e) => {
      e.preventDefault();
      console.log($("#textarea_message_product").val());
      console.log("TEST SEND Button");
    });
}
getProductData();
});
});