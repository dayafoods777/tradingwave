# Architecture Decision Records (ADR)
**Classification:** `PROPOSED`

---

## ADR 001: Selection of Fastify over NestJS
- **Status:** Accepted
- **Context:** High throughput required for handling thousands of concurrent webhook signals and real-time execution worker tasks.
- **Decision:** Fastify provides 2x throughput compared to Express/NestJS, low memory overhead, native JSON schema validation, and modular encapsulation plugins.

## ADR 002: Zero-Eval Strategy Representation via Typed JSON AST
- **Status:** Accepted
- **Context:** User-submitted strategy conditions must execute safely without risk of Remote Code Execution (RCE) or arbitrary JavaScript execution.
- **Decision:** Strategies are represented and stored as strictly typed JSON Abstract Syntax Trees. No `eval()`, `new Function()`, or un-sandboxed interpreters are permitted.
