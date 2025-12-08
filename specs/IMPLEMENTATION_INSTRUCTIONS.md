# Technical Specification: AI-Agent Cash Register System

## 1. Executive Summary
This project re-imagines a standard "Cash Register" coding challenge as a modern **AI Agent Engineering** proof-of-concept. Instead of a simple CLI script, we implement a Full-Stack application where a **LangGraph** agent orchestrates a Point of Sale (POS) system.

**Key Architectural Decisions:**
* **Math Safety:** All calculations (prices, stock, change) are handled by deterministic Python tools, not the LLM.
* **Stateless Agent / Stateful DB:** The conversation history is stored in the database but fed into the agent on every turn, allowing for a "stateless" LangGraph implementation.
* **Semantic Router:** The LLM handles intent classification, fuzzy search, and spelling corrections.
* **Hybrid Logic:** "System commands" (like `/clear`) bypass the LLM entirely for efficiency.

---

## 2. Technology Stack
* **Backend:** Python 3.11+, Flask.
* **Database:** SQLite (via SQLAlchemy). **No Migrations** (Drop/Create strategy).
* **AI Orchestration:** LangChain + LangGraph.
* **LLM:** OpenAI GPT-4o-mini (or equivalent).
* **Frontend:** HTML5, CSS (Grid), Vanilla JavaScript.

---

## 3. Database Schema (SQLAlchemy)

### `products`
Inventory management. Money is stored as **Integers (cents)** to avoid floating-point errors.
* `id`: string (PK)
* `name`: String (Unique)
* `price_cents`: Integer
* `stock`: Integer

### `carts`
Represents the active session and chat state.
* `id`: string (PK)
* `session_id`: String (Unique, Indexed)
* `status`: Enum ('active', 'completed')
* `history`: JSON (Default `[]`) - Stores the list of `{role: "user/ai", content: "..."}`
* `created_at`: DateTime

### `cart_items`
Join table for products in a cart.
* `id`: string (PK)
* `cart_id`: string (FK `carts.id`)
* `product_id`: string (FK `products.id`)
* `quantity`: Integer

---

## 4. Agent Architecture (LangGraph)

The agent uses a **Stateless Graph**. Context is hydrated from `carts.history` on every request.

### 4.1. Core Logic Flow
1.  **User Input** is received via API.
2.  **Router Node**: Analyzes intent.
    * *Intention: Shopping/Modification* -> Invokes **Tools**.
    * *Intention: Checkout* -> Invokes **Checkout Tool**.
    * *Intention: Chit-chat/Off-topic* -> Returns static/generative refusal.
3.  **Tool Execution**: Python functions modify DB and return structured results.
4.  **Response Generation**: LLM interprets Tool Output and generates a natural language response.

### 4.2. Tool Definitions

#### A. `get_product_catalog`
* **Input:** None.
* **Output:** List of `[{id, name, stock, price}]`.
* **Logic:** Returns the **entire** product list from DB.
* **Role:** Allows the LLM to perform fuzzy matching, spelling correction, and ambiguity resolution internally.
* **⚠️ SCALABILITY WARNING:**
    > This implementation performs a `SELECT *` and dumps context into the LLM. It is O(N) on tokens. For production (>100 items), replace with Server-Side Trigram Search (Postgres `pg_trgm`) or Vector Search.

#### B. `add_item_tool`
* **Input:** `product_id` (int), `quantity` (int, default=1).
* **Logic:**
    1.  Check `stock >= quantity`.
    2.  Update `products.stock`.
    3.  Upsert into `cart_items`.
    4.  Return success message with new cart total.

#### C. `remove_item_tool`
* **Input:** `product_id` (int), `quantity` (int, default=1).
* **Logic:**
    1.  Verify item exists in `cart`.
    2.  Update `cart_items` (remove or decrease).
    3.  Refund stock to `products`.

#### D. `checkout_tool`
* **Input:** `payment_amount_float` (float).
* **Logic (The "Core" Challenge):**
    1.  Convert payment to cents (int).
    2.  Calculate `total_due`. Check if `payment >= total`.
    3.  Calculate `change_due`.
    4.  **The Twist Algorithm:**
        * If `total_due % 3 == 0`: Use **RandomChangeStrategy** (Generate random denominations that sum up to change).
        * Else: Use **GreedyChangeStrategy** (Minimum amount of coins).
    5.  Set `cart.status = 'completed'`.
    6.  Return formatted string (e.g., "1 dollar, 2 quarters").

---

## 5. Backend API (Flask)

### Middleware Logic
**Intercept `/clear` command:**
Before passing data to the Agent, check if `message.strip() == '/clear'`.
* If True:
    1.  Restore stock for items in the current active cart.
    2.  Delete `cart_items`.
    3.  Reset `cart.history = []`.
    4.  Return "Cart cleared" immediately. **DO NOT invoke LLM.**

### Endpoints

#### `POST /api/chat`
* **Payload:** `{ "session_id": "uuid", "message": "give me two milks" }`
* **Process:**
    1.  Get/Create `cart` by `session_id`.
    2.  Append User Message to `cart.history`.
    3.  Run LangGraph (pass history + current message).
    4.  Append AI Response to `cart.history`.
    5.  Commit to DB.
* **Response:**
    ```json
    {
        "text": "I added 2 Santa Clara Milks. Total: $50.00",
        "cart_data": [ ... ],
        "inventory_data": [ ... ]
    }
    ```

#### `GET /api/state`
* **Query Param:** `session_id`
* **Response:** Returns current Inventory and Cart state (for UI initialization).

---

## 6. Frontend Specification

**Layout:** 3-Column CSS Grid.

1.  **Inventory (Left):**
    * Table: Name | Price | Stock.
    * Read-only. Updates via API response events.
2.  **Chat (Center):**
    * Scrollable message list.
    * User bubbles (Right), AI bubbles (Left).
    * Input field (Bottom). autofocus.
    * **No buttons**. Interaction is purely text-based.
3.  **Cart (Right):**
    * List of items: Name x Qty = Subtotal.
    * **Total Due** (Large text).
    * Updates via API response events.

---

## 7. Ambiguity Handling Strategy

The System Prompt will enforce the following behavior:

1.  **Call `get_product_catalog`** immediately upon a purchase intent.
2.  **Analyze Request:** Compare user input vs. Catalog names.
3.  **Resolution:**
    * *Exact/Obvious Match:* Call `add_item_tool` with the ID.
    * *Multiple Matches:* (e.g., User: "Soda", Catalog: "Grape Soda", "Orange Soda"). **Do NOT guess.** Ask user: "Did you mean Grape or Orange?"
    * *No Match:* Inform user.

## 8. Unit Test

Create unit tests with pytest, only for the tools and database writing, follow a strategy of creating the database in memory for each test.
