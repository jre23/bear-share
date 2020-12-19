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
    $(".reply-message").on("click", (e) => {
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
        if(productId){
            console.log("Have productID");
            $.ajax("/api/reply/" + toId + "/" + productId + "/" + messageId, {
                type: "GET"
            }).then(res => {
                console.log(res);
                let fullName = res.firstName + " " + res.lastName;
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
                    toId: res.toId,
                    toName: res.toName
                }
                let query = `
                  <div class="row" style="border:1px solid #ccc; padding: 10px;">
                  <div class="row" style="margin-bottom: 0;">
                      <div class="col s3 m2 l1">
                          <img src="${userProductInfo.imgPath}" width="75px" height="100px" onError="this.onerror=null;this.src='/img/missingPhoto.jpg';"
                              style="border:1px solid #ccc;">
                      </div>
                      <div class="col s4 m4 text-align-left">
                          <h5 style="margin-top:0;">${userProductInfo.title}</h5>
                          <p>${userProductInfo.category}</p>
                          <p>$ ${userProductInfo.price}</p>
                      </div>
                  </div>
                  <div class="row">
                      <form class="col s12">
                          <div class="row" style="margin-bottom:0; height:100;">
                              <div class="col s12">
                                  <textarea maxlength="500" id="textarea_message_product" placeholder="Write something to ${userProductInfo.toName}"
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
        }else{
            console.log("No productID");
            $.ajax("/api/reply/" + toId + "/" + messageId, {
                type: "GET"
            }).then(res => {
                console.log(res);
                let fullName = res.firstName + " " + res.lastName;
                console.log(fullName);
                const userProductInfo = {
                    userId: res.userId,
                    name: fullName,
                    toId: res.toId,
                    toName: res.toName
                }
                let query = `
                  <div class="row" style="border:1px solid #ccc; padding: 10px;">
                  <div class="row" style="margin-bottom: 0;">
                      <div class="col s12 m12 text-align-left">
                          <h5 style="margin-top:0;">Send a Message to ${userProductInfo.toName}</h5>
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
                          <button id="messageReplybtnWithoutProduct" data-toId="${userProductInfo.toId}" class="waves-effect waves-green btn">Send</button>
                          </div>
                          <div class="col">
                          <a href="/account/" class="waves-effect waves-green btn">Cancel</a>
                          </div>
                      </div>
                  </div>
              </div>`
    
                $(`#replyMessage_${res.messageId}`).html(query);
            });
        }
        
    });


    $(document).on("click", "#messageReplybtn", (e) => {
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
                "contents": contents,
                "toId": toId,
                "productId": productId
            }
        }).then(res => {

            if (res.toId == res.fromId) {
                alert("This is your product!! You can't send a message to yourself.");
                location.reload();
            } else {
                alert("Sent the message");
                location.reload();
            }
        });

    });

    $(document).on("click", "#messageReplybtnWithoutProduct", (e) => {
        e.preventDefault();
        // console.log($("#textarea_message_product").val());
        console.log($(e.target));
        let toId = $(e.target)[0].attributes[1].nodeValue;
        let contents = $("#textarea_message_product").val();
        console.log("toId===========");
        console.log(toId);
        console.log("contents");
        console.log(contents);
        $.ajax("/api/message/", {
            type: "POST",
            data: {
                "contents": contents,
                "toId": toId
            }
        }).then(res => {

            if (res.toId == res.fromId) {
                alert("This is your product!! You can't send a message to yourself.");
                location.reload();
            } else {
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

    $(".account_edit_btn").on("click", (event) => {
        event.preventDefault();
        console.log("test account edit button click");
        let hideBoolean = $("div .edit").attr("data-id");
        console.log(hideBoolean);
        if (hideBoolean === "hidden") {
            $("div .edit").removeClass("hide");
            $("div .edit").attr("data-id", "show");
        } else if (hideBoolean === "show") {
            $("div .edit").addClass("hide");
            $("div .edit").attr("data-id", "hidden");
        }
    });

    $(".editAccount").on("click", (event) => {
        console.log("test edit account button click");
        let makeSureEdit = confirm("Are you sure you want to edit your account?");
        if (!makeSureEdit) {
            event.preventDefault();
            $("div .edit").addClass("hide");
            return alert("Account not edited.");
        } else {
            let userData = [{
                firstName: $("#first_name_input").val().trim(),
                lastName: $("#last_name_input").val().trim(),
                phoneNumber: $("#mobile_number_input").val().trim(),
                address: $("#address_input").val().trim(),
                email: $("#email_input").val().trim(),
                password: $("#password_input").val().trim()
            }];
            let filterUserData = {};
            // if all inputs are empty, alert the user
            if (userData[0].firstName === "" && userData[0].lastName === "" && userData[0].phoneNumber === "" && userData[0].address === "" && userData[0].email === "" && userData[0].password === "") {
                return alert("All inputs were empty.");
            } else {
                userData.forEach((value, index) => {
                    for (let key in value) {
                        if (value[key] !== "") {
                            filterUserData[key] = value[key];
                        };
                    }
                });
            }
            updateUser(filterUserData);
        }
    });
    // call ajax put method to update user info
    const updateUser = (filterUserData) => {
        $.ajax("/api/users", {
                type: "PUT",
                data: {
                    filterUserData
                }
            })
            .then(data => {
                if (data === "users.email must be unique") {
                    alert("That email already exists! Please choose a different email.");
                } else {
                    alert("Account details successfully edited!")
                    location.replace("/account");
                }
            })
            .catch((e) => {
                console.log(e)
            });
    }

    //This renders the Past User Reviews
    //select review div to append reviews
    $(".getUserReviews").on("click", (event) => {
    let reviewDiv = $(".reviewsAbout");
    reviewDiv.empty();
    console.log($(".userData").data("id"));
        $.ajax("/api/users/reviewed/" + $(".userData").data("id"), {
            type: "GET"
            }).then(results => {
            let reviews = results;
            // console.log(results);
            //Setting commenter name
            //   <div class="col s12">
            for(let i = 0; i < reviews.length; i++){
                let reviewCard = `
                <div class="card" style="padding: 10px;">
                    <div class="card-content">
                        <p>Review of ${results[i].User.firstName} ${results[i].User.lastName}</p>
                        <form action="/api/user/reviews/delete/${results[i].id}" method="POST" class="right-align">
                            <button class="waves-effect waves-light btn_tab_message" style="height: 30px;" type="submit"><i class="fas fa-trash-alt"></i></button>
                        </form>
                        <p class="review_text">${results[i].comment}</p>

                    </div>
                    <div class="row">
                        <form action="/api/user/reviews/update/${results[i].id}" method="POST" class="col s12"> 
                            <label for="new_comment_${results[i].reviewerId}">Update Post</label>
                            <textarea placeholder="write a new comment" id="new_comment_${results[i].reviewerId}" type="text" name="comment" class="validate col s12"></textarea><br>
                            <button class="waves-effect waves-light btn_tab_message green" style="height: 30px;  margin-top:10px;" type="submit" href="#"><i class="fas fa-edit"></i></button>
                        </form>
                        </div>   
                    </div>
                </div>
            `
            
            reviewDiv.append(reviewCard);
            }
        }).catch(err => {
        let pTagNoResult = $("<p></p>");
        pTagNoResult.text("Server had an error getting the reviews for this user");
        reviewDiv.append(pTagNoResult);
        })
    });
});