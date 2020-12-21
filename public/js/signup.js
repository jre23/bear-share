// This selects the document and runs after it loads.
$(document).ready(function () {
  // Getting references to our form and input.
  const signUpForm = $(".signup");
  const firstNameInput = $("#first_name_input");
  const lastNameInput = $("#last_name_input");
  const phoneInput = $("#mobile_number_input");
  const addressInput = $("#address_input");
  const emailInput = $("#email_input");
  const passwordInput = $("#password_input");
  // When the signup button is clicked, we validate the email and password are not blank.
  signUpForm.on("submit", function (event) {
    // This prevents the default on the form submission.
    event.preventDefault();
    // This assigns userData with object filled with previously selected elements and cleans up the data.
    let userData = {
      firstName: firstNameInput.val().trim(),
      lastName: lastNameInput.val().trim(),
      phoneNumber: phoneInput.val().trim(),
      address: addressInput.val().trim(),
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };
    // This makes sure that the email, password, first and last name inputs are not empty.
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      return;
    }
    // Then this calls the signUpUser function with the data we just created.
    signUpUser(userData.firstName, userData.lastName, userData.phoneNumber, userData.address, userData.email, userData.password);
    // This resets the form with empty strings.
    firstNameInput.val("");
    lastNameInput.val("");
    phoneInput.val("");
    addressInput.val("");
    emailInput.val("");
    passwordInput.val("");
  });
  // This calls a post to the signup route "/api/signup". If successful, we are redirected to the login page which should reroute to the members page
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
        //This redirects the window to the "/login" route.
        window.location.replace("/login");
      })
      // If there's an error, handle it by throwing up an alert.
      .catch(handleLoginErr);
  }
  // This function handles the errors and alerts the user by adding text to the element with the msg class.
  function handleLoginErr(err) {
    $(".msg").text(err.responseJSON.name);
  }
});
