# Secrets Management & Key Rotation
**Classification:** `PROPOSED`

---

- Broker API secrets, access tokens, and passwords are encrypted at rest using AES-256-GCM.
- Encryption keys are stored in AWS KMS / HashiCorp Vault.
- Plaintext secrets never appear in application logs or error stack traces.
