# REA Capability Inventory
**Classification:** `VERIFIED`

---

## 1. Active vs Unavailable Capability Groups

| Capability Group | Status | Available Tools / Modules | Host / Provider Notes |
|---|---|---|---|
| **Web & JavaScript Analysis** | `AVAILABLE` | `inspect_web_page`, `analyze_web_bundle`, `capture_browser_scenario`, `export_web_scripts` | Native CDP & bundle parser active |
| **Artifact & Archive Graph** | `AVAILABLE` | `inspect_artifact`, `extract_artifact`, `trace_dylib_resolution` | macOS safe artifact provider active |
| **Managed .NET Static** | `AVAILABLE` | `inspect_managed_artifact`, `inspect_managed_members` | CLI/PE metadata decoders active |
| **Native Disassembly** | `AVAILABLE` | Hopper Disassembler bound; macOS native inspection utilities | Hopper available on macOS |
| **Ghidra Engine** | `UNAVAILABLE` | Requires `GHIDRA_INSTALL_DIR` configuration | Target is web SaaS; Ghidra not required |
| **Android APK (JADX)** | `UNAVAILABLE` | Requires `REA_JADX_MCP_JAR` | Target is web SaaS; Android reverse engineering not required |
