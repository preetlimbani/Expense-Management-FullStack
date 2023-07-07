const amountField = document.getElementById('amount');
const titleField = document.getElementById('title');
const categoryField = document.getElementById('category');
const descriptionField = document.getElementById('description');
const dateField = document.getElementById('date');
const submitBtn = document.getElementById('submitBtn');
const frequency = document.getElementById('frequency');
const day_of_weeks = document.getElementById('day_of_weeks');
const day_of_weeks_div = document.getElementById('day_of_week_div');
const message = document.getElementById('message');
const deletebtn = document.getElementById('deleteBtn');
const url = window.location.href.split('/');
const id = url[5]
var selectedWeekdays = []
var date = 0



document.addEventListener('DOMContentLoaded', (e) => {
    const apiUrl = `/expenses/api/schedule/${id}/`;
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
        date = data.start_date;
        fillDateTime()
        frequency.value = data.frequency;
        selectedWeekdays = data.day_of_week;
         if (frequency.value ===  "weekly")
         {
         var rowContainer = document.getElementById("day_of_week_div");
            fillWeekdays()
            rowContainer.style.display = "table-row";
         }
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
    const frequency_val = frequency.value;
    selectedWeekdays = []
    getSelectedWeekdays()


    fetch(`/expenses/api/schedule/${id}/`, {
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
                start_date:date,
                frequency:frequency_val,
                day_of_week:selectedWeekdays
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data){
            message.style.display='block';

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

    fetch(`/expenses/api/schedule/${id}/`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (response.ok) {
            window.location.href = 'http://127.0.0.1:8000/expenses/schedule/';
            } else {
            window.location.href = 'http://127.0.0.1:8000/expenses/schedule/';
            }
            })
        .then(data => {

        })
  });

function fillWeekdays() {
// Get all checkboxes with name "weekday"
var checkboxes = document.getElementsByName("weekday");

// Iterate through checkboxes and check/uncheck based on the selected weekdays
for (var i = 0; i < checkboxes.length; i++) {
if (selectedWeekdays.includes(checkboxes[i].value)) {
checkboxes[i].checked = true; // Check the checkbox
} else {
checkboxes[i].checked = false; // Uncheck the checkbox
}
}
}

function fillDateTime() {
var dateTimeValue = date.split('+');
dateField.value = dateTimeValue[0];
}

function getSelectedWeekdays() {
        // Get all checkboxes with name "weekday"
        var checkboxes = document.getElementsByName("weekday");
        // Iterate through checkboxes and check if they are selected
        for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
        selectedWeekdays.push(checkboxes[i].value);
        }
        }
}