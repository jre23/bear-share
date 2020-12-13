$(document).ready(() => {

  // Getting references to our form and input
  const signUpForm = $("form.signup");
  const emailInput = $("input#email_input");

  //test line to take data from Form.
  signUpForm.on("submit", (e) => {
    e.preventDefault();

    console.log(emailInput.val().trim());

  });

});