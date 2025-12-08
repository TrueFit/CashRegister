// Generate or retrieve session ID
let sessionId = sessionStorage.getItem('cashRegisterSessionId');
if (!sessionId) {
    sessionId = 'session-' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('cashRegisterSessionId', sessionId);
}

const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatHistory = document.getElementById('chat-history');
const inventoryList = document.getElementById('inventory-list');
const cartList = document.getElementById('cart-list');
const totalDueSpan = document.getElementById('total-due');
const sessionDisplay = document.getElementById('session-display');
const loadingSpinner = document.getElementById('loading-spinner');

// Track previous state for highlight comparison
let previousInventory = {};
let previousCart = {};

// Display session ID
sessionDisplay.textContent = sessionId;

// Init
async function init() {
    try {
        const response = await fetch(`/api/state?session_id=${sessionId}`);
        const data = await response.json();
        updateUI(data, false); // Don't highlight on init
        if (data.history) {
            data.history.forEach(msg => addMessageToChat(msg.role, msg.content));
        }
    } catch (err) {
        addMessageToChat('ai', 'Failed to connect to server: ' + err.message);
    }
}

// Send message function
async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message immediately
    addMessageToChat('user', message);
    messageInput.value = '';

    // Show loading spinner
    setLoading(true);

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
            updateUI(data, true);

            // Handle special actions
            if (data.action === 'clear') {
                clearChatUI();
            } else if (data.action === 'checkout_complete') {
                startCheckoutCountdown();
            }
        }
    } catch (err) {
        addMessageToChat('ai', 'Network Error: ' + err.message);
    } finally {
        setLoading(false);
    }
}

// Clear chat UI
function clearChatUI() {
    chatHistory.innerHTML = '';
    previousInventory = {};
    previousCart = {};
}

// Checkout countdown
let countdownInterval = null;
let countdownMessageDiv = null;

function startCheckoutCountdown() {
    let seconds = 15;

    // Create countdown message in chat
    countdownMessageDiv = document.createElement('div');
    countdownMessageDiv.className = 'message system countdown-message';
    countdownMessageDiv.innerHTML = `
        <span>New session in <strong id="countdown-seconds">${seconds}</strong>s</span>
        <button id="cancel-countdown">Cancel</button>
    `;
    chatHistory.appendChild(countdownMessageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    const secondsSpan = document.getElementById('countdown-seconds');
    const cancelBtn = document.getElementById('cancel-countdown');

    cancelBtn.addEventListener('click', () => {
        clearInterval(countdownInterval);
        countdownMessageDiv.innerHTML = '<span>Session continued.</span>';
        countdownMessageDiv = null;
    });

    countdownInterval = setInterval(() => {
        seconds--;
        if (secondsSpan) secondsSpan.textContent = seconds;

        if (seconds <= 0) {
            clearInterval(countdownInterval);
            if (countdownMessageDiv) {
                countdownMessageDiv.remove();
                countdownMessageDiv = null;
            }
            resetSession();
        }
    }, 1000);
}

function resetSession() {
    // Generate new session ID
    sessionId = 'session-' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('cashRegisterSessionId', sessionId);
    sessionDisplay.textContent = sessionId;

    // Clear UI
    clearChatUI();
    cartList.innerHTML = '';
    totalDueSpan.textContent = '$0.00';

    // Reload inventory
    init();
}

// Event listeners
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

function setLoading(isLoading) {
    if (isLoading) {
        loadingSpinner.classList.remove('hidden');
        messageInput.disabled = true;
        sendBtn.disabled = true;
    } else {
        loadingSpinner.classList.add('hidden');
        messageInput.disabled = false;
        sendBtn.disabled = false;
        messageInput.focus();
    }
}

function addMessageToChat(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    div.textContent = text;
    chatHistory.appendChild(div);
    // Auto-scroll to bottom
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function updateUI(data, highlightChanges = false) {
    // Update Inventory
    if (data.inventory_data) {
        const newInventory = {};
        data.inventory_data.forEach(item => {
            newInventory[item.name] = item.stock;
        });

        inventoryList.innerHTML = data.inventory_data.map(item => {
            const changed = highlightChanges && previousInventory[item.name] !== undefined && previousInventory[item.name] !== item.stock;
            return `
                <div class="inventory-item ${changed ? 'highlight' : ''}">
                    <div class="inventory-name">${item.name}</div>
                    <div class="inventory-details">${item.price} | Stock: ${item.stock}</div>
                </div>
            `;
        }).join('');

        previousInventory = newInventory;
    }

    // Update Cart
    if (data.cart_data) {
        const newCart = {};
        data.cart_data.forEach(item => {
            newCart[item.product_name] = item.quantity;
        });

        cartList.innerHTML = data.cart_data.map(item => {
            const changed = highlightChanges && previousCart[item.product_name] !== item.quantity;
            return `
                <div class="cart-item ${changed ? 'highlight' : ''}">
                    <div>${item.product_name} x ${item.quantity}</div>
                    <div>${item.subtotal}</div>
                </div>
            `;
        }).join('');

        previousCart = newCart;

        // Calculate Total
        let total = 0;
        data.cart_data.forEach(item => {
            total += parseFloat(item.subtotal.replace('$', ''));
        });

        const newTotal = '$' + total.toFixed(2);
        if (highlightChanges && totalDueSpan.textContent !== newTotal) {
            totalDueSpan.classList.add('highlight');
            setTimeout(() => totalDueSpan.classList.remove('highlight'), 1500);
        }
        totalDueSpan.textContent = newTotal;
    }
}

init();
