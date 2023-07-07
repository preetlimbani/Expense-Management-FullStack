const emailField = document.querySelector('#emailField')
const submitBtn1 = document.querySelector('#submitBtn')
const feedBackArea_email = document.querySelector('.invalid-feedback_email')


submitBtn1.addEventListener("click", async(e) => {
    e.preventDefault();
    const emailValue = emailField.value;
    const data1 = { email: emailValue }
const data=await getData(data1,e);
            if (data.success) {
                        feedBackArea_email.style.display = 'block';
                        feedBackArea_email.innerHTML = `<p style="color:green">${data.success}</p>`
                    }
             else{

                feedBackArea_email.style.display = 'block';
                feedBackArea_email.innerHTML = `<p style="color:red">${data.error}</p>`

     }

});


async function getData(data,e) {
e.preventDefault();
  const response = await fetch('/authentication/request-reset-email/', {
            method: "POST",
             headers: {"Content-type": "application/json; charset=UTF-8"},

            body: JSON.stringify(data),
        });
  const jsonData = await response.json();
  return jsonData
}