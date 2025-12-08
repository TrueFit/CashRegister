# Instructions for Generating the README.md

Please generate a professional `README.md` file for this project. The document should be directed to a Senior Technical Evaluator.

Mandatory sections with the requested detail:

## 1. Architecture Overview (The "Why")
Explain that this is not a simple script, but a **Stateless Agent / Stateful Database** architecture.
* Highlight that we use **LangGraph** to orchestrate the flow, but persist the history in **SQLite**.
* Explicitly mention that the `/clear` command is intercepted in the backend (Python) and **never touches the LLM** to save latency and costs.

## 2. The Agent Graph (ASCII Art)
Generate a visual representation in ASCII art of the implemented LangGraph graph.
It should clearly show the nodes:
* `Router` (Decision making)
* `Tools` (Inventory, Cart, Payment)
* `ChatBot` (Response generation)
* And the conditional edges.
* *Suggested style:* Simple boxes and arrows.

## 3. "The Twist" & Math Safety (Critical)
Explain how we solved the change calculation problem (Cash Register Problem).
* **IMPORTANT:** Emphasize that **the LLM does NOT do math**. The LLM only extracts the intent and parameters.
* Explain that the calculation happens in a deterministic Python Tool (`checkout_tool`).
* Detail how the "Divisible by 3" logic was implemented:
    * Greedy Strategy (Standard).
    * Random Strategy (The client's "Twist").
* Mention that we use integers (cents) internally to avoid floating-point errors (`float`).

## 4. Handling Ambiguity (AI Engineering)
Describe how the agent handles misspelled products or ambiguous searches.
* Explain the pattern: `Search` -> `Analyze` -> `Ask User` OR `Add Item`.
* Mention the design decision to load the catalog into context (and add the **Scalability Warning** about why this is acceptable for an MVP but would be changed to Vector Search/Trigrams in production).

## 5. Project Structure
Show a simplified directory tree explaining what each folder does, especially the separation between `graph/` (AI logic) and `core/` (business/math logic).

## 6. How to Run
Simple instructions to install dependencies and run the Flask server.

---
**Tone:** Pragmatic, Senior, engineering-oriented.
