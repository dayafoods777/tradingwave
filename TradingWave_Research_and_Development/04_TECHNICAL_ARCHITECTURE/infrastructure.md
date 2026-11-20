# Infrastructure & Deployment Topology
**Classification:** `PROPOSED`

---

## 1. Production Cloud Topology

- **Compute:** Kubernetes Cluster (EKS / GKE) running containerized Fastify API pods and scalable BullMQ worker pods.
- **Database:** Managed PostgreSQL 16 (AWS RDS Aurora) + TimescaleDB extension.
- **Caching & Queues:** AWS ElastiCache for Redis (Cluster Mode enabled).
- **Object Storage:** AWS S3 for historical backtest report archives and strategy version snapshots.
