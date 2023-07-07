const amountField = document.getElementById('amount');
const titleField = document.getElementById('title');
const categoryField = document.getElementById('category');
const descriptionField = document.getElementById('description');
const dateField = document.getElementById('date');
const checkbox = document.getElementById('schedule');
const submitBtn = document.getElementById('submitBtn');
const message = document.getElementById('message');
const schedule = false

submitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const amount = amountField.value;
    const title = titleField.value;
    const description = descriptionField.value;
    const category = categoryField.value;
    const date = dateField.value;
    const accessToken = localStorage.getItem('access_token');

    fetch('/expenses/api/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                amount: amount,
                title:title,
                description: description,
                category: category,
                date:date,
                is_schedule:schedule
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.id){
            message.style.display='block';

            }
        })
  });
