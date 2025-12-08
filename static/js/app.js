const sessionId = 'session-' + Math.random().toString(36).substr(2, 9);
const messageInput = document.getElementById('message-input');
const chatHistory = document.getElementById('chat-history');
const inventoryList = document.getElementById('inventory-list');
const cartList = document.getElementById('cart-list');
const totalDueSpan = document.getElementById('total-due');

// Init
async function init() {
    const response = await fetch(`/api/state?session_id=${sessionId}`);
    const data = await response.json();
    updateUI(data);
    if (data.history) {
        data.history.forEach(msg => addMessageToChat(msg.role, msg.content));
    }
}

messageInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message immediately
        addMessageToChat('user', message);
        messageInput.value = '';

        // Send to API
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId, message: message })
            });
            const data = await response.json();

            if (data.error) {
                addMessageToChat('ai', 'Error: ' + data.error);
            } else {
                addMessageToChat('ai', data.text);
                updateUI(data);
            }
        } catch (err) {
            addMessageToChat('ai', 'Network Error: ' + err.message);
        }
    }
});

function addMessageToChat(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.textContent = text;
    chatHistory.appendChild(div);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function updateUI(data) {
    // Update Inventory
    if (data.inventory_data) {
        inventoryList.innerHTML = data.inventory_data.map(item => `
            <div class="inventory-item">
                <div class="inventory-name">${item.name}</div>
                <div class="inventory-details">${item.price} | Stock: ${item.stock}</div>
            </div>
        `).join('');
    }

    // Update Cart
    if (data.cart_data) {
        cartList.innerHTML = data.cart_data.map(item => `
            <div class="cart-item">
                <div>${item.product_name} x ${item.quantity}</div>
                <div>${item.subtotal}</div>
            </div>
        `).join('');

        // Calculate Total
        // Note: The API sends formatted strings, but we can sum it up or ask API for total.
        // For simplicity, let's parse the subtotals or just rely on the API to send total if we wanted.
        // But the requirement says "Total Due (Large text)". 
        // Let's sum it up here for display.
        let total = 0;
        data.cart_data.forEach(item => {
            total += parseFloat(item.subtotal.replace('$', ''));
        });
        totalDueSpan.textContent = '$' + total.toFixed(2);
    }
}

init();
