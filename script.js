document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    const cartList = document.querySelector('.cart-list');
    const totalPriceEl = document.getElementById('total-price');
    const paymentForm = document.getElementById('payment-form');
    const cashInput = document.getElementById('cash-input');
    const changeDisplay = document.getElementById('change-display');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');

    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const id = card.dataset.id;
            const name = card.dataset.name;
            const price = parseInt(card.dataset.price);

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }
            updateCart();
        });
    });

    // Update cart display
    function updateCart() {
        cartList.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>Rp ${(item.price * item.quantity).toLocaleString()}</span>
            `;
            cartList.appendChild(itemEl);
        });
        totalPriceEl.textContent = `Rp ${total.toLocaleString()}`;
    }

    // Payment
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cash = parseInt(cashInput.value);
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        if (cash < total) {
            showNotification('Uang tidak cukup!', 'error');
            return;
        }

        const change = cash - total;
        changeDisplay.innerHTML = `<p>Kembalian: Rp ${change.toLocaleString()}</p>`;
        showNotification('Pembayaran berhasil!', 'success');
        cart.length = 0;
        updateCart();
        cashInput.value = '';
        // Kembalian tetap tampil sampai transaksi baru
    });

    // Show notification
    function showNotification(message, type) {
        notificationText.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});
