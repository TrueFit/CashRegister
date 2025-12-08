# Black Box Integration Tests (Gherkin & Curl)

**Host:** `http://localhost:5000`
**Headers:** `Content-Type: application/json`

---

---

**IMPORTANT: EXECUTION METHOD**
Do NOT write a script to run these tests. You must:
1. Start the Flask server in a terminal.
2. Manually execute the `curl` commands for each step.
3. Analyze the JSON response and Server Logs step-by-step to verify the behavior.

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

### Scenario 4: Multiple Different Items in Cart
**Description:** The user adds multiple different products to the cart, and the system correctly calculates the total across all items.

* **Given** the database has the following products:
    * "Santa Clara Milk 1L" - Price: $28.50, Stock: 50
    * "Coca Cola Original 600ml" - Price: $18.00, Stock: 100
    * "Sabritas Original 45g" - Price: $16.00, Stock: 60
* **And** a new session with `session_id: "test-multi-items"`.
* **When** I add the first item:
    ```bash
    curl -X POST http://localhost:5000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"session_id": "test-multi-items", "message": "Add 2 milks"}'
    ```
* **Then** the response should confirm "Added 2 Santa Clara Milk".
* **And** the cart total should be $57.00.
* **When** I add a second different item:
    ```bash
    curl -X POST http://localhost:5000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"session_id": "test-multi-items", "message": "Add 1 Coca Cola"}'
    ```
* **Then** the response should confirm the addition.
* **And** the cart should show 2 different products.
* **And** the total should be $75.00 ($57.00 + $18.00).
* **When** I add a third different item:
    ```bash
    curl -X POST http://localhost:5000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"session_id": "test-multi-items", "message": "Give me 3 Sabritas"}'
    ```
* **Then** the cart should contain 3 different product types.
* **And** the total should be $123.00 ($75.00 + $48.00).
* **And** (**DB Check**) Stock should be: Milk: 48, Coca Cola: 99, Sabritas: 57.

---

### Scenario 5: Ambiguity Resolution (AI Engineering)
**Description:** The user requests a product with an ambiguous name. The agent should detect multiple matches and ask for clarification instead of guessing.

* **Given** the database has:
    * "Coca Cola Original 600ml" - Price: $18.00, Stock: 100
    * "Coca Cola Zero 600ml" - Price: $18.00, Stock: 80
* **And** a new session with `session_id: "test-ambiguity"`.
* **When** I send an ambiguous request:
    ```bash
    curl -X POST http://localhost:5000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"session_id": "test-ambiguity", "message": "I want a Coca Cola"}'
    ```
* **Then** the `ai_response` should contain a question asking for clarification.
* **And** the response should mention both "Original" and "Zero" options.
* **And** (**DB Check**) the `cart_items` table should be empty (nothing added yet).
* **And** (**DB Check**) stock for both products should remain unchanged.
* **When** I clarify my choice:
    ```bash
    curl -X POST http://localhost:5000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"session_id": "test-ambiguity", "message": "The Zero one"}'
    ```
* **Then** the response should confirm "Added Coca Cola Zero".
* **And** the cart should contain 1 item: "Coca Cola Zero".
* **And** (**DB Check**) Stock for "Coca Cola Zero" should be 79.
* **And** (**DB Check**) Stock for "Coca Cola Original" should remain 100.

---

# TEST_REPORT.md Specification

**CRITICAL WARNING:** Do NOT overwrite this file (`specs/IMPLEMENTATION_SUMMARY.md`) with the test report. This file contains the *instructions* for the summary. You must create a NEW file named `TEST_REPORT.md` in the root directory (or wherever specified) to store the actual results.

This is the format that the agent should generate after running the tests.

```markdown
# Test Execution Report

**Date:** YYYY-MM-DD HH:MM:SS
**Environment:** Local / Flask Dev Server
**Total Tests:** 5
**Result:** [PASS / FAIL]

## Summary of Execution

| Scenario | Status | Latency (ms) | Notes |
| :--- | :---: | :---: | :--- |
| **1. Happy Path** | ✅ PASS | 120ms | Flow completed. Stock updated correctly. |
| **2. Stock Limit** | ✅ PASS | 85ms | Tool correctly rejected quantity > stock. |
| **3. Random Twist** | ⚠️ WARN | 150ms | Change sum matches, strictly random distribution verification required manual eye-check. |
| **4. Multi Items** | ✅ PASS | 180ms | Cart correctly handles multiple different products. Total calculation accurate. |
| **5. Ambiguity** | ✅ PASS | 220ms | Agent correctly detected ambiguity, asked for clarification, and added correct item after user response. |

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
