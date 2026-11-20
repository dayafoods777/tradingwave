# Disaster Recovery & Emergency Playbooks
**Classification:** `PROPOSED`

---

1. **Broker API Outage Playbook:** Immediate switch to Read-Only mode; notify users via WhatsApp/Push; prevent new entries.
2. **Universal Kill Switch Activation:** Triggered via Admin CLI or Master UI button to execute emergency square-off across all active positions.
3. **Database RPO & RTO:** RPO < 1 minute (WAL archiving to S3); RTO < 15 minutes via RDS automated multi-AZ failover.
