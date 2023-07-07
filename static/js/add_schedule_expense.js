const amountField = document.getElementById('amount');
const titleField = document.getElementById('title');
const categoryField = document.getElementById('category');
const descriptionField = document.getElementById('description');
const dateField = document.getElementById('date');
const submitBtn = document.getElementById('submitBtn');
const frequency = document.getElementById('frequency');
const day_of_weeks = document.getElementById('day_of_weeks');
const day_of_weeks_div = document.querySelector("#day_of_week_div");
const message = document.getElementById('message');
const messagefail = document.getElementById('messagefail');


submitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const amount = amountField.value;
    const title = titleField.value;
    const description = descriptionField.value;
    const category = categoryField.value;
    const date = dateField.value;
    const accessToken = localStorage.getItem('access_token');
    const frequency_val = frequency.value;
    var selectedWeekdays = [];
    getSelectedWeekdays()
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

    fetch('/expenses/api/schedule/', {
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
                start_date:date,
                frequency:frequency_val,
                day_of_week:selectedWeekdays
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data == "You have reached the maximum limit of your plan."){
            window.location.href = '/expenses/plan/'
            }
            if (data.id){
            message.style.display='block';
            }
            else{
            messagefail.style.display='block';
            }
        })
  });


function ShowInputField() {
    var rowContainer = document.getElementById("day_of_week_div");
    if (frequency.value === "weekly") {
        rowContainer.style.display = "table-row";
    } else {
        rowContainer.style.display = "none";
    }
}
