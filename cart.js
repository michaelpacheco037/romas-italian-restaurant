// Demo cart: prices use whole cents to keep the subtotal accurate.
const cartPanel = document.querySelector('#cart-aside');

if (cartPanel) {
    const cartItems = document.querySelector('#cart-items');
    const emptyMessage = document.querySelector('#cart-empty');
    const subtotal = document.querySelector('#total-price');
    const completeButton = document.querySelector('#purchase');
    const message = document.querySelector('#cart-message');
    const mobileCartLink = document.querySelector('#mobile-cart-link');
    const cartCount = document.querySelector('#cart-count');
    let cart = [];

    function money(cents) {
        return '$' + (cents / 100).toFixed(2);
    }

    function validQuantity(value) {
        const number = Number(value);
        if (!Number.isFinite(number)) return 1;
        return Math.min(99, Math.max(1, Math.trunc(number)));
    }

    function updateSummary() {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        subtotal.textContent = money(total);
        emptyMessage.hidden = cart.length > 0;
        completeButton.disabled = cart.length === 0;
        mobileCartLink.hidden = cart.length === 0;
        cartCount.textContent = count;
    }

    function renderCart() {
        cartItems.replaceChildren();

        cart.forEach((item) => {
            const row = document.createElement('li');
            row.className = 'cart-item';

            const name = document.createElement('p');
            name.className = 'cart-item-name';
            name.textContent = item.name;

            const controls = document.createElement('div');
            controls.className = 'cart-item-controls';
            const label = document.createElement('label');
            label.htmlFor = 'cart-' + item.id;
            label.textContent = 'Qty';

            const quantity = document.createElement('input');
            quantity.id = label.htmlFor;
            quantity.type = 'number';
            quantity.min = '1';
            quantity.max = '99';
            quantity.step = '1';
            quantity.value = item.quantity;
            quantity.setAttribute('aria-label', 'Quantity of ' + item.name);

            const total = document.createElement('span');
            total.className = 'cart-item-total';
            total.textContent = money(item.price * item.quantity);

            quantity.addEventListener('change', () => {
                item.quantity = validQuantity(quantity.value);
                quantity.value = item.quantity;
                total.textContent = money(item.price * item.quantity);
                updateSummary();
                message.textContent = 'Cart quantity updated.';
            });

            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'remove-item';
            removeButton.textContent = 'Remove';
            removeButton.setAttribute('aria-label', 'Remove ' + item.name + ' from cart');
            removeButton.addEventListener('click', () => {
                const nextFocus = row.nextElementSibling?.querySelector('.remove-item')
                    || row.previousElementSibling?.querySelector('.remove-item');
                cart = cart.filter((cartItem) => cartItem.id !== item.id);
                row.remove();
                updateSummary();
                message.textContent = item.name + ' removed from the demo cart.';
                if (nextFocus) nextFocus.focus();
                else document.querySelector('.add-to-cart button[type="submit"]').focus();
            });

            controls.append(label, quantity, total);
            row.append(name, controls, removeButton);
            cartItems.append(row);
        });

        updateSummary();
    }

    document.querySelectorAll('[data-cart-control]').forEach((button) => {
        button.disabled = false;
    });

    document.querySelectorAll('.add-to-cart').forEach((form) => {
        const quantity = form.querySelector('input[type="number"]');

        form.querySelector('.quantity-plus').addEventListener('click', () => {
            quantity.value = validQuantity(validQuantity(quantity.value) + 1);
        });
        form.querySelector('.quantity-minus').addEventListener('click', () => {
            quantity.value = validQuantity(validQuantity(quantity.value) - 1);
        });
        quantity.addEventListener('change', () => {
            quantity.value = validQuantity(quantity.value);
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const amount = validQuantity(quantity.value);
            const existing = cart.find((item) => item.id === form.dataset.item);
            let added = amount;

            if (existing) {
                const previousQuantity = existing.quantity;
                existing.quantity = validQuantity(existing.quantity + amount);
                added = existing.quantity - previousQuantity;
            } else {
                cart.push({
                    id: form.dataset.item,
                    name: form.dataset.name,
                    price: Number(form.dataset.price),
                    quantity: amount
                });
            }

            renderCart();
            quantity.value = '1';
            message.textContent = added
                ? `Added ${added} × ${form.dataset.name} to the demo cart.`
                : 'This item has reached the limit of 99.';
        });
    });

    completeButton.addEventListener('click', () => {
        if (!cart.length) return;
        cart = [];
        renderCart();
        message.textContent = 'Demo complete. No order or payment was submitted.';
        document.querySelector('.add-to-cart button[type="submit"]').focus();
    });

    updateSummary();
}
