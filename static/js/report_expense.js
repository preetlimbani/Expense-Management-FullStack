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
const closemodals_btn = document.querySelector('.close_modals');
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

    const apiUrl = '/expenses/api/month/v1/report/';
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
        closemodals_btn.click();
        chartContainer.style.display = 'block';
        }
           var categoryData = {};
for (var i = 0; i < data.length; i++) {
    var category = data[i].category;
    var amount = data[i].amount;
    if (category in categoryData) {
        categoryData[category] += amount;
    } else {
        categoryData[category] = amount;
    }
}

// Create an array of category labels and amount data
var categories = Object.keys(categoryData);
var amounts = [];
for (var i = 0; i < categories.length; i++) {
    amounts.push(categoryData[categories[i]]);
}
if (myChart != null){
myChart.destroy()
}
// Create the chart
myChart = new Chart(chart1, {
    type: 'pie',
    data: {
        labels: categories,
        datasets: [{
            label: 'Amount',
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
        maintainAspectRatio: true
    }
});


// Prepare the data for the chart
var chartData = {
    labels: [],
    datasets: [{
        label: 'Amount',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    }]
};

// Group the data by week within a month and sum the amounts
var weekData = {};
for (var i = 0; i < data.length; i++) {
    var date = new Date(data[i].date);
    var week = getWeekNumberWithinMonth(date);
    if (week in weekData) {
        weekData[week] += data[i].amount;
    } else {
        weekData[week] = data[i].amount;
    }
}

// Sort the weeks in ascending order
var sortedWeeks = Object.keys(weekData).sort(function (a, b) {
    return a - b;
});

// Populate the chart data with the week labels and amounts
for (var i = 0; i < sortedWeeks.length; i++) {
    chartData.labels.push('Week ' + sortedWeeks[i]);
    chartData.datasets[0].data.push(weekData[sortedWeeks[i]]);
}

if (myChart1 != null){
myChart1.destroy()
}
// Create the chart
myChart1 = new Chart(chart2, {
    type: 'bar',
    data: chartData,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
// Function to get the week number within a month from a date
function getWeekNumberWithinMonth(date) {
    var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    var daysOffset = firstDayOfMonth.getDay() - 1;
    var firstWeekStart = new Date(date.getFullYear(), date.getMonth(), 1 - daysOffset);
    var weekNumber = Math.ceil((date - firstWeekStart) / (7 * 24 * 60 * 60 * 1000));
    return weekNumber;
}

        })
    })


YearBtn.addEventListener('click', (e) => {
    const apiUrl = '/expenses/api/year/v1/report/';
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
        closemodals_btn.click();
        chartContainer.style.display = 'block';
        }
           var categoryData = {};
for (var i = 0; i < data.length; i++) {
    var category = data[i].category;
    var amount = data[i].amount;
    if (category in categoryData) {
        categoryData[category] += amount;
    } else {
        categoryData[category] = amount;
    }
}

// Create an array of category labels and amount data

var categories = Object.keys(categoryData);
var amounts = [];
for (var i = 0; i < categories.length; i++) {
    amounts.push(categoryData[categories[i]]);
}


// Create the chart
    myChart = new Chart(chart1, {
    type: 'doughnut',
    data: {
        labels: categories,
        datasets: [{
            label: 'Amount',
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
        maintainAspectRatio: true
    }
});

// Prepare the data for the chart
var chartData = {
    labels: [],
    datasets: [{
        label: 'Amount',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    }]
};

// Group the data by month and sum the amounts
var monthData = {};
for (var i = 0; i < data.length; i++) {
    var date = new Date(data[i].date);
    var month = getMonthLabel(date);
    if (month in monthData) {
        monthData[month] += data[i].amount;
    } else {
        monthData[month] = data[i].amount;
    }
}

// Sort the months in ascending order
var sortedMonths = Object.keys(monthData).sort(function (a, b) {
    var dateA = new Date(a);
    var dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
});

// Populate the chart data with the month labels and amounts
for (var i = 0; i < sortedMonths.length; i++) {
    chartData.labels.push(sortedMonths[i]);
    chartData.datasets[0].data.push(monthData[sortedMonths[i]]);
}

if (myChart1 != null){
    myChart1.destroy()
}
// Create the chart
myChart1 = new Chart(chart2, {
    type: 'bar',
    data: chartData,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Function to get the month label from a date
function getMonthLabel(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    return year + '-' + (month < 10 ? '0' : '') + month;
}

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
    const apiUrl = '/expenses/api/custom/v1/report/';
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
        const values = JSON.parse(data);
        if (data){
        closemodals_btn.click();
        chartContainer.style.display = 'block';
        }
           var categoryData = {};
for (var i = 0; i < values.serializer.length; i++) {
    var category = values.serializer[i].category;
    var amount = values.serializer[i].amount;
    if (category in categoryData) {
        categoryData[category] += amount;
    } else {
        categoryData[category] = amount;
    }
}

// Create an array of category labels and amount data

var categories = Object.keys(categoryData);
var amounts = [];
for (var i = 0; i < categories.length; i++) {
    amounts.push(categoryData[categories[i]]);
}

if (myChart != null){
myChart.destroy()
}
// Create the chart
     myChart = new Chart(chart1, {
    type: 'doughnut',
    data: {
        labels: categories,
        datasets: [{
            label: 'Amount',
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
        maintainAspectRatio: true
    }
});

    if (values.total_days >= 30){

        // Prepare the data for the chart
        var chartData = {
            labels: [],
            datasets: [{
                label: 'Amount',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        // Group the data by month and sum the amounts
        var monthData = {};
        for (var i = 0; i < values.serializer.length; i++) {
            var date = new Date(values.serializer[i].date);
            var month = getMonthLabel(date);
            if (month in monthData) {
                monthData[month] += values.serializer[i].amount;
            } else {
                monthData[month] = values.serializer[i].amount;
            }
        }

        // Sort the months in ascending order
        var sortedMonths = Object.keys(monthData).sort(function (a, b) {
            var dateA = new Date(a);
            var dateB = new Date(b);
            return dateA.getTime() - dateB.getTime();
        });

        // Populate the chart data with the month labels and amounts
        for (var i = 0; i < sortedMonths.length; i++) {
            chartData.labels.push(sortedMonths[i]);
            chartData.datasets[0].data.push(monthData[sortedMonths[i]]);
        }

        if (myChart1 != null){
            myChart1.destroy()
        }
        // Create the chart
         myChart1 = new Chart(chart2, {
            type: 'bar',
            data: chartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Function to get the month label from a date
        function getMonthLabel(date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            return year + '-' + (month < 10 ? '0' : '') + month;
        }
    }
    else{

    // Prepare the data for the chart
var chartData = {
    labels: [],
    datasets: [{
        label: 'Amount',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    }]
};

// Group the data by week within a month and sum the amounts
var weekData = {};
for (var i = 0; i < values.serializer.length; i++) {
    var date = new Date(values.serializer[i].date);
    var week = getWeekNumberWithinMonth(date);
    if (week in weekData) {
        weekData[week] += values.serializer[i].amount;
    } else {
        weekData[week] = values.serializer[i].amount;
    }
}

// Sort the weeks in ascending order
var sortedWeeks = Object.keys(weekData).sort(function (a, b) {
    return a - b;
});

// Populate the chart data with the week labels and amounts
for (var i = 0; i < sortedWeeks.length; i++) {
    chartData.labels.push('Week ' + sortedWeeks[i]);
    chartData.datasets[0].data.push(weekData[sortedWeeks[i]]);
}

if (myChart1 != null){
myChart1.destroy()
}
// Create the chart
myChart1 = new Chart(chart2, {
    type: 'bar',
    data: chartData,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
// Function to get the week number within a month from a date
function getWeekNumberWithinMonth(date) {
    var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    var daysOffset = firstDayOfMonth.getDay() - 1;
    var firstWeekStart = new Date(date.getFullYear(), date.getMonth(), 1 - daysOffset);
    var weekNumber = Math.ceil((date - firstWeekStart) / (7 * 24 * 60 * 60 * 1000));
    return weekNumber;
}

    }

        })
    })

