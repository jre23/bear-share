// This selects the document and runs after it loads.
$(document).ready(() => {
    // Selects nessary classes and ids and assigns them to variables.
    const loginForm = $("form.login");
    const emailLogin = $("input#email_login");
    const passwordLogin = $("input#password_login");
    const alertPanel = $("#alert-panel");
    // This adds a submit handler on the loginForm.
    loginForm.on("submit", (e) => {
        // Prevents the default of the event submission. 
        e.preventDefault();
        // Creates an object that holds the email and password information
        const userData = {
            email: emailLogin.val().trim(),
            password: passwordLogin.val().trim(),
        };
        // Checks if the email and password have user inputs and returns if they don't
        if (!userData.email || !userData.password) {
            return;
        }
        // If we have an email and password we run the loginUser function and clear the form
        loginUser(userData.email, userData.password);
        //Resets the form with empty strings
        emailLogin.val("");
        passwordLogin.val("");
    });
    // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
    function loginUser(email, password) {
        $.post("/api/login", {
            email: email,
            password: password,
        })  // This replaces the window location to "/"
            .then(function () {
                window.location.replace("/");
            })
            // This catches errors that are thrown
            .catch(function (err) {
                if (err.status === 401) {
                    alertPanel.removeClass("hidden");
                    setTimeout(() => {
                        alertPanel.addClass("hidden");
                    }, 3500);
                }
            });
    }
});
