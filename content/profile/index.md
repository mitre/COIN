---
title: Profile
weight: 40
---

# Profile

The Profile specification defines the common structure and rules for
describing how COIN is applied to a use case. Each individual
Profile is a separate, reusable, versioned artifact that describes the
broader workflow and its use of [Dialogue](../dialogue/index.md),
[Criteria](../criteria/index.md), and [Agent](../agent/index.md).

A profile combines a [JSON definition](#profile-definition-and-selection) with
workflow documentation. It preserves the required behavior and meanings of the
COIN specifications, including Agent's common record structure.

## Illustrative applications

These examples illustrate choices a Profile could make. They are not complete
Profiles or requirements for these use cases.

| Choice | Prior authorization example | Quality measurement example |
| --- | --- | --- |
| Assigned task | Prepare evidence by matching the requirements for a requested service to local patient records. | Prepare data by matching a measure's data requirements to local records. |
| Evaluation context | Patient, requested service, plan, and requested date. | Defined population, measure version, and reporting period. |
| Prepared information | Data and evidence for review and submission. | Data for review and measure calculation. |
| Human review | Review of evidence and findings before submission to the payer. | Review of data and findings before measure calculation. |

## Proposed profile structure

### Purpose and workflow

A profile describes the use case, intended outcome, and limits of the workflow
it covers. It identifies the participants, their responsibilities, and the
sequence of workflow steps.

The profile places the [Agent and Responder](../dialogue/index.md#roles) within
that workflow. It specifies the agent's preparation task, permitted actions,
and where responsibility passes to other participants.

### Use of COIN

A profile identifies the applicable COIN specification versions and how
evaluation requirements are selected, including their required coverage.
In `requirements` mode, [Dialogue](../dialogue/index.md) supplies them as
[Criteria](../criteria/index.md). The profile identifies the criteria and
expressions assigned for assessment and can require the
[Criteria `result` reference](../criteria/index.md#result) when the workflow
needs a single overall finding.

For Dialogue, the profile defines:

- The mode through `dialogue.mode` in its
  [JSON definition](#profile-definition-and-selection).
- The allowed `context` fields, their types and meanings, and which are required
  initially or may be requested later.
- Whether optional [evidence checks](../dialogue/index.md#evidence-check) must be
  supported or used.

### Data and information exchange

A profile defines the subject, episode, or population in scope and the relevant
dates or reporting periods. It identifies the data sources, or how those sources
are established for an individual task.

The profile specifies the information prepared and exchanged at each workflow
step, its recipients, delivery arrangements, required formats, and conformance
requirements. It identifies applicable standards, APIs, versions or fixed
snapshots, and resource profiles, including accepted evidence media types and
formats for Dialogue evidence checks.

The profile specifies how prepared information is referenced from the record
defined by [Agent](../agent/index.md#common-agent-record). It may require
additional workflow records, specifying their standards, versions, and links to
that record and related information.

### Review and safeguards

A profile specifies who makes decisions, when human review or approval is
required, and who handles questions about requirements, evidence conflicts, or
unresolved work.
It defines how findings inform the workflow and the checks for accepting
prepared information or returning it for correction before subsequent steps.
These checks supplement
[Agent testing and benchmarking](../agent/index.md#testing-and-benchmarking).

The profile establishes when data collection is ready for assessment and how
to handle incomplete retrieval, unavailable sources, and conflicting information.
It defines conditions for continuing with partial results, stopping, or returning
work for review, following
[Agent's expectations for uncertainty and incomplete work](../agent/index.md#uncertainty-and-incomplete-work).
The meaning of missing evidence follows the evaluation requirements and source
rules.

The profile specifies authorized data access, permitted information exchange,
restrictions on evidence use, and retention expectations for evidence and
interaction records, including the record defined by Agent.

It also describes what happens when requirements change or a
[Dialogue](../dialogue/index.md) response expires, including whether evidence
or findings need review again. Original inputs and the versions used remain
identifiable in retained records.

## Profile definition and selection

A profile identifies its title, stable identifier, version, and the organization
responsible for maintaining it. Its JSON definition records the identifier,
version, and [Dialogue](../dialogue/index.md) mode. For example, the illustrative
prior authorization profile used in the
[Dialogue tutorial](../dialogue/index.md#tutorial-from-an-evaluation-to-clarified-requirements)
has this definition:

```json
{
  "id": "https://example.org/coin/profiles/prior-authorization",
  "version": "draft",
  "dialogue": {
    "mode": "requirements"
  }
}
```

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `id` | string (URI) | Yes | Stable identifier for the profile. |
| `version` | string | Yes | The profile revision. There is no prescribed version-number format. |
| `dialogue` | object | Yes | Settings for [Dialogue](../dialogue/index.md). |
| `dialogue.mode` | string | Yes | The mode used for dialogues under this profile. Currently, only `requirements` is defined. |

Field names and values are case-sensitive. Strings must be nonempty.
[Dialogue](../dialogue/index.md) defines the behavior and response structure of
each mode.

The JSON definition and accompanying workflow documentation share the same
identifier and version. Each pair identifies fixed content; changes to either
receive a new version. Profile versions are separate from policy, measure, and
criteria set revisions.

A Responder advertises supported Profiles and versions through
[Dialogue's supported profiles endpoint](../dialogue/index.md#supported-profiles).
The Agent selects an applicable supported version and identifies it through
`profile.id` and `profile.version` when
[starting a dialogue](../dialogue/index.md#start-a-dialogue). The referenced profile
determines the mode; the request carries no separate mode field. Profile
definitions are obtained separately or already known to the participants.
Advertising support does not grant access or permission to perform the workflow.
