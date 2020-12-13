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