const amountField = document.getElementById('amount');
const categoryField = document.getElementById('category');
const submitBtn = document.getElementById('submitBtn');
const message = document.getElementById('message');
const deletebtn = document.getElementById('deleteBtn');
const url = window.location.href.split('/');
const id = url[5]

document.addEventListener('DOMContentLoaded', (e) => {
    const apiUrl = `/expenses/api/month/${id}/`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    };

    fetch(apiUrl, {
            headers
        })
        .then(response => response.json())
        .then(data => {
        amountField.value = data.amount;
        const categorySelect = document.getElementById('category');
        const selectedCategoryOption = Array.from(categorySelect.options).find(option => option.text === data.category);
        if (selectedCategoryOption) {
            selectedCategoryOption.selected = true;
        }
        }
         )
  });

submitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const amount = amountField.value;
    const category = categoryField.value;
    const accessToken = localStorage.getItem('access_token');

    fetch(`/expenses/api/month/${id}/`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                amount: amount,
                category: category
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success){
            message.style.display = 'block';

            }
        })
  });

deleteBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const amount = amountField.value;
    const category = categoryField.value;
    const accessToken = localStorage.getItem('access_token');

    fetch(`/expenses/api/month/${id}/`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (response.ok) {
            window.location.href = 'http://127.0.0.1:8000/expenses/month';
            } else {
            window.location.href = 'http://127.0.0.1:8000/expenses/month';
            }
            })
        .then(data => {

        })
  });