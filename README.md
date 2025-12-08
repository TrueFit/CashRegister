# AI Agent Cash Register

## 1. Architecture Overview (The "Why")

This project implements a robust **Stateless Agent / Stateful Database** architecture, designed to handle the complexities of a conversational commerce interface while ensuring data integrity and scalability.

*   **LangGraph Orchestration:** We utilize **LangGraph** to manage the conversational flow and state transitions. The agent itself is stateless between turns; the conversation history and state are reconstructed for each request.
*   **Stateful Persistence (SQLite):** All critical data—cart contents, inventory, and conversation history—is persisted in a **SQLite** database. This ensures that the application can survive server restarts and allows for complex, multi-turn interactions without losing context.
*   **Optimized Command Handling:** The `/clear` command is intercepted directly in the backend (Python) and **never touches the LLM**. This design decision significantly reduces latency and API costs for administrative actions, ensuring a snappy user experience for reset operations.

## 2. The Agent Graph

The following ASCII art illustrates the decision-making flow within the LangGraph agent:

```ascii
                 +----------------+
                 |    START       |
                 +-------+--------+
                         |
                         v
                 +-------+--------+
                 |    ChatBot     |
                 | (LLM + Tools)  |
                 +-------+--------+
                         |
           +-------------+-------------+
           |                           |
  [Tool Call?] --(Yes)--> +------------v-----------+
           |              |      Tools Node        |
           |              | (Inventory, Cart, Pay) |
           |              +------------+-----------+
           |                           |
           |                           |
           +<-----------(Output)-------+
           |
           v
    [Response to User]
           |
           v
          END
```

*   **ChatBot Node:** The core reasoning engine using **gpt-5-nano**. It analyzes user intent and decides whether to call a tool or respond directly.
*   **Tools Node:** Executes deterministic Python functions (e.g., `add_item`, `checkout`) when requested by the ChatBot.
*   **Conditional Edge:** A router determines if the flow should loop back to the ChatBot (after a tool execution) or end the turn.

## 3. "The Twist" & Math Safety (Critical)

A core requirement was to solve the "Cash Register Problem" with a specific twist, while ensuring financial accuracy.

*   **Deterministic Math:** **The LLM does NOT do math.** Relying on an LLM for arithmetic is a known anti-pattern. Instead, the LLM extracts the *intent* (e.g., "checkout with $50") and passes parameters to the `checkout_tool`. The actual calculation is performed by Python code.
*   **Integer Precision:** All monetary values are stored and calculated as **integers (cents)** to strictly avoid floating-point precision errors common in financial software.
*   **The "Twist" Implementation:**
    *   **Standard Logic:** For most transactions, a **Greedy Strategy** is used to minimize the number of coins/bills returned.
    *   **Divisible by 3 Logic:** If the total amount due is divisible by 3 (e.g., $3.00), the system switches to a **Random Change Strategy**. This strategy randomly selects valid denominations until the correct change amount is reached, adding a playful element to the interaction while maintaining mathematical correctness.

## 4. Handling Ambiguity (AI Engineering)

The agent is engineered to handle vague or misspelled user requests gracefully, prioritizing accuracy over guessing.

*   **Search & Analyze:** When a user requests an item (e.g., "Coke"), the agent first uses the `get_product_catalog` tool to inspect available options.
*   **Clarification Loop:** If multiple matches are found (e.g., "Coca Cola Original" and "Coca Cola Zero"), the agent is instructed via the System Prompt to **ask the user for clarification** rather than making an assumption.
*   **Context Loading:** For this MVP, the product catalog is loaded into the context.
    *   *Scalability Note:* While efficient for a small inventory, a production system with thousands of SKUs would replace this with a Vector Store (RAG) or Trigram search to retrieve only relevant items, ensuring the context window remains manageable.

## 5. Project Structure

```text
.
├── api/
│   └── routes.py           # Flask endpoints (Chat, State, /clear logic)
├── core/                   # (Conceptually represented by utils/ and db/)
├── db/
│   ├── database.py         # SQLAlchemy setup and session management
│   └── models.py           # Database schema (Product, Cart, CartItem)
├── graph/
│   ├── agent.py            # LangGraph state graph definition
│   ├── nodes.py            # ChatBot node logic
│   ├── tools.py            # AI Tools (Catalog, Add/Remove, Checkout)
│   └── prompts.py          # System Prompt engineering
├── utils/
│   └── change_calculator.py # Core business logic (Greedy & Random strategies)
├── static/                 # Frontend assets (HTML, CSS, JS)
├── tests/                  # Unit tests
├── app.py                  # Application entry point
└── requirements.txt        # Project dependencies
```

## 6. Test Results & Validation

The system has undergone rigorous blackbox integration testing. The full report is available in [TEST_REPORT.md](./TEST_REPORT.md).

**Test Coverage Summary:**
We successfully validated 5 critical scenarios:
1.  **Happy Path:** Standard flow of adding items and checking out.
2.  **Stock Limit Protection:** Verifying the agent respects inventory limits.
3.  **The "Twist":** Confirming the Random Change Strategy triggers correctly for totals divisible by 3.
4.  **Multiple Items:** Ensuring the cart correctly aggregates different products and calculates totals.
5.  **Ambiguity Resolution:** Verifying the agent asks for clarification on ambiguous requests.

**Key Validations:**
*   ✅ **Math Safety:** Confirmed that all calculations are accurate and performed deterministically.
*   ✅ **Database Consistency:** No orphaned records or negative stock states were observed.
*   ✅ **AI Behavior:** The agent correctly orchestrates tools and handles user dialogue.

## 7. How to Run

1.  **Install Dependencies:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

2.  **Run the Server:**
    ```bash
    python app.py
    ```
    The application will start on `http://localhost:5000` (or 5001 if 5000 is busy).

3.  **Access the UI:**
    Open your browser to the URL displayed in the terminal.
