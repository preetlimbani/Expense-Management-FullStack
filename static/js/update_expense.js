const amountField = document.getElementById('amount');
const titleField = document.getElementById('title');
const categoryField = document.getElementById('category');
const descriptionField = document.getElementById('description');
const dateField = document.getElementById('date');
const checkbox = document.getElementById('schedule');
const submitBtn = document.getElementById('submitBtn');
const message = document.getElementById('message');
const deletebtn = document.getElementById('deleteBtn');
const url = window.location.href.split('/');
const id = url[4]
console.log(id)
let schedule = false


document.addEventListener('DOMContentLoaded', (e) => {
    const apiUrl = `/expenses/api/${id}/`;
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
        titleField.value = data.title;
        descriptionField.value = data.description;
        const categorySelect = document.getElementById('category');
        const selectedCategoryOption = Array.from(categorySelect.options).find(option => option.text === data.category);
        if (selectedCategoryOption) {
            selectedCategoryOption.selected = true;
        }
        dateField.value = data.date;
        schedule = data.is_schedule;
        }
         )
  });



submitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const amount = amountField.value;
    const title = titleField.value;
    const description = descriptionField.value;
    const category = categoryField.value;
    const date = dateField.value;
    const accessToken = localStorage.getItem('access_token');

    fetch(`/expenses/api/${id}/`, {
            method: 'PATCH',
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
            message.style.display = 'block';

            }
        })
  });

deleteBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const amount = amountField.value;
    const title = titleField.value;
    const description = descriptionField.value;
    const category = categoryField.value;
    const date = dateField.value;
    const accessToken = localStorage.getItem('access_token');

    fetch(`/expenses/api/${id}/`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (response.ok) {
            window.location.href = 'http://127.0.0.1:8000/';
            } else {
            window.location.href = 'http://127.0.0.1:8000/';
            }
            })
        .then(data => {

        })
  });
