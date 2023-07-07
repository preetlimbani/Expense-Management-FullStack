const usernameField = document.querySelector('#usernameField');
const feedBackArea_user = document.querySelector('.invalid-feedback_user')
const emailField = document.querySelector('#emailField')
const feedBackArea_email = document.querySelector('.invalid-feedback_email')
const passwordField = document.querySelector('#password')
const passwordField2 = document.querySelector('#password2')
const feedBackArea_password = document.querySelector('.invalid-feedback_password')
let submitBtn1 = document.getElementById('submitBtn')
const form = document.querySelector('#Form')
const login = document.querySelector("#afterRegister")

passwordField2.addEventListener("keyup", (e) => {
    const password2Value = e.target.value;
    const passwordValue = passwordField.value;

    passwordField2.classList.remove("is-invalid");
    feedBackArea_password.style.display = 'none';

    if (password2Value.length > 0) {
        fetch("/authentication/validate-password/", {
            body: JSON.stringify({ password: passwordValue, password2: password2Value }),
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.password_error) {
                    submitBtn.disabled = true;
                    passwordField2.classList.add("is-invalid");
                    feedBackArea_password.style.display = 'block';
                    feedBackArea_password.innerHTML = `<p style="color:red">${data.password_error}</p>`
                } else {
                    submitBtn.removeAttribute('disabled');
                }
            });
    }

});

emailField.addEventListener("keyup", (e) => {
    const emailValue = e.target.value;

    emailField.classList.remove("is-invalid");
    feedBackArea_email.style.display = 'none';

    if (emailValue.length > 0) {
        fetch("/authentication/validate-email/", {
            body: JSON.stringify({ email: emailValue }),
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.email_error) {
                    submitBtn.disabled = true;
                    emailField.classList.add("is-invalid");
                    feedBackArea_email.style.display = 'block';
                    feedBackArea_email.innerHTML = `<p style="color:red">${data.email_error}</p>`
                }else {
                    submitBtn.removeAttribute('disabled');
                }
            });
    }

});

usernameField.addEventListener("keyup", (e) => {
    const usernameValue = e.target.value;
    usernameField.classList.remove("is-invalid");
    feedBackArea_user.style.display = 'none';

    if (usernameValue.length > 0) {
        fetch("/authentication/validate-username/", {
            body: JSON.stringify({ username: usernameValue }),
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.username_error) {
                    submitBtn.disabled = true;
                    usernameField.classList.add("is-invalid");
                    feedBackArea_user.style.display = 'block';
                    feedBackArea_user.innerHTML = `<p style="color:red">${data.username_error}</p>`
                }else {
                    submitBtn.removeAttribute('disabled');
                }
            });
    }

});

submitBtn1.addEventListener("click", (e) => {
    e.preventDefault()
    const username = usernameField.value;
    const email = emailField.value;
    const password = passwordField.value;

    fetch('/authentication/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email:email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success){
            form.style.display = 'none';
            login.style.display = 'block';

            }
        })
  });

