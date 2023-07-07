const amountField = document.getElementById('amount');const categoryField = document.getElementById('category');
const submitBtn = document.getElementById('submitBtn');
const message = document.getElementById('message');
const messagefail = document.getElementById('messagefail');

submitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const amount = amountField.value;
    const category = categoryField.value;
    const accessToken = localStorage.getItem('access_token');

    fetch('/expenses/api/month/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                amount: amount,
                category: category,
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.remaining){
            message.style.display = 'block';
            }
            if(data == "Category already exists for this user."){
            messagefail.style.display = 'block';
            }
        })
  });
