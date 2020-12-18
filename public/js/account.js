$(document).ready(() => {
    $(".no_members_fixed_btn").css("display", "none");
    $(".members_fixed_btn").css("display", "block");

    $(".tabs").tabs();
    $(".dropdown-trigger").dropdown({
        constrain_width: true,
    });

    // this event listener is for when the user is logged in, in their account page, under the selling tab, and wants to delete an item
    $(".endItem").on("click", (event) => {
        event.preventDefault();
        let postingId = event.target.getAttribute("data-id");
        postingId = parseInt(postingId);
        console.log(event.target);
        console.log(postingId);
        let makeSureDelete = confirm("Are you sure you want to delete your item?");
        if (!makeSureDelete) {
            return alert("Item not deleted.");
        } else {
            $.ajax("/api/postings/" + postingId, {
                    type: "DELETE",
                })
                .then((res) => {
                    console.log(res);
                    console.log("test log after ajax to api/postings");
                    if (res === 0) {
                        return alert("Item to delete not found!");
                    } else {
                        alert("Item deleted!");
                        location.reload();
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    });

    document.getElementById("file").onchange = function () {
        document.getElementById("pp-form").submit();
    };

    // Message Tab on Account Page
    $(".reply-message").on("click", (e) =>{
        e.preventDefault();
        let toId = $(e.target).data("id");
        let productId = $(e.target).data("productId");
        let messageId = $(e.target).data("messageId");
        console.log("toId");
        console.log(toId);
        console.log("productId");
        console.log(productId);
        console.log("messageId");
        console.log(messageId);
        $.ajax("/api/reply/" + toId +"/"+productId +"/"+messageId, {
            type: "GET"
        }).then(res => {
            console.log(res);
            let fullName = res.firstName +" "+res.lastName;
            console.log(fullName);
            const userProductInfo = {
                id: res.productId,
                productId: res.productId,
                title: res.productTitle,
                category: res.productCategory,
                price: res.productPrice,
                userId: res.userId,
                imgPath: res.productImgPath,
                name: fullName,
                toId: res.toId
              }
            let query = `
              <div class="row" style="border:1px solid #ccc; padding: 10px;">
              <div class="row" style="margin-bottom: 0;">
                  <div class="col s3 m2 l1">
                      <img src="${userProductInfo.imgPath}" width="75px" height="100px" alt="product image"
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
                              <textarea maxlength="500" id="textarea_message_product" placeholder="Write something here!!"
                                  style="border:1px solid #ccc; padding:10px; margin-bottom:0; height:100px;"></textarea>
                          </div>
                      </div>
                  </form>
              </div>
                  <div class="row">
                      <div class="col">
                      <button id="messageReplybtn" data-productId="${userProductInfo.productId}" data-toId="${userProductInfo.toId}" class="waves-effect waves-green btn">Send</button>
                      </div>
                      <div class="col">
                      <a href="/account/" class="waves-effect waves-green btn">Cancel</a>
                      </div>
                  </div>
              </div>
          </div>`
          
            $(`#replyMessage_${res.messageId}`).html(query);
        });
    });


    $(document).on("click","#messageReplybtn", (e) => {
        e.preventDefault();
        // console.log($("#textarea_message_product").val());
        console.log($(e.target));
        let toId = $(e.target)[0].attributes[2].nodeValue;
        let productId = $(e.target)[0].attributes[1].nodeValue;
        let contents = $("#textarea_message_product").val();
        console.log("toId===========");
        console.log(toId);
        console.log("productId");
        console.log(productId);
        console.log("contents");
        console.log(contents);
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

    // Message Tab on Account Page
    $(".delete-message").on("click", (e) => {
        e.preventDefault();
        let id = $(e.target).data("id");
        console.log(id);
        let questionDelete = confirm("Are you sure you want to delete the message?");
        if (!questionDelete) {
            return alert("Message not deleted.");
        } else {
            $.ajax("/api/messages/" + id, {
                    type: "DELETE",
                }).then((res) => {
                    if (res === 0) {
                        return alert("Message to delete not found!");
                    } else {
                        alert("Message deleted!");
                        location.reload();
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    })

});