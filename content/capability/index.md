---
title: Capability
weight: 40
category: Specification
subcategory: Artifacts
---

# Capability

A Capability specifies an ability or data access guarantee that an
implementation must provide to an agent. A [Profile](../profile/index.md)
defines the required Capabilities and identifies the participant roles that
need them.

A Capability can require access to a particular API or collection of documents,
or an ability such as submitting a FHIR Bundle to a designated endpoint. Its
definition states what the agent must be able to do or access, the scope of
that requirement, and the conditions under which it applies.

Implementations choose how to provide the required ability or access unless
the Profile specifies an interface.

## Defining a Capability

A Profile gives each Capability an identifier and specifies:

| Area | Required description |
| --- | --- |
| Requirement | The ability or data access that must be available to the agent. |
| Participant roles | The roles whose agents require the Capability and the tasks it supports. |
| Scope | The tasks, information, sources, subjects or populations, and time periods covered, or how these are established for a task. |
| Standards and interfaces | Any required standards, certifications, APIs, formats, or interfaces, including applicable versions and constraints. |
| Conditions of use | Authorization and configuration requirements, permitted actions, and when the Capability must be available. |
| Results and limitations | Expected results and how unavailable abilities, restricted access, failures, or incomplete work are reported and handled. |

Capability definitions are part of the fixed content identified by the
Profile's version. Their requirements and meanings remain consistent across
implementations of that version. Deployment-specific connection details are
supplied through configuration under the Profile's rules.

A Profile can reference an existing API or standard to establish a requirement.
It can also define specific operations, inputs, or outputs when the workflow
requires them.

## Data access guarantees

A data access guarantee specifies the information or service an agent must be
able to access. It identifies the required sources and data coverage, or how
these are established for a task. For example, a Capability can require access
to a FHIR API, patient documents, or a dataset used for quality measurement.

The Profile specifies any required representations and the source references
and context needed to interpret the information. It defines how retrieval scope,
limits, and incomplete results are reported. When a retrieval returns part of a
collection, its results must make the extent of retrieval clear under those rules.

The guarantee concerns access within the defined scope. Whether retrieved
information satisfies an evaluation requirement is assessed separately.
A completed retrieval with no matching records remains distinguishable from
restricted, unavailable, or unfinished retrieval.

## JSON representation

The Profile includes Capability definitions in the
[`capabilities` array](../profile/index.md#identification-and-versioning) of its
JSON metadata.

The [JSON conventions](../conventions/index.md#json-conventions) apply to the
Capability object. Requirements are expressed in prose within a small set of
fields.

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `id` | string | Yes | Identifier unique within the Profile. |
| `description` | string | Yes | The required ability or data access guarantee. |
| `scope` | string | Yes | The boundaries of the requirement, or a reference to the relevant scope within the same Profile. |
| `requirements` | string[] | No | One or more additional requirements, such as applicable standards, expected results, or conditions of use. |

The `description` states the requirement that applies within the `scope`.
Every entry in `requirements`, when present, must also be met. Role assignments
and surrounding workflow policies are specified in the enclosing Profile.
The Capability inherits the Profile's version.

The following example requires access to the FHIR API of a Health IT Module
certified to
[45 CFR 170.315(g)(10)](https://healthit.gov/test-method/standardized-api-for-patient-and-population-services-acb-atl/).
The hypothetical Profile assigns this Capability to the Preparer and selects
the standard versions shown.

```json
{
  "id": "fhir-patient-data",
  "description": "Authorized access to the FHIR API of a Health IT Module certified to 45 CFR 170.315(g)(10).",
  "scope": "The patient identified by the task context, within the implementing organization's clinical system.",
  "requirements": [
    "Provide read and search access using FHIR R4 (4.0.1) and US Core 6.1.0.",
    "Preserve source references and report restricted, unavailable, or incomplete retrieval."
  ]
}
```

Implementing this guarantee includes establishing usable access for the Preparer
under the Profile's authorization rules.

An ability can use the same structure. For example, a Profile could require
submission of a [FHIR Bundle](https://hl7.org/fhir/R4/bundle.html). The Profile
specifies the Bundle's required content, submission interaction, and meaning of
the response. Deployment configuration supplies the endpoint address.

```json
{
  "id": "bundle-submission",
  "description": "Submit a FHIR Bundle to the designated endpoint.",
  "scope": "Bundles prepared for the assigned workflow and the receiving service configured under the Profile.",
  "requirements": [
    "Use the FHIR version, Bundle type, and submission interaction specified by the Profile.",
    "Follow the Profile's authorization and review requirements before submission.",
    "Report the submission outcome, including any response, failure, or uncertainty."
  ]
}
```

Validation checks the field structure, identifier uniqueness, and consistency
with the enclosing Profile. Implementation checks establish whether the agent
has the required ability or access.

## Providing a Capability

An implementation must provide each required Capability to the agents
performing the corresponding participant role. This includes configuring the
agent's environment and establishing authorized access to any required systems
and data sources. The agent must be able to use the provided ability or access
for its assigned task.

Implementations can use different tools and integration methods while meeting
the same requirements. Conformance checks exercise the required abilities and
access under the Profile's conditions, including any specified interfaces,
expected results, and data coverage.

When a required ability or access is unavailable, the implementation
identifies the affected Capability and scope and follows the Profile's rules
for continuing, stopping, or returning work for review. Incomplete or failed
work must remain visible in the results and related workflow records.

Relevant actions, sources, results, and limitations are documented in
the participant's [Activity Record](../activity-record/index.md), linked to the
applicable Profile and Capability definitions.
