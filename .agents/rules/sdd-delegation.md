---
description: "Enforces strict dynamic sub-agent delegation for all SDD phases"
trigger: "always_on"
---

# Strict SDD Dynamic Subagent Delegation Rule

When an SDD workflow is requested or active (e.g. sdd-explore, sdd-propose, sdd-spec, sdd-design, sdd-tasks, sdd-apply, sdd-verify, sdd-archive):

1. **Zero Inline Execution**: The orchestrator thread MUST NEVER write, draft, or synthesize SDD phase artifacts (proposals, specs, designs, task breakdowns, code implementations, or verify reports) directly in the main conversation thread.
2. **Mandatory Dynamic Subagent Sequence**: For every phase:
   - Read the corresponding `SKILL.md` from `~/.gemini/skills/sdd-{phase}/SKILL.md` or `.agents/skills/{phase}/SKILL.md`.
   - Register the subagent dynamically using `define_subagent` with the skill instructions as the system prompt and appropriate tool permissions (`enable_write_tools`, `enable_mcp_tools`).
   - Invoke the subagent using `invoke_subagent` with the approved scope, constraints, and artifact references.
   - Wait for the subagent to finish and report back. The orchestrator only performs high-level synthesis, user confirmation, and DAG transition routing.
3. **No Shortcuts for Planning Mode**: Antigravity's standard planning mode must never bypass individual phase sub-agent delegation when SDD is explicitly requested or active.
