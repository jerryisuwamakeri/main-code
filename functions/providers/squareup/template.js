function getTemplate(
    APPLICATION_ID,
    LOCATION_ID,
    order_id,
    amount,
    currency
  ) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Test Payment Checkout</title>
        <script type="text/javascript" src="https://${testing? "sandbox.": ""}web.squarecdn.com/v1/square.js"></script>
        <script>
            const appId = '${APPLICATION_ID}';
            const locationId = '${LOCATION_ID}';
    
            async function initializeCard(payments) {
                const card = await payments.card();
                await card.attach('#card-container');
                return card;
            }
    
    
            async function tokenize(paymentMethod) {
                const tokenResult = await paymentMethod.tokenize();
                if (tokenResult.status === 'OK') {
                    return tokenResult.token;
                } else {
                    window.open("cancel?error=token_error", "_self");
                }
            }
    
            document.addEventListener('DOMContentLoaded', async function () {
                if (!window.Square) {
                    throw new Error('Square.js failed to load properly');
                }
    
                let payments;
                try {
                    payments = window.Square.payments(appId, locationId);
                } catch {
                    const statusContainer = document.getElementById(
                        'payment-status-container'
                    );
                    statusContainer.className = 'missing-credentials';
                    statusContainer.style.visibility = 'visible';
                    return;
                }
    
                let card;
                try {
                    card = await initializeCard(payments);
                } catch (e) {
                    console.error('Initializing Card failed', e);
                    return;
                }
                async function handlePaymentMethodSubmission(event, paymentMethod) {
                    event.preventDefault();
    
                    try {
                        cardButton.disabled = true;
                        const token = await tokenize(paymentMethod);
                        const body = JSON.stringify({
                            locationId: locationId,
                            sourceId: token,
                            amount: '${amount}',
                            order_id: '${order_id}',
                            currency: '${currency}'
                        });
    
                        fetch('${server_url}squareup-addcard', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body
                        })
                            .then(response => response.json())
                            .then(data => {
                                window.open("${server_url}squareup-process?order_id=" + data.reference_id + "&amount=" + data.total_money.amount + "&transaction_id=" + data.id, "_self");
                            })
                            .catch((error) => {
                                cardButton.disabled = false;
                                window.open("cancel?error=" + error.toString(), "_self");
                            });
                    } catch (e) {
                        cardButton.disabled = false;
                        window.open("cancel?error=catch_error", "_self");
                    }
                }
    
                const cardButton = document.getElementById('card-button');
                cardButton.addEventListener('click', async function (event) {
                    await handlePaymentMethodSubmission(event, card);
                });
            });
        </script>
    </head>
    <body>
        <form id="payment-form">
            <div id="card-container"></div>
            <button id="card-button" type="button"
            style="padding: 10px;padding-left: 100px;padding-right: 100px;font-size:16px;color: #fff;background-color:red;font-size:18px;background: #00c4ff;border-radius: 6px;box-shadow:none;border:0;"
            >Pay $${amount}</button>
        </form>
        <div id="payment-status-container"></div>
    </body>
    </html>
      `;
  }
  
  module.exports.getTemplate = getTemplate;