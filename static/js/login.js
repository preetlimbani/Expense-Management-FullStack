const usernameField = document.querySelector('#usernameField');
const passwordField = document.querySelector('#passwordField');
const submitBtn = document.querySelector('#submit');
const message = document.querySelector('#loginForm');

submitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const username = usernameField.value;
    const password = passwordField.value;

    fetch('/authentication/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {

               if (data.error){
            message.style.display = 'block';
            message.innerHTML = `<p style="color:red">${data.error}</p>`

            }
            else{
            // Store the JWT token in local storage
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);

            window.location.href = 'http://127.0.0.1:8000/';
            }
        })

  });