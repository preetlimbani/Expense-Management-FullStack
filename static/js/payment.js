const message = document.getElementById('message');
const messagefail = document.getElementById('messagefail');
const url = window.location.href.split('/');
const price_id = url[5]
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
};

const stripe = Stripe('pk_test_51NDgOKSIngDueib46DuvwrE58z2geOecwZIN4BIklZ8H6JJras12gERXblefqsoCzePaFIJiKfbsh5BO00dOR2yL00TaZ0A15o');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');

const form = document.getElementById('payment-form');
const cardErrors = document.getElementById('card-errors');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  if (error) {
    console.error(error);
    cardErrors.textContent = error.message;
  } else {
    const response = await fetch('/expenses/api/subscriptions/', {
      method: 'POST',
      headers,
      body: JSON.stringify({ payment_method_id: paymentMethod.id, price_id : price_id }),
    });
    const data = await response.json();

    if (data) {
        if(data.message){
              message.style.display = 'block'
        }
        if(data.error){
              messagefail.style.display = 'block';
            messagefail.innerText=data.error;
        }
        if(data.client_secret){
         const { error } = await stripe.confirmCardPayment(data.client_secret);
        if (error) {
              messagefail.style.display = 'block';
            messagefail.innerText='Payment and subscription creation failed';
            }
        else {
          message.style.display = 'block';
        }
        }
  }
}
});
