const totalsaving = document.getElementById('total_saving');
document.addEventListener('DOMContentLoaded', (e) => {
    const apiUrl = '/expenses/api/schedule/';
    const params = new URLSearchParams();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    };

    fetch(apiUrl, {
            headers
        })
        .then(response => response.json())
        .then(data => {
            if(data.detail == "You have reached the maximum limit of your plan."){
            window.location.href = '/expenses/plan/'
            }
            else{
            let totalamount = 0
            const tableBody = document.getElementById('tablebody');

            for (let item of data) {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = item.id;
                row.appendChild(idCell);

                const amountCell = document.createElement('td');
                amountCell.textContent = item.amount;
                row.appendChild(amountCell);

                totalamount += item.amount;

                const titleCell = document.createElement('td');
                titleCell.textContent = item.title;
                row.appendChild(titleCell);

                const datecCell = document.createElement('td');
                datecCell.textContent = item.start_date;
                row.appendChild(datecCell);

                const frequencyCell = document.createElement('td');
                frequencyCell.textContent = item.frequency;
                row.appendChild(frequencyCell);

                const update_url = `http://127.0.0.1:8000/expenses/schedule/${item.id}/`
                const UpdateCell = document.createElement('td');
                const a = document.createElement('a');
                a.setAttribute('href', update_url);

                // Add the "fas fa-edit" icon
                const icon = document.createElement('i');
                icon.classList.add('fas', 'fa-edit');
                a.appendChild(icon);

                UpdateCell.appendChild(a);
                row.appendChild(UpdateCell);


                tableBody.appendChild(row);
            }
            totalsaving.innerHTML = `<h4 class='card-text'>Total Scheduled Expense: ${totalamount}</h4>`;
            }



        })
    })