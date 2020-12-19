$(document).ready(function () {
    console.log("members JS");
    $(".no_members_fixed_btn").css("display", "none");
    $(".members_fixed_btn").css("display", "block");

    //select review div to append reviews
    let reviewDiv = $(".reviews");
    reviewDiv.empty();

    $.ajax("/api/postings/comments/" + $(".productId").data("id"), {
        type: "GET",
    })
        .then((results) => {
            console.log(results);
            let reviews = results;
            // console.log(results);
            for (let i = 0; i < reviews.length; i++) {
                let divCol = $("<div></div>");
                let divCard = $("<div></div>");
                let divCardContent = $("<div></div>");
                let pText = $("<p></p>");
                let divCardAction = $("<div></div>");
                let aUser = $("<a></a>");

                //Setting commenter name
                let commenter = results[i].User.firstName + " " + results[i].User.lastName;

                //set the class for element
                divCol.attr("class", "col s6");
                divCard.attr("class", "card");
                divCardContent.attr("class", "card-content");
                pText.attr("class", "review_text");
                divCardAction.attr("class", "card-action");

                pText.text(results[i].comment);
                aUser.text(commenter);

                aUser.attr("href", `../api/userInfo/${results[i].commenterId}`);


                reviewDiv.append(divCol);
                divCol.append(divCard);
                divCard.append(divCardContent);
                divCardContent.append(results[i].comment);
                divCard.append(divCardAction);
                divCardAction.append(aUser);
            }
        })
        .catch((err) => {
            let pTagNoResult = $("<p></p>");
            pTagNoResult.text("Server had an error getting the reviews for this product");
            reviewDiv.append(pTagNoResult);
        });



// Message Function 
$("#message_btn").on("click", (e) => {
  e.preventDefault();
  let id = $(e.target).data("id");
  console.log("id");
  let idArr = String(id).split(" ");
  let userId = idArr[0];
  let productId = idArr[1];
  console.log("userId");
  console.log(userId);
  console.log("productId");
  console.log(productId);
  const getProductData = () => {
    $.ajax("/api/product/" + userId +"/"+productId, {
        type: "GET"
    }).then(res => {
        console.log(res);
        let fullName = res.firstName +" "+res.lastName;
        const userProductInfo = {
          id: res.productId,
          productId: res.productId,
          title: res.productTitle,
          category: res.productCategory,
          price: res.productPrice,
          userId: res.userId,
          imgPath: res.productImgPath,
          name: fullName
        }
      let query = `
        <div class="row" style="border:1px solid #ccc; padding: 10px;">
        <div class="row" style="margin-bottom: 0;">
            <div class="col s3 m2 l1">
                <img src="${userProductInfo.imgPath}" width="75px" height="100px" onError="this.onerror=null;this.src='/img/missingPhoto.jpg';"
                    style="border:1px solid #ccc;">
            </div>
            <div class="col s4 m4">
                <h5 style="margin-top:0;">${userProductInfo.title}</h5>
                <p>${userProductInfo.category}</p>
                <p>$ ${userProductInfo.price}</p>
            </div>
        </div>
        <div class="row">
            <form class="col s12">
                <div class="row" style="margin-bottom:0; height:100;">
                    <div class="col s12">
                        <textarea maxlength="500" id="textarea_message_product" placeholder="Write something to ${userProductInfo.name}"
                            style="border:1px solid #ccc; padding:10px; margin-bottom:0; height:100px;"></textarea>
                    </div>
                </div>
            </form>
        </div>
            <div class="row">
                <div class="col">
                <button id="messageSendbtn" data-productId="${userProductInfo.productId}" data-userId="${userProductInfo.userId}" class="waves-effect waves-green btn">Send</button>
                </div>
                <div class="col">
                <a href="/product/${userProductInfo.productId}" class="waves-effect waves-green btn">Cancel</a>
                </div>
            </div>
        </div>
    </div>`
    
      $("#message_form").html(query);
    });
}

$(document).on("click","#messageSendbtn", (e) => {
  e.preventDefault();
  // console.log($("#textarea_message_product").val());

  let toId = $(e.target)[0].attributes[2].nodeValue;
  let productId = $(e.target)[0].attributes[1].nodeValue;
  let contents = $("#textarea_message_product").val();

    $.ajax("/api/message/", {
        type: "POST",
        data: {
          "contents" : contents,
          "toId" : toId,
          "productId" : productId
      }
    }).then(res => {
      
      if(res.toId == res.fromId){
        alert("This is your product!! You can't send a message to yourself.");
        location.reload();
      }else{
        alert("Sent the message");
        location.reload();
      }
    });
  
});

getProductData();


});
});