---
title: Profile
weight: 30
category: Specification
subcategory: Artifacts
---

# Profile

A Profile is a reusable, published specification that gives people and agents
directions for using COIN in a particular use case. It describes the
workflow, participant roles, information exchanges, outputs, and safeguards, and
how COIN fits within that workflow. Each Profile is versioned and preserves the
behavior and meanings of the COIN components it uses.

Each Profile specifies a single interaction model, either
[Disclosure](../disclosure/index.md) or [Inquiry](../inquiry/index.md). A workflow
may include several COIN exchanges, all following the model specified by the
Profile. The Profile defines where they occur and how their results are used.

A single agent implementation may support both interaction models and multiple
Profiles. For each task, the selected Profile tells the agent how to act in its
assigned role and what behavior and information to expect from other
participants.

## Scope and reuse

Different organizations and evaluating programs can use the same Profile when
they share its workflow, interfaces, and required data. The Profile establishes
the common requirements. Participating organizations take on its roles and
provide the systems and data access needed to fulfill them.

| Scope | Defines |
| --- | --- |
| Profile | Participant roles, workflow, context fields, required abilities and data access, output formats, and review and completion rules. |
| Implementation | Services and data connections that support each participating organization's role, including service addresses and handoff destinations. |

Each time the Profile is used, participants supply the relevant context, such as
the patient, episode, program, and dates. Their
[Activity Records](../activity-record/index.md) document the work performed and
its outputs.

Under Disclosure, each Evaluator supplies its program's applicable Criteria when
the Profile is used. Programs can have different Criteria while using the same
Profile, provided their requirements fit its workflow and data coverage.

## Creating a Profile

Creating a Profile starts with the workflow's purpose, participant roles, and
intended outcome. Its documentation connects those choices to the interaction
model, the information exchanged, and the review and handoff steps.

### Purpose and participants

A Profile describes the use case, intended outcome, and limits of the workflow.
It identifies participant roles, their responsibilities, and the sequence of
steps. For each task, it specifies permitted actions, required outputs, completion
conditions, and where responsibility passes to another participant.

### Use of COIN

A Profile identifies the applicable COIN specification version and components,
selects an interaction model, and defines where and how COIN is used in the
workflow.

The Profile defines the task's required and optional context fields, including
their types and meanings. The participant initiating an interaction supplies
the required context and may include optional context upfront. Other participants
may request omitted optional context when needed for the task.

The Profile also specifies which optional capabilities of the interaction model
must be supported or used.

### Data and information exchange

A Profile defines how a task establishes its subject, episode, or population
and relevant dates or reporting periods. It specifies required data coverage
and how implementations or individual tasks establish the sources that
provide it.

The Profile specifies the information prepared and exchanged at each workflow
step, its recipients, delivery arrangements, required formats, and conformance
requirements. It identifies applicable standards, APIs, and data models,
including their versions or fixed snapshots and any additional constraints.
It specifies how each participant's
[Activity Record](../activity-record/index.md) refers to outputs, supporting
evidence, and any additional workflow information.

### Capabilities

A Profile defines the [Capabilities](../capability/index.md) required by agents
in each participant role. Each Capability specifies an ability or data access
guarantee that implementations must provide, such as access to a specified FHIR
API or the ability to submit a FHIR Bundle to a designated endpoint.

The Profile states the required ability or access, its scope and conditions of
use, and any applicable standards, certifications, or interfaces. Implementations
choose how to meet those requirements unless the Profile specifies a method or
interface. The Profile establishes the authorization, availability, expected
results, and handling of limitations needed for the workflow.

### Review and safeguards

A Profile specifies who makes decisions, when human review or approval is
required, and who handles questions, conflicting information, or unresolved work.
It defines checks for accepting outputs or returning work for correction before
subsequent steps.

The Profile defines how to handle incomplete retrieval, unavailable sources,
and conflicting information, including conditions for continuing with partial
results, stopping, or returning work for review. It specifies authorized data
access, permitted information exchange, and restrictions on evidence use.

The Profile describes how changes to inputs or other workflow conditions affect
continued work and review. Original inputs and the versions used remain
identifiable in Activity Records.

### Identification and versioning

A Profile identifies its title, stable identifier, version, and the organization
responsible for maintaining it. These details are published with the Profile.
The identifier, version, and interaction model are also represented as JSON
metadata. For example, a prior authorization Profile could include:

```json
{
  "id": "https://example.org/coin/profiles/prior-authorization",
  "version": "draft",
  "interaction": "disclosure"
}
```

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `id` | string (URI) | Yes | Stable identifier for the Profile. |
| `version` | string | Yes | The Profile revision, following the [version conventions](../conventions/index.md#version-identifiers). |
| `interaction` | string | Yes | Exactly one value, `disclosure` for Disclosure or `inquiry` for Inquiry. Applies to every COIN exchange under the Profile. |
| `capabilities` | [Capability](../capability/index.md#json-representation)[] | When Capabilities are defined | One or more definitions of required abilities or data access guarantees. Omit when no Capabilities are defined. |

Profile metadata follows the [JSON conventions](../conventions/index.md#json-conventions).
Selecting a Profile establishes the interaction model before exchanges begin.

The `capabilities` array contains definitions following the
[Capability format](../capability/index.md#json-representation). Participant role
assignments and the surrounding workflow requirements are documented in the
Profile.

The Profile document and its JSON metadata share the same identifier and
version. Each version identifies fixed content; changes to the document or
metadata receive a new version. Profile versions are separate from COIN
specification, API, policy, measure, and
[Criteria set revisions](../criteria/index.md#identifiers-and-versions).

Changing a participating organization, service address, task context, or a
program's Criteria does not by itself change the Profile or its version.
The same version remains applicable while its shared requirements still cover
the workflow and required information.

### Illustrative applications

These examples illustrate tasks, context, and review steps a Profile can define.

| Workflow | Assigned task | Task context | Review and use |
| --- | --- | --- | --- |
| Prior authorization | Prepare information for review of a requested service. | Patient, service, plan, and requested date. | Review the information before submitting the request to the payer. |
| Quality measurement | Gather and organize data for measure calculation. | Population, measure version, and reporting period. | Review data and unresolved issues before calculation. |
| Specialist referral | Gather information needed for a specialist's review. | Patient, referral reason, and relevant history. | Review the information and any gaps before handoff to the specialist. |

## Using a Profile

People use the published Profile to implement and operate the workflow and
review its results. This includes configuring supporting systems, data
connections, and handoff destinations.

Agents use the same Profile, together with their assigned role and task
context, as directions for their work. It guides what information to gather,
which exchanges to perform, what outputs to produce, and when to seek review or
hand off work.

### Implementing a participant role

The implementation provides the COIN interactions,
[Capabilities](../capability/index.md), data preparation, outputs, review and
handoff steps, and [Activity Records](../activity-record/index.md) required for
the participant role it supports.

The implementation makes the applicable Profile directions available to the
agent along with its assigned role and task context.

The implementation follows the standards and constraints specified by the
Profile, including API behavior, data models, formats, and terminology.
Implementers use the specified versions and preserve required meaning and source
references when mapping or transforming data.

### Verifying the implementation

Implementers verify conformance to the Profile and its interaction model
for the roles they support. Checks cover required abilities and data access,
exchanges and outputs, applicable data constraints, access controls,
review and handoff, Activity Records, and handling of incomplete information and
failures.

Data validation checks the formats, terminology, and constraints specified by
the Profile. Tests also exercise the workflow across participants, including
unresolved or conflicting information.

### Following the workflow

Before work begins, participants confirm that their systems support the same
Profile and version, supply the required context, and verify that the required
Capabilities are available and that the task and data access are authorized.

Participants follow the Profile's responsibilities and permitted actions
throughout the task, including work performed outside COIN exchanges. They prepare
the required outputs and use the Profile's completion conditions, acceptance
checks, and review process to determine when work is ready for handoff.

Agents also use the Profile's description of other roles to determine what
information or action to request and which responses or handoffs to expect.

When information is missing or conflicting, or work is incomplete, participants
follow the Profile's conditions for continuing, stopping, or returning work for
review. Each participant's Activity Record refers to its outputs and supporting
information. These materials are shared under the Profile's access rules.

The selected Profile and version remain fixed for related exchanges. In
[Disclosure](../disclosure/index.md#identifiers-and-versions), changing either
requires a new requirements request. When inputs or other workflow conditions
change, participants follow the Profile's process for reviewing affected work.
Activity Records identify the original inputs and the versions used.
