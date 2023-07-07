let totalamount = 0
let total_saving = 0
document.addEventListener('DOMContentLoaded', (e) => {
    const apiUrl = '/expenses/api/month/';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    };

    fetch(apiUrl, {
            headers
        })
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('tablebody');
            const totalsaving = document.getElementById('total_saving');
            for (let item of data) {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = item.id;
                row.appendChild(idCell);

                const amountCell = document.createElement('td');
                amountCell.textContent = item.amount;
                row.appendChild(amountCell);

                totalamount += item.amount

                const spentCell = document.createElement('td');
                spentCell.textContent = item.spent;
                row.appendChild(spentCell);

                const remainingCell = document.createElement('td');
                remainingCell.textContent = item.remaining;
                 if (item.remaining < 0) {
                remainingCell.style.color = "red";
                }
                row.appendChild(remainingCell);
                total_saving += item.remaining

                const titleCell = document.createElement('td');
                titleCell.textContent = item.category;
                row.appendChild(titleCell);


                const update_url = `http://127.0.0.1:8000/expenses/month/${item.id}/`
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

            totalsaving.innerHTML = `<h4 class='card-text'>Total Saving: ${totalamount}</h4>`
        })
    });