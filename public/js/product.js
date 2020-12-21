// This selects the document and runs after it loads.
$(document).ready(function () {
    // This selects the class no_members_fixed_btn and sets the css display to none.
    $(".no_members_fixed_btn").css("display", "none");
    // This selects the class members_fixed_btn and sets the css display to block.
    $(".members_fixed_btn").css("display", "block");
    // This assigns reviewDiv the selected element with the class .reviews
    let reviewDiv = $(".reviews");
    // This removes the children elements to the reviewDiv.
    reviewDiv.empty();
    // This call an ajax get request to "/api/postings/comments/:productId"
    $.ajax("/api/postings/comments/" + $(".productId").data("id"), {
        type: "GET",
    })
        // The callback uses the results to create an new card filled with product review information.
        .then((results) => {
            // This assigns reviews with the results.
            let reviews = results;
            // This loops through each review and creates a new card
            for (let i = 0; i < reviews.length; i++) {
              // This creates the new elements. 
              let divCol = $("<div></div>");
              let divCard = $("<div></div>");
              let divCardContent = $("<div></div>");
              let pText = $("<p></p>");
              let divCardAction = $("<div></div>");
              let aUser = $("<a></a>");
              // Setting commenter name.
              let commenter = results[i].User.firstName + " " + results[i].User.lastName;
              // This sets the class for each element.
              divCol.attr("class", "col s6");
              divCard.attr("class", "card");
              divCardContent.attr("class", "card-content");
              pText.attr("class", "review_text");
              divCardAction.attr("class", "card-action");
              // This adds the text to the p and a tags.
              pText.text(results[i].comment);
              aUser.text(commenter);
              // This adds the href to the anchor tag.
              aUser.attr("href", `../api/userInfo/${results[i].commenterId}`);
              // This appends the new card elements to the reviewDiv class.
              reviewDiv.append(divCol);
              divCol.append(divCard);
              divCard.append(divCardContent);
              divCardContent.append(results[i].comment);
              divCard.append(divCardAction);
              divCardAction.append(aUser);
            }
        })
        //This catches the error and adds an appends an error message to the reviewDiv.
        .catch((err) => {
            let pTagNoResult = $("<p></p>");
            pTagNoResult.text("Server had an error getting the reviews for this product");
            reviewDiv.append(pTagNoResult);
        });
  // This adds a click handler to the message_btn.
  $("#message_btn").on("click", (e) => {
    // This prevents the default of the event click.
    e.preventDefault();
    // This assigns id the data_id of the event target.
    let id = $(e.target).data("id");
    // This assigns idArr split form of String(id).
    let idArr = String(id).split(" ");
    // This assigns userId the first index of the idArr.
    let userId = idArr[0];
    // This assigns the productId the second index of the idArr.
    let productId = idArr[1];
    // This function calls an ajax get request to "/api/product/:userId/:productId"
    const getProductData = () => {
      $.ajax("/api/product/" + userId +"/"+productId, {
          type: "GET"
          // The callback then creates new html to render to the user.
      }).then(res => {
          // This assigns fullName the results of the first and last name.
          let fullName = res.firstName +" "+res.lastName;
          // This assigns userProductInfo an object with various keys with the results at the values.
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
          // This assigns query a template literal containing html that will be rendered back to the user.
          let query = `
          <div class="row" style="border:1px solid #ccc; padding: 10px;">
            <div class="row" style="margin-bottom: 0;">
              <div class="col s3 m2 l1">
                  <img src="${userProductInfo.imgPath}" width="75px" height="100px" onError="this.onerror=null;this.src='/img/missingPhoto.jpg';" style="border:1px solid #ccc;">
              </div>
              <div class="col s4 m4 left">
                  <h5 style="margin-top:0;">${userProductInfo.title}</h5>
                  <p>${userProductInfo.category}</p>
                  <p>$ ${userProductInfo.price}</p>
              </div>
            </div>
            <div class="row">
              <form class="col s12">
                <div class="row" style="margin-bottom:0; height:100;">
                  <div class="col s12">
                      <textarea maxlength="500" id="textarea_message_product" placeholder="Write something to ${userProductInfo.name}" style="border:1px solid #ccc; padding:10px; margin-bottom:0; height:100px;"></textarea>
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
          </div>`
        // Thus adds the html of query to the element with the id of message_form
        $("#message_form").html(query);
      });
  }
  // This adds a click handler to the messageSendbtn id
  $(document).on("click","#messageSendbtn", (e) => {
    // This prevents the default on the event click
    e.preventDefault();
    // This assigns toId the node value of the targets first child third attribute.
    let toId = $(e.target)[0].attributes[2].nodeValue;
    // This assigns productId the node value of the targets first child second attribute.
    let productId = $(e.target)[0].attributes[1].nodeValue;
    // This assigns contents the value of the textarea_message_product id
    let contents = $("#textarea_message_product").val();
      // This calls an ajax post request using data that was previously selected.
      $.ajax("/api/message/", {
          type: "POST",
          data: {
            "contents" : contents,
            "toId" : toId,
            "productId" : productId
        }
        //The callback checks if the messages is for their own product and alerts the user that they cannot send a message to themseleves or alerts that the message was sent. Then reloads the page.
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
  //This calls the getProductData function
  getProductData();
  });
});