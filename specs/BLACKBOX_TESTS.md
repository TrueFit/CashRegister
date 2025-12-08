# Black Box Integration Tests (Gherkin & Curl)

**Host:** `http://localhost:5000`
**Headers:** `Content-Type: application/json`

---

## Feature: Sales Flow & Logic

### Scenario 1: Happy Path (Add Item & Checkout)
**Description:** The user adds an available product, the system confirms, and the user pays with exact change or more.

* **Given** the database is initialized (Stock of "Milk": 10, Price: $20.00).
* **And** a new session with `session_id: "test-happy-path"`.
* **When** I send the following CURL command to add an item:
    ```bash
    curl -X POST http://localhost:5000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"session_id": "test-happy-path", "message": "Add 1 milk to the cart"}'
    ```
* **Then** the JSON response should contain in `ai_response` a text confirming "Added".
* **And** the JSON response in `cart_data` should show: `[{ "product_name": "Milk", "quantity": 1 }]`.
* **And** (**DB Check**) the `products` table should have Stock: 9 for "Milk".
* **When** I send the following CURL command to pay:
    ```bash
    curl -X POST http://localhost:5000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"session_id": "test-happy-path", "message": "I pay with a 50 bill"}'
    ```
* **Then** the JSON response should indicate a change of $30.00.
* **And** (**DB Check**) the `carts` table with this `session_id` should have `status: "completed"`.

---

### Scenario 2: Edge Case (Out of Stock Protection)
**Description:** The user tries to buy more units than exist in inventory. The Tool should block it.

* **Given** the product "Coca Cola" has a stock of 5 units.
* **And** a new session with `session_id: "test-stock-limit"`.
* **When** I send the following CURL command trying to abuse the stock:
    ```bash
    curl -X POST http://localhost:5000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"session_id": "test-stock-limit", "message": "Give me 10 coca colas"}'
    ```
* **Then** the JSON response in `ai_response` should say something like "Not enough stock" or "I only have 5".
* **And** (**DB Check**) the `cart_items` table for this cart should be empty (or not have that item).
* **And** (**DB Check**) the `products` table should maintain the Stock at 5.

---

### Scenario 3: Edge Case (The "Twist" - Divisible by 3)
**Description:** A purchase is forced whose total is divisible by 3 (e.g. $3.00) to trigger the random logic, but verifying that the financial math remains exact.

* **Given** there exists a product "Gum" with price $1.50 (150 cents).
* **And** a new session with `session_id: "test-random-twist"`.
* **When** I buy 2 gums (Total $3.00, divisible by 3):
    ```bash
    curl -X POST http://localhost:5000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"session_id": "test-random-twist", "message": "Give me 2 gums"}'
    ```
* **And** I pay with $5.00:
    ```bash
    curl -X POST http://localhost:5000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"session_id": "test-random-twist", "message": "Here's 5 pesos"}'
    ```
* **Then** the JSON response should indicate that the change is exactly $2.00.
* **And** the change text should NOT necessarily be "2 coins of 1 peso" (it can be random, e.g.: "20 coins of 10 cents"), but the sum of the value of the described coins must be 200 cents.

---

# TEST_REPORT.md Specification

This is the format that the agent should generate after running the tests.

```markdown
# Test Execution Report

**Date:** YYYY-MM-DD HH:MM:SS
**Environment:** Local / Flask Dev Server
**Total Tests:** 3
**Result:** [PASS / FAIL]

## Summary of Execution

| Scenario | Status | Latency (ms) | Notes |
| :--- | :---: | :---: | :--- |
| **1. Happy Path** | ✅ PASS | 120ms | Flow completed. Stock updated correctly. |
| **2. Stock Limit** | ✅ PASS | 85ms | Tool correctly rejected quantity > stock. |
| **3. Random Twist** | ⚠️ WARN | 150ms | Change sum matches, strictly random distribution verification required manual eye-check. |

## Detailed Logs (Failures Only)

*(If all pass, keep this section empty or say "No failures detected")*

> **Example Failure Log:**
> **Scenario:** 2. Stock Limit
> **Expected:** "Not enough stock"
> **Actual:** "Added 10 coca colas"
> **DB State:** Stock went to -5.
> **Error Analysis:** `add_item_tool` is missing logic `if qty > stock`.

## Database Consistency Check
* [x] **Orphaned Carts:** 0 found.
* [x] **Negative Stock:** 0 found.
* [x] **Float Precision Errors:** None detected (All prices are Integers).
```
