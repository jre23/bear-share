// This selects the document and runs after it loads
$(document).ready(() => {
    // This selects the class no_members_fixed_btn and sets the css display to none.
    $(".no_members_fixed_btn").css("display", "none");
    // This selects the class members_fixed_btn and sets the css display to block.
    $(".members_fixed_btn").css("display", "block");
    // This selects the class tabs and runs the tabs method.
    $(".tabs").tabs();
    // This selects the class dropdown-trigger and runs the dropdown method and changes the constain_width to true.
    $(".dropdown-trigger").dropdown({
        constrain_width: true,
    });
    // This event listener is for when the user is logged in, in their account page, under the selling tab, and wants to delete an item
    $(".endItem").on("click", (event) => {
        // Prevents the event default of the click.
        event.preventDefault();
        // Assigns postingId the value of the data-id attribute.
        let postingId = event.target.getAttribute("data-id");
        // This grabs the number out of the string and changes the data type to a number.
        postingId = parseInt(postingId);
        // This sends a confirm the user making sure they want to delete the item they selected.
        let makeSureDelete = confirm("Are you sure you want to delete your item?");
        // This checks what the user clicked on the confirm. If they did not confirm then they are alerted with the message "Item not deleted".
        if (!makeSureDelete) {
            return alert("Item not deleted.");
        } else {
            // Else an ajax delete request is sent to "/api/posting/:id"
            $.ajax("/api/postings/" + postingId, {
                    type: "DELETE",
                })
                // The call back checks if the item was found and alerts the user if the item was deleted or not found.
                .then((res) => {
                    if (res === 0) {
                        return alert("Item to delete not found!");
                    } else {
                        alert("Item deleted!");
                        location.reload();
                    }
                })
                // This console logs the errors that are thrown back.
                .catch((e) => {
                    console.log(e);
                });
        }
    });
    // This selects the id "file" and on change runs a function that subits an element with the id "pp-form".
    document.getElementById("file").onchange = function () {
        document.getElementById("pp-form").submit();
    };
    // This selects the class reply-message on the message tab on the account page and adds a click handler. 
    $(".reply-message").on("click", (e) => {
        // This prevents the default of the event click. 
        e.preventDefault();
        // This assigns differend data ids to each variable
        let toId = $(e.target).data("id");
        let productId = $(e.target).data("productId");
        let messageId = $(e.target).data("messageId");
        // This checks if the productId is true
        if(productId){
            // Then does an ajax get request to "/api/reply/:toId/:productId/:messageId"
            $.ajax("/api/reply/" + toId + "/" + productId + "/" + messageId, {
                type: "GET"
            }).then(res => {
                // Assigns fullName the first name and last name of the results
                let fullName = res.firstName + " " + res.lastName;
                // Assigns userProductInfo an object with the various keys with the results as values.
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
                // Assigns query a template literal that creates the html of the message form
                let query = `
                <div class="row" style="border:1px solid #ccc; padding: 10px;">
                    <div class="row" style="margin-bottom: 0;">
                        <div class="col s3 m2 l1">
                            <img src="${userProductInfo.imgPath}" width="75px" height="100px" onError="this.onerror=null;this.src='/img/missingPhoto.jpg';" style="border:1px solid #ccc;">
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
                                    <textarea maxlength="500" id="textarea_message_product" placeholder="Write something to ${userProductInfo.toName}" style="border:1px solid #ccc; padding:10px; margin-bottom:0; height:100px;"></textarea>
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
                </div>`
                // Runs the jQuery .html method on the selected id replyMessage_ + results.messageId
                $(`#replyMessage_${res.messageId}`).html(query);
            });
        }else{
            // Else runs an ajax get request to "/api/reply/:toId/:messageId"
            $.ajax("/api/reply/" + toId + "/" + messageId, {
                type: "GET"
            }).then(res => {
                // Assigns fullName the results of the firstName and lastName
                let fullName = res.firstName + " " + res.lastName;
                // assigns userProductInfo an object with various keys and associated result values
                const userProductInfo = {
                    userId: res.userId,
                    name: fullName,
                    toId: res.toId,
                    toName: res.toName
                }
                // Assigns query a template literal that creates the html of the message form
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
                                    <textarea maxlength="500" id="textarea_message_product" placeholder="Write something here!!" style="border:1px solid #ccc; padding:10px; margin-bottom:0; height:100px;"></textarea>
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
                </div>`
                // Runs the jQuery .html method on the selected id replyMessage_ + results.messageId
                $(`#replyMessage_${res.messageId}`).html(query);
            });
        }
    });
    // This adds a click handler on the messageReplybtn Id
    $(document).on("click", "#messageReplybtn", (e) => {
        //This prevents the default on the event click
        e.preventDefault();
        // This assigns each variable with need info from the target nodes and the contents of the textarea_message_product Id
        let toId = $(e.target)[0].attributes[2].nodeValue;
        let productId = $(e.target)[0].attributes[1].nodeValue;
        let contents = $("#textarea_message_product").val();
        // This does an ajax post request to "/api/message/" with the data object containing contents, toId, and productId.
        $.ajax("/api/message/", {
            type: "POST",
            data: {
                "contents": contents,
                "toId": toId,
                "productId": productId
            }
            // The callback does a check who the message was for and alerts the user that they cannot send messages to themselves or message was sent then reloads the page.
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
    // This adds a click handler on the messageReplybtnWithoutProduct Id.
    $(document).on("click", "#messageReplybtnWithoutProduct", (e) => {
        //This prevents the default on the event click
        e.preventDefault();
        // This assigns the variables with node information and the contents of the textarea_message_product Id.
        let toId = $(e.target)[0].attributes[1].nodeValue;
        let contents = $("#textarea_message_product").val();
        // Then runs an ajax post request to "/api/message/" with the data object containing contents, and toId.
        $.ajax("/api/message/", {
            type: "POST",
            data: {
                "contents": contents,
                "toId": toId
            }
            // The callback does a check who the message was for and alerts the user that they cannot send messages to themselves or message was sent then reloads the page.
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
    // This adds a click handler on the class delete-message on the message tab on account page
    $(".delete-message").on("click", (e) => {
        // This prevents the default on the event click
        e.preventDefault();
        // This assigns the id variable with the event target data id.
        let id = $(e.target).data("id");
        // This assigns questionDelete a confirm message.
        let questionDelete = confirm("Are you sure you want to delete the message?");
        // This checks if the confirm was not clicked.
        if (!questionDelete) {
            // This alerts the user that the message was not deleted.
            return alert("Message not deleted.");
        } else {
            // This sends an ajax delete request to "/api/messages/:id".
            $.ajax("/api/messages/" + id, {
                    type: "DELETE",
                    // The callback checks if the message was found and alerts the user if it was not found or that the message was deleted. Then reloads the page.
                }).then((res) => {
                    if (res === 0) {
                        return alert("Message to delete not found!");
                    } else {
                        alert("Message deleted!");
                        location.reload();
                    }
                })
                // This console logs the error that was thrown.
                .catch((e) => {
                    console.log(e);
                });
        }
    })
    // This adds a click handler on the account_edit_btn class.
    $(".account_edit_btn").on("click", (event) => {
        // This prevents the default on the event click.
        event.preventDefault();
        // This assigns hideBoolean the div class with .edit with the attribute data-id.
        let hideBoolean = $("div .edit").attr("data-id");
        // This checks if the hideBoolean is equal to hidden
        if (hideBoolean === "hidden") {
            // Then removes the class hide on the div with the class .edit
            $("div .edit").removeClass("hide");
            // Then changes the data-id attribute to show on the div with the class .edit
            $("div .edit").attr("data-id", "show");
            //This checks if the hideBoolean is equal to show
        } else if (hideBoolean === "show") {
            // Then adds the class hide on the div with the class .edit
            $("div .edit").addClass("hide");
            // Then changes the data-id attribute to show on the div with the class .edit
            $("div .edit").attr("data-id", "hidden");
        }
    });
    // This adds a click handler on the editAccount class.
    $(".editAccount").on("click", (event) => {
        // This assigns makeSureEdit a confirm message
        let makeSureEdit = confirm("Are you sure you want to edit your account?");
        // This checks if the confirm was not clicked then prevents default on the event, the adds hide to the class to the div with the class edit
        if (!makeSureEdit) {
            event.preventDefault();
            $("div .edit").addClass("hide");
            return alert("Account not edited.");
            // This assigns userData with an array holding an object with various keys and selected ids with cleaned up data as values.
        } else {
            let userData = [{
                firstName: $("#first_name_input").val().trim(),
                lastName: $("#last_name_input").val().trim(),
                phoneNumber: $("#mobile_number_input").val().trim(),
                address: $("#address_input").val().trim(),
                email: $("#email_input").val().trim(),
                password: $("#password_input").val().trim()
            }];
            //This initializes the filterUserData object
            let filterUserData = {};
            // if all inputs are empty, alert the user
            if (userData[0].firstName === "" && userData[0].lastName === "" && userData[0].phoneNumber === "" && userData[0].address === "" && userData[0].email === "" && userData[0].password === "") {
                return alert("All inputs were empty.");
            } else {
                // This loops through the userData array and loops through each key and adds a new key to the filterUserData object.
                userData.forEach((value, index) => {
                    for (let key in value) {
                        if (value[key] !== "") {
                            filterUserData[key] = value[key];
                        };
                    }
                });
            }
            // This runs the updateUser function with the filterUserData object
            updateUser(filterUserData);
        }
    });
    // This function calls an ajax put method to update user info
    const updateUser = (filterUserData) => {
        $.ajax("/api/users", {
                type: "PUT",
                data: {
                    filterUserData
                }
            })
            // This callback checks if the data is unique and alerts the user if the email already exists or the account was successfully edited.
            .then(data => {
                if (data === "users.email must be unique") {
                    alert("That email already exists! Please choose a different email.");
                } else {
                    alert("Account details successfully edited!")
                    location.replace("/account");
                }
            })
            // This catchs any errors and console logs the error that was thrown.
            .catch((e) => {
                console.log(e)
            });
    }
    // This renders the past user reviews and selects review div to append reviews by adding a click handler to the class getUserReviews.
    $(".getUserReviews").on("click", (event) => {
        // This assigns reviewDiv the selected elements with the class reviewsAbout.
        let reviewDiv = $(".reviewsAbout");
        // This removes all children elements to the selected class.
        reviewDiv.empty();
        // This calls an ajax get request to "/api/users/reviewed/:userId".
        $.ajax("/api/users/reviewed/" + $(".userData").data("id"), {
            type: "GET"
            // The callback then creates new html to display each review that was returned.
            }).then(results => {
                // This assigns reviews to results.
                let reviews = results;
                // This loops through each review and creates a new html card to display adding a delete and update submit form
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
            //Then appends the reviewCard to the reviewDiv
            reviewDiv.append(reviewCard);
            }
            //This catches any errors and displays the error to the user.
        }).catch(err => {
            let pTagNoResult = $("<p></p>");
            pTagNoResult.text("Server had an error getting the reviews for this user");
            reviewDiv.append(pTagNoResult);
        });
    });
});