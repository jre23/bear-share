<<<<<<< HEAD
$(document).ready(function() {
    // Getting references to our form and inputs
    const loginForm = $(".login");
    const emailInput = $("#email");
    const passwordInput = $("#password");
  
    // When the form is submitted, we validate there's an email and password entered
    loginForm.on("submit", function(event) {
      event.preventDefault();
      const userData = {
        email: emailInput.val().trim(),
        password: passwordInput.val().trim()
      };
  
      if (!userData.email || !userData.password) {
        return;
      }
  
      // If we have an email and password we run the loginUser function and clear the form
      loginUser(userData.email, userData.password);
      emailInput.val("");
      passwordInput.val("");
    });
  
    // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
    function loginUser(email, password) {
      $.post("/api/login", {
        email: email,
        password: password
      })
        .then(function() {
          window.location.replace("/");
          // If there's an error, log the error
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  });
  
=======
$(document).ready(() => {
    const loginForm = $("form.login");
    const emailLogin = $("input#email_login");
    const passwordLogin = $("input#password_login");

    loginForm.on("submit", (e) => {
        e.preventDefault();

        const userData = {
            email: emailLogin.val().trim(),
            password: passwordLogin.val().trim()
        };

        console.log(userData);
        if (!userData.email || !userData.password) {
            return;
        }

        // If we have an email and password we run the loginUser function and clear the form
        loginUser(userData.email, userData.password);

        emailLogin.val("");
        passwordLogin.val("");
    });

    // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
    function loginUser(email, password) {
        $.post("/api/login", {
            email: email,
            password: password
        })
            .then(function () {
                window.location.replace("/members");
                // If there's an error, log the error
            })
            .catch(function (err) {
                console.log(err);
            });
    }

});
>>>>>>> 3b10e46d8f39e0966757ffc03366e7df7e05c5a8
