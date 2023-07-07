const apiUrl = window.location.href
const submitBtn = document.getElementById('submitBtn');
const passwordField = document.getElementById('passwordField');
const message = document.querySelector(".message")
const emailForm = document.getElementById('email_form')
let token = ""
let uidb64 = ""


document.addEventListener('DOMContentLoaded', async(e) => {
const data=await getData(e);
            if(data.headers.get('error')){
            message.style.display = 'block';
            email_form.style.display = 'none';
            debugger
            message.innerHTML = `<p style="color:red">${data.headers.get('error')}</p>`
            }
            else{
                token = data.headers.get('token')
                uidb64 = data.headers.get('uidb64')
            }
})
async function getData(e) {
e.preventDefault();
    const headers = {
        'Accept': '*',
        'Content-Type': '*',
    };
  const response = await fetch(apiUrl, headers);
  return response
}

submitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const password = passwordField.value;

    fetch('/authentication/password-reset/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: password,
                token:token,
                uidb64: uidb64
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.Message){
            message.style.display='block';
            message.innerHTML = `<p style="color:green">${data.Message}</p>`

            }
        })
  });