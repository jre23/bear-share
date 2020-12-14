$(document).ready(function () {
  // Getting references to our form and input
  const signUpForm = $(".signup");
  const firstNameInput = $("#first_name_input");
  const lastNameInput = $("#last_name_input");
  const phoneInput = $("#mobile_number_input");
  const addressInput = $("#address_input");
  const emailInput = $("#email_input");
  const passwordInput = $("#password_input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function (event) {
    event.preventDefault();
    let userData = {
      firstName: firstNameInput.val().trim(),
      lastName: lastNameInput.val().trim(),
      phoneNumber: phoneInput.val().trim(),
      address: addressInput.val().trim(),
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      return;
    }
    console.log(userData);
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.firstName, userData.lastName, userData.phoneNumber, userData.address, userData.email, userData.password);
    firstNameInput.val("");
    lastNameInput.val("");
    phoneInput.val("");
    addressInput.val("");
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(firstName, lastName, phoneNumber, address, email, password) {
    $.post("/api/signup", {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        address: address,
        email: email,
        password: password
      })
      .then(function (data) {
        window.location.replace("/");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});