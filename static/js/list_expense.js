const totalsaving = document.getElementById('total_saving');
const next = document.getElementById("next")
const previous = document.getElementById("previous")
const search_btn = document.getElementById("search_btn")


document.addEventListener('DOMContentLoaded', (e) => {
    const apiUrl = '/expenses/api';
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
            let totalamount = 0

            for (let item of data.data) {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = item.id;
                row.appendChild(idCell);

                const amountCell = document.createElement('td');
                amountCell.textContent = item.amount;
                row.appendChild(amountCell);

                totalamount += item.amount;

                const CategoryCell = document.createElement('td');
                CategoryCell.textContent = item.category;
                row.appendChild(CategoryCell);

                const datecCell = document.createElement('td');
                datecCell.textContent = item.date;
                row.appendChild(datecCell);

                const titleCell = document.createElement('td');
                titleCell.textContent = item.title;
                row.appendChild(titleCell);

                const update_url = `http://127.0.0.1:8000/expenses/${item.id}/`;
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
            totalsaving.innerHTML = `<h4 class='card-text'>Total Expense: ${totalamount}</h4>`;

            if (data.links.next != null){
            next.style.display = "block";;
            next.href = data.links.next;
            }

            if (data.links.previous){
            previous.style.display = "block";;
            previous.href = data.links.previous ;
            }

        })
    })

next.addEventListener("click", (e) => {
    e.preventDefault()
    const apiUrl = next.getAttribute("href");;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    };

    fetch(apiUrl, {
            headers
        })
        .then(response => response.json())
        .then(data => {
             let totalamount = 0
             const tableBody = document.getElementById('tablebody');
             var table = document.getElementById("table");

            // Get all the table body rows
            var rows = table.getElementsByTagName("tbody")[0].rows;

            for (var i = rows.length ; i > 0; i--) {
              table.deleteRow(i);}


            for (let item of data.data) {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = item.id;
                row.appendChild(idCell);

                const amountCell = document.createElement('td');
                amountCell.textContent = item.amount;
                row.appendChild(amountCell);

                totalamount += item.amount;

                const CategoryCell = document.createElement('td');
                CategoryCell.textContent = item.category;
                row.appendChild(CategoryCell);

                const datecCell = document.createElement('td');
                datecCell.textContent = item.date;
                row.appendChild(datecCell);

                const titleCell = document.createElement('td');
                titleCell.textContent = item.title;
                row.appendChild(titleCell);

                const update_url = `http://127.0.0.1:8000/expenses/${item.id}/`;
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
            totalsaving.innerHTML = `<h4 class='card-text'>Total Expense: ${totalamount}</h4>`

            if (data.links.next != null){
            next.style.display = "block";;
            next.href = data.links.next;
            }

            if (data.links.previous){
            previous.style.display = "block";;
            previous.href = data.links.previous ;
            }

            if (data.links.previous == null){
            previous.style.display = "none";
            }
            if (data.links.next == null){
            next.style.display = "none";
            }

        })
        })


previous.addEventListener("click", (e) => {
    e.preventDefault()
    const apiUrl = previous.getAttribute("href");;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    };

    fetch(apiUrl, {
            headers
        })
        .then(response => response.json())
        .then(data => {
            let totalamount = 0
            const tableBody = document.getElementById('tablebody');
            var table = document.getElementById("table");


            // Get all the table body rows
            var rows = table.getElementsByTagName("tbody")[0].rows;

            // Delete all rows except the first one (header row)
            for (var i = rows.length ; i > 0; i--) {
              table.deleteRow(i);}

            for (let item of data.data) {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = item.id;
                row.appendChild(idCell);

                const amountCell = document.createElement('td');
                amountCell.textContent = item.amount;
                row.appendChild(amountCell);

                totalamount += item.amount;

                const CategoryCell = document.createElement('td');
                CategoryCell.textContent = item.category;
                row.appendChild(CategoryCell);

                const datecCell = document.createElement('td');
                datecCell.textContent = item.date;
                row.appendChild(datecCell);

                const titleCell = document.createElement('td');
                titleCell.textContent = item.title;
                row.appendChild(titleCell);

                const update_url = `http://127.0.0.1:8000/expenses/${item.id}/`;
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
            totalsaving.innerHTML = `<h4 class='card-text'>Total Expense: ${totalamount}</h4>`;

            if (data.links.next != null){
            next.style.display = "block";;
            next.href = data.links.next;
            }

            if (data.links.previous){
            previous.style.display = "block";;
            previous.href = data.links.previous ;
            }
            if (data.links.previous == null){
            previous.style.display = "none";
            }
            if (data.links.next == null){
            next.style.display = "none";
            }

        })
    })



search_btn.addEventListener("click", (e) => {
    e.preventDefault()
    const search_input = document.getElementById('search_input');
    let searchQuery =search_input.value
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    };
fetch('expenses/api/?search=' + searchQuery ,{headers})
  .then(response => response.json())
  .then(data => {
     if (data.links.next == null){
        next.style.display = "none";;
        next.href = data.links.next;
        }

        if (data.links.previous == null){
        previous.style.display = "none";;
        previous.href = data.links.previous ;
        }
     const tableBody = document.getElementById('tablebody');
            let totalamount = 0

            var rows = table.getElementsByTagName("tbody")[0].rows;

            for (var i = rows.length ; i > 0; i--) {
              table.deleteRow(i);}

            for (let item of data.data) {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = item.id;
                row.appendChild(idCell);

                const amountCell = document.createElement('td');
                amountCell.textContent = item.amount;
                row.appendChild(amountCell);

                totalamount += item.amount;

                const CategoryCell = document.createElement('td');
                CategoryCell.textContent = item.category;
                row.appendChild(CategoryCell);

                const datecCell = document.createElement('td');
                datecCell.textContent = item.date;
                row.appendChild(datecCell);

                const titleCell = document.createElement('td');
                titleCell.textContent = item.title;
                row.appendChild(titleCell);

                const update_url = `http://127.0.0.1:8000/expenses/${item.id}/`;
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
            totalsaving.innerHTML = `<h4 class='card-text'>Total Expense: ${totalamount}</h4>`;

            if (data.links.next){
            next.style.display = "block";;
            next.href = data.links.next;
            }

            if (data.links.previous){
            previous.style.display = "block";;
            previous.href = data.links.previous ;
            }
  })
  .catch(error => {
    // Handle any errors
    console.error('Error:', error);
  });
});