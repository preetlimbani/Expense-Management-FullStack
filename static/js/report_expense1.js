var chart1 = document.getElementById("myPieChart").getContext("2d");
var chart2 = document.getElementById("myBarChart").getContext("2d");
const MonthBtn = document.getElementById('MonthSubmitBtn');
const MonthDropdown = document.getElementById('month_dropdown');
const YearBtn = document.getElementById('YearSubmitBtn');
const YearDropdown = document.getElementById('year_dropdown');
const CustomBtn = document.getElementById('CustomSubmitBtn');
const chartContainer = document.getElementById('chartContainer');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const monthclosemodals_btn = document.querySelector('.close_modals_month');
const yearclosemodals_btn = document.querySelector('.close_modals_year');
const customclosemodals_btn = document.querySelector('.close_modals_custom');
let myChart = null
let myChart1 = null


YearBtn.addEventListener('click',populateYears())

// Function to populate the year dropdown
function populateYears() {
var select = document.getElementById("year_dropdown");
var currentYear = new Date().getFullYear();
var startYear = 1900; // Change this to set the start year

for (var i = currentYear; i >= startYear; i--) {
var option = document.createElement("option");
option.text = i;
select.add(option);
}
}

MonthBtn.addEventListener('click', (e) => {

    e.preventDefault()

    const apiUrl = '/expenses/api/v2/month/report/';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    };
    const month_value = MonthDropdown.value;

    fetch(apiUrl, {
            method: "POST",
            headers,
            body: JSON.stringify({month : month_value}),
        })
        .then(response => response.json())
        .then(data => {
        if (data){
        monthclosemodals_btn.click();
        chartContainer.style.display = 'block';
        }
          // Group the amounts by category
    var categoryAmounts = {};
data.forEach(function(item) {
    var categoryName = item.category__name;
    if (categoryAmounts[categoryName]) {
        categoryAmounts[categoryName] += item.amounts;
    } else {
        categoryAmounts[categoryName] = item.amounts;
    }
});

// Extract the unique category names and aggregated amounts
var categoryNames = Object.keys(categoryAmounts);
var amounts = Object.values(categoryAmounts);

if (myChart != null){
        myChart.destroy()
    }

// Create the pie chart
myChart = new Chart(chart1, {
    type: 'doughnut',
    data: {
        labels: categoryNames,
        datasets: [{
            data: amounts,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        title: {
            display: true,
            text: 'Category-wise Amount Distribution'
        }
    }
});

var weeks = data.map(function(item) {

    return item.week;

});


// Group the amounts by week

var amountsByWeek = {};

data.forEach(function(item) {

    if (amountsByWeek[item.week]) {

        amountsByWeek[item.week] += item.amounts;

    } else {

        amountsByWeek[item.week] = item.amounts;

    }

});
// Extract the unique weeks and aggregated amounts
var label = Object.keys(amountsByWeek);
var aggregatedAmounts = Object.values(amountsByWeek);

if (myChart1 != null){
    myChart1.destroy()
}
myChart1 = new Chart(chart2, {
    type: 'bar',
    data: {
        labels: label,
        datasets: [{
            label: 'Amount',
            data: aggregatedAmounts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
})

        })
    })


YearBtn.addEventListener('click', (e) => {
    const apiUrl = '/expenses/api/v2/year/report/';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    };
    const year_value = year_dropdown.value;

    fetch(apiUrl, {
            method: "POST",
            headers,
            body: JSON.stringify({year : year_value}),
        })
        .then(response => response.json())
        .then(data => {
        if (data){
        yearclosemodals_btn.click();
        chartContainer.style.display = 'block';
        }

      // Group the amounts by category
    var categoryAmounts = {};
data.forEach(function(item) {
    var categoryName = item.category__name;
    if (categoryAmounts[categoryName]) {
        categoryAmounts[categoryName] += item.amounts;
    } else {
        categoryAmounts[categoryName] = item.amounts;
    }
});

// Extract the unique category names and aggregated amounts
var categoryNames = Object.keys(categoryAmounts);
var amounts = Object.values(categoryAmounts);

if (myChart != null){
        myChart.destroy()
    }

// Create the pie chart
myChart = new Chart(chart1, {
    type: 'doughnut',
    data: {
        labels: categoryNames,
        datasets: [{
            data: amounts,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        title: {
            display: true,
            text: 'Category-wise Amount Distribution'
        }
    }
});

var weeks = data.map(function(item) {

    return item.month;

});


// Group the amounts by week

var amountsByMonth = {};

data.forEach(function(item) {

    if (amountsByMonth[item.month]) {

        amountsByMonth[item.month] += item.amounts;

    } else {

        amountsByMonth[item.month] = item.amounts;

    }

});
// Extract the unique weeks and aggregated amounts
var label = Object.keys(amountsByMonth);
var aggregatedAmounts = Object.values(amountsByMonth);

if (myChart1 != null){
    myChart1.destroy()
}
// Create the chart
myChart1 = new Chart(chart2, {
    type: 'bar',
    data: {
        labels: label,
        datasets: [{
            label: 'Amount',
            data: aggregatedAmounts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
})


        })
    })

YearBtn.addEventListener('click',populateYears())

// Function to populate the year dropdown
function populateYears() {
var select = document.getElementById("year_dropdown");
var currentYear = new Date().getFullYear();
var startYear = 1900; // Change this to set the start year

for (var i = currentYear; i >= startYear; i--) {
var option = document.createElement("option");
option.text = i;
select.add(option);
}
}


CustomBtn.addEventListener('click', (e) => {
    const apiUrl = '/expenses/api/v2/custom/report/';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    };
    const body = JSON.stringify({
            start_date : startDate.value,
            end_date : endDate.value,
            })

    fetch(apiUrl, {
            method: "POST",
            headers,
            body
        })
        .then(response => response.json())
        .then(data => {

        if (data){
        customclosemodals_btn.click();
        chartContainer.style.display = 'block';
        }

      // Group the amounts by category
    var categoryAmounts = {};
data.forEach(function(item) {
    var categoryName = item.category__name;
    if (categoryAmounts[categoryName]) {
        categoryAmounts[categoryName] += item.amounts;
    } else {
        categoryAmounts[categoryName] = item.amounts;
    }
});

// Extract the unique category names and aggregated amounts
var categoryNames = Object.keys(categoryAmounts);
var amounts = Object.values(categoryAmounts);

if (myChart != null){
        myChart.destroy()
    }

// Create the pie chart
myChart = new Chart(chart1, {
    type: 'doughnut',
    data: {
        labels: categoryNames,
        datasets: [{
            data: amounts,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        title: {
            display: true,
            text: 'Category-wise Amount Distribution'
        }
    }
});
if (data[0]){
if (data[0].week){
// Extract the weeks and amounts from the data

var weeks = data.map(function(item) {

    return item.week;

});


// Group the amounts by week

var amountsByWeek = {};

data.forEach(function(item) {

    if (amountsByWeek[item.week]) {

        amountsByWeek[item.week] += item.amounts;

    } else {

        amountsByWeek[item.week] = item.amounts;

    }

});
// Extract the unique weeks and aggregated amounts
var label = Object.keys(amountsByWeek);
var aggregatedAmounts = Object.values(amountsByWeek);
}

if (data[0].month){
// Extract the weeks and amounts from the data

var weeks = data.map(function(item) {

    return item.month;

});


// Group the amounts by week

var amountsByMonth = {};

data.forEach(function(item) {

    if (amountsByMonth[item.month]) {

        amountsByMonth[item.month] += item.amounts;

    } else {

        amountsByMonth[item.month] = item.amounts;

    }

});
// Extract the unique weeks and aggregated amounts
var label = Object.keys(amountsByMonth);
var aggregatedAmounts = Object.values(amountsByMonth);
}

if (data[0].days){
// Extract the weeks and amounts from the data

var weeks = data.map(function(item) {

    return item.days;

});


// Group the amounts by week

var amountsByDays = {};

data.forEach(function(item) {

    if (amountsByDays[item.days]) {

        amountsByDays[item.days] += item.amounts;

    } else {

        amountsByDays[item.days] = item.amounts;

    }

});
// Extract the unique weeks and aggregated amounts
var label = Object.keys(amountsByDays);
var aggregatedAmounts = Object.values(amountsByDays);
}
}
if (myChart1 != null){
    myChart1.destroy()
}
// Create the chart
myChart1 = new Chart(chart2, {
    type: 'bar',
    data: {
        labels: label,
        datasets: [{
            label: 'Amount',
            data: aggregatedAmounts,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
})

        })
    })

