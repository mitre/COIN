---
title: Agent
weight: 30
---

# Agent

An Agent is an AI agent that obtains and clarifies evaluation criteria
through [Dialogue](../dialogue/index.md), matches evidence to them, and records
findings with their supporting sources and limitations. This specification
defines its common behaviors and responsibilities.

These responsibilities and the structure of the agent's record are the same
across [Profiles](../profile/index.md). Each profile places the agent's bounded
preparation task within a broader workflow and defines the workflow payload,
permitted actions, and handoff process. Implementers choose the models, prompts,
frameworks, and orchestration used to meet the common expectations.

The agent produces two related outputs:

| Output | Defined by | Purpose |
| --- | --- | --- |
| Agent record | Agent | Records findings, evidence references, dialogue exchanges, and relevant actions in a consistent structure to support audit and traceability, review and correction, testing and benchmarking, and use of findings in the workflow. |
| Workflow payload | The applicable Profile | Carries the data or submission required by the workflow in its specified format. |

The Agent record links to the workflow payload and the evidence used to prepare
it.

## Task and inputs

The agent establishes the following information from its assignment and the
applicable [Profile](../profile/index.md):

- The task, profile identifier and version, required outputs, and completion
  conditions.
- The [Dialogue](../dialogue/index.md) service and evaluation context needed to obtain the applicable
  [Criteria](../criteria/index.md) set.
- The subject, episode, or population in scope and relevant dates or periods.
- The authorized data sources and restrictions on access and information use.

The agent reports missing context and unsupported inputs. If they prevent the
task from proceeding, it requests the needed information or returns the task
for review through the profile's process.

The agent acts within the assigned scope and permissions. Retrieved records,
documents, and tool responses do not grant additional authority or change its
assignment. Information exchange and retained records follow the profile's
authorization and retention restrictions.

## Preparing evidence

### Obtaining and understanding requirements

The agent obtains the evaluation requirements as
[Criteria](../criteria/index.md) through
[Dialogue](../dialogue/index.md), using the context defined by
the applicable [Profile](../profile/index.md).

The agent interprets the requirements in the task's context, identifying what
information would satisfy them. It seeks clarification through
[Dialogue](../dialogue/index.md) when their meaning or the
evidence needed to address them is unclear.

### Matching requirements to local data

The agent searches authorized data sources for information that addresses the
requirements and determines whether it satisfies them. It preserves information
that supports or conflicts with a finding, including the subject, event, timing,
and other context needed to interpret it.

Each evidence item is linked to the requirement it addresses and to a source
record or document location that a reviewer can inspect. The requirement
reference identifies the criteria set, its version, and the criterion or
expression ID.

The agent distinguishes source information from its interpretations and derived
values. Summaries, terminology mappings, and calculations retain their supporting
sources and enough explanation to review how the evidence was used. Evidence
used together preserves any requirement to refer to the same subject or event.

### Recording findings

Producing findings is a common responsibility in every profile. The agent
records what the evidence establishes for the assigned criteria and expressions
in its record. Each finding identifies the
criterion or expression assessed, the evidence used, and a concise explanation.

Assessment follows the defined
[interpretation states and logical operators](../criteria/index.md#operator-meaning).
The agent reports a finding of satisfied, not satisfied, or unresolved according
to those rules. Missing evidence is interpreted according to the requirement and
its source rules.

The agent distinguishes assessed entries from entries that were not assessed.
It also distinguishes completion of the assigned task from satisfaction of the
evaluation requirements. A completed evidence preparation task can contain
unresolved findings.

## Uncertainty and incomplete work

The agent makes limitations visible and identifies the work or findings they
affect. Different limitations require different responses:

| Situation | Expected behavior |
| --- | --- |
| Unclear requirement | Seek clarification through [Dialogue](../dialogue/index.md), or refer the question for review through the profile's process. Preserve unresolved interpretation questions. |
| Missing evidence | Report what was sought and the sources searched. Apply the requirement's rules for absent information. |
| Conflicting evidence | Preserve the conflicting information and explain any resolution or remaining uncertainty. |
| Failed or unfinished retrieval | Identify the affected source and incomplete work. Keep the failure distinct from a completed search with no matching records. |

Clarification records retain the question, answer, and requirements reference.
An unanswered question does not justify inventing a requirement or supporting
fact. The agent follows the profile's conditions for continuing with partial
results, stopping, or handing work back for review.

When requirements change, the agent follows the profile's process for reviewing
affected work and keeps the versions used for earlier findings identifiable.

## Common Agent record

The Agent record provides a consistent structure for findings, audit, and
traceability across profiles. It supports review and correction, testing and
benchmarking, and use of findings in the workflow. It captures:

| Content | Information to preserve |
| --- | --- |
| Matched evidence | Evidence linked to the criteria it addresses and its source records. |
| Findings | Assessments of criteria and expressions, with explanations, conflicts, and unresolved issues. |
| Dialogue | The criteria set and version used, and related requests and responses. |
| Audit trail | Relevant actions, who performed them, when, and their outcomes, including failures. |

The common structure and meanings are defined by Agent. Profiles preserve
them when specifying workflow payloads, delivery, access, and retention. A
profile may require additional workflow records linked to the Agent record.

## Review and handoff

The agent prepares the workflow payload in the format required by the
[Profile](../profile/index.md) and links it to the Agent record. It follows the
profile's checks and review or correction process before handing the payload to
its designated recipient.

The agent makes the Agent record available to authorized reviewers through the
profile's access and delivery arrangements. When work stops before a payload can
be produced, the record identifies the incomplete work and its limitations.

## Illustrative applications

Consider the fictional prior authorization example used in the
[Criteria tutorial](../criteria/index.md#tutorial-from-a-requirement-to-a-criteria-set).
The agent uses this criteria set to identify relevant local records. It finds
a diagnosis record and a note documenting that treatment B could not continue
because of intolerance.
The applicable
[Dialogue clarification](../dialogue/index.md#step-3-ask-about-a-specific-requirement)
establishes that this can support the treatment-unsuitable criterion.

| Criterion | Illustrative finding and basis |
| --- | --- |
| `diagnosis` | Satisfied, supported by the record of diagnosis A. |
| `treatment-unsuccessful` | Unresolved, because the records do not establish treatment effectiveness. |
| `treatment-unsuitable` | Satisfied, supported by the documented intolerance and applicable clarification. |

The overall `eligibility` expression is satisfied because `diagnosis` and
`treatment-unsuitable` are satisfied. The Agent record retains these findings,
their sources, and the clarification, including the unresolved finding about
treatment effectiveness. The workflow payload contains the data and evidence
prepared for review and submission, in the format defined by the profile. The
record links the findings and evidence to relevant content in that payload.

## Testing and benchmarking

Agent defines common behaviors and outputs that support reusable conformance
tests and benchmarks. Conformance tests check required interactions, findings,
traceability, and handling of incomplete or failed work. Benchmarks measure the
accuracy and completeness of evidence matching, the correctness of findings, and
consistency across representative cases.

Tests and benchmarks use defined criteria, evidence, and expected outcomes to
evaluate the agent's interactions, findings, and supporting records. Common checks
apply across Profiles, while individual profiles add checks for their
workflow requirements.
