const apiUrl = window.location.href
const submitBtn = document.getElementById('submitBtn');
const passwordField = document.getElementById('passwordField');
const success_message = document.querySelector("#success")
const fail_message = document.querySelector("#fail")
const emailForm = document.getElementById('email_form')


document.addEventListener('DOMContentLoaded', async(e) => {
const data=await getData(e);
            if(data.headers.get('Success')){
            success_message.style.display = 'block';
            }
            else{
            fail_message.style.display = 'block';
}})
async function getData(e) {
e.preventDefault();
    const headers = {
        'Accept': '*',
        'Content-Type': '*',
    };
  const response = await fetch(apiUrl, headers);
  return response
}
