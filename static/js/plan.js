const Plan2Name = document.getElementById("plan2_name")
const plan2Price = document.getElementById("paln2_price")
const Plan3Name = document.getElementById("plan3_name")
const plan3Price = document.getElementById("plan3_price")
const btn_Plan2 = document.getElementById("btn_Plan2")
const btn_Plan3 = document.getElementById("btn_Plan3")
let plan3 = document.getElementById("plan3")
let plan2id = 0
let plan3id = 0




document.addEventListener('DOMContentLoaded', (e) => {
    const apiUrl = '/expenses/api/plans';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    };

    fetch(apiUrl, {
            headers
        })
        .then(response => response.json())
        .then(data => {
        Plan2Name.innerText = data[0].name;
        plan2Price.innerHTML = '₹'+data[0].price +'<small class="text-muted"> / mo</small>';
        plan2id = data[0].price_id
        if(data[1]){
        plan3.style.display = 'block';
        Plan3Name.innerText = data[1].name;
        plan3Price.innerHTML = '₹'+data[1].price ;
        plan3id = data[1].price_id
        }
        }
         )
  });


btn_Plan2.addEventListener("click", (e) => {
const apiUrl = `/expenses/payments/${plan2id}`;
window.location.href = apiUrl;
});

btn_Plan3.addEventListener("click", (e) => {
const apiUrl = `/expenses/payments/${plan3id}`;
window.location.href = apiUrl;
});