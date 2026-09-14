---
title: Walkthrough
weight: 1
category: Getting Started
---

# Walkthrough

A clinic preparing a patient's enrollment request needs to connect the
information in its records with the support program's requirements. That
involves finding relevant evidence, clarifying what the requirements mean, and
making any gaps visible to the people reviewing the request.

This walkthrough introduces Conversational Interoperability (COIN) through a
fictional example of that work. It shows how an AI agent can gather and interpret
records, ask the program's service for clarification, and prepare evidence for
human review.

## The scenario

A clinic is helping a patient enroll in a support program. Before reviewing
enrollment, the program needs evidence of a signed participation form and completed
orientation. It also accepts prior orientation when the program has approved it
for the current enrollment episode.

The relevant information is in the clinic's systems. Participation forms are
structured records, while staff describe orientation sessions in notes. A clinic
coordinator needs to gather that information, understand whether it addresses
the program's requirements, and identify anything that still needs attention.

The clinic's AI agent helps prepare the evidence. It obtains the program's
requirements, retrieves the clinic's records, asks the program's service about
unclear terms, and records findings with their supporting information. The
coordinator reviews the work before sending it to the program's review team,
which makes the enrollment decision.

The organizations, patient, program, and policy in this example are fictional.

## The flow at a glance

The task begins with the coordinator identifying the patient and enrollment
being prepared. The clinic's agent learns what the program requires, gathers
records, and resolves questions about their meaning. It produces an evidence
packet that lets reviewers inspect both the information found and how the
agent used it.

1. The coordinator assigns the enrollment task.
2. The clinic's agent obtains the program's requirements.
3. The agent gathers records and asks the program's service to clarify questions.
4. The agent prepares findings and evidence.
5. The coordinator reviews the packet and sends it to the program's review team.
6. The program's review team makes the enrollment decision.

## Walk through one task

In COIN, the clinic is the Preparing Party and its AI agent is the Preparer.
The program is the Evaluating Party and its service is the Evaluator. This
workflow uses [Disclosure](../disclosure/index.md), in which the Evaluator
supplies requirements upfront and the Preparer gathers and assesses evidence.

The clinic and program need shared rules for data access, exchanges, outputs,
and human review. COIN captures those rules in a [Profile](../profile/index.md).
This example assumes that both systems support the same enrollment Profile.
The final section builds that Profile step by step from the workflow, explaining
the choices needed to make it reusable.

### 1. Assign the task

On August 8, 2026, the coordinator asks the clinic's AI agent, the Preparer, to
gather and assess information for the patient's enrollment review.

The clinic's workflow provides the agent with the patient, enrollment episode,
support program, and review date. These details establish whose records are
relevant, which enrollment they concern, and the last date in scope. How the
coordinator starts the task and how these details reach the agent depend on the
clinic's implementation.

The clinic authorizes the agent to retrieve relevant records, obtain and clarify
the program's requirements, and prepare evidence for review. The coordinator
reviews the results and performs the handoff.

The Preparer records the assignment, its context, and the agreed Profile and
version in an [Activity Record](../activity-record/index.md). The record documents
its actions, exchanges, and outputs as the work proceeds.

### 2. Obtain the program's requirements

The Preparer asks which requirements apply to the selected program and review
date. Disclosure uses an HTTP API with JSON bodies. Requests use HTTPS and
authorized access, with API paths relative to the configured Evaluator origin.

```text
POST /coin/v0/requirements
Content-Type: application/json
```

```json
{
  "profile": {
    "id": "https://example.org/coin/profiles/example-enrollment",
    "version": "1"
  },
  "context": {
    "program": "example-support",
    "reviewDate": "2026-08-08"
  }
}
```

The `profile` reference selects the shared workflow. COIN defines the request's
`context` object, and the Profile defines the fields inside it. This enrollment
Profile requires the Preparer to supply `program` and `reviewDate` so the
Evaluator can select requirements. The clinic's patient and episode identifiers
are used for its own record retrieval and are omitted from this request.

The Evaluator returns `200 OK` with a matched response containing a
[Criteria](../criteria/index.md) set.

```json
{
  "outcome": "matched",
  "response": {
    "id": "example-response-1",
    "issuedAt": "2026-08-08T14:01:00Z",
    "evaluator": {
      "id": "https://example.org/program/evaluator",
      "name": "Program Evaluator"
    },
    "evaluatingParty": {
      "id": "https://example.org/program",
      "name": "Support program"
    },
    "scope": "Participation-form and orientation requirements for the support program and requested August 2026 review date. The program review team makes the subsequent enrollment decision.",
    "requirements": {
      "content": {
        "id": "example-enrollment",
        "metadata": {
          "version": "1",
          "title": "Support program enrollment requirements",
          "source": "Fictional support program enrollment policy, version 1, requirements and established interpretations. https://example.org/program/policies/enrollment/1"
        },
        "criteria": [
          {
            "id": "participation-form",
            "statement": "The provider's enrollment file contains a signed participation form for the selected program, patient, and enrollment episode, dated on or before the review date. A complete search of that file with no qualifying form establishes that this documentation requirement is not satisfied."
          },
          {
            "id": "live-orientation",
            "statement": "The patient completed live orientation for the selected program and this enrollment episode on or before the review date. Absence of a record does not establish that orientation did not occur; the finding remains unresolved when the available evidence cannot establish completion."
          },
          {
            "id": "prior-orientation",
            "statement": "The selected program accepted the patient's prior orientation with that program for this enrollment episode on or before the review date. Absence of a record does not establish that acceptance did not occur; the finding remains unresolved when the available evidence cannot establish acceptance."
          }
        ],
        "expressions": [
          {
            "id": "orientation-requirement",
            "operator": "any",
            "operands": [
              "live-orientation",
              "prior-orientation"
            ]
          },
          {
            "id": "enrollment-requirements",
            "operator": "all",
            "operands": [
              "participation-form",
              "orientation-requirement"
            ]
          }
        ],
        "result": "enrollment-requirements"
      }
    }
  }
}
```

The three criteria identify requirements that can be assessed individually.
The expressions make their relationships explicit. `orientation-requirement`
uses `any` because either orientation pathway can qualify.
`enrollment-requirements` uses `all` because the form and orientation requirement
must both be satisfied. `result` identifies the expression for the overall
finding.

The response ID, `example-response-1`, fixes the requirements and context for
subsequent clarification. The response also identifies the Evaluator, the
Evaluating Party, and the scope of the requirements supplied.

### 3. Retrieve the clinic's records

The Preparer now needs evidence for those requirements. The example's enrollment
Profile defines a [Capability](../capability/index.md) named `enrollment-data`,
which exposes the clinic's enrollment records through an MCP tool,
`get_enrollment_records`.

The agent's host invokes the tool with an MCP `tools/call` request. Its arguments
identify the patient, enrollment episode, program, and review date.

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_enrollment_records",
    "arguments": {
      "patientId": "patient-17",
      "episodeId": "episode-4",
      "program": "example-support",
      "reviewDate": "2026-08-08"
    }
  }
}
```

The tool searches the forms and orientation sources. The following object is
its response's `result.structuredContent`. The complete MCP response also
contains the result as serialized JSON text and is retained in the
[Preparer's Activity Record](profile/preparer-record.json).

```json
{
  "patientId": "patient-17",
  "episodeId": "episode-4",
  "program": "example-support",
  "reviewDate": "2026-08-08",
  "sources": [
    {
      "name": "forms",
      "status": "complete",
      "detail": "The complete forms source for patient-17, episode-4, program example-support, through 2026-08-08 UTC was searched. One record was found and returned.",
      "records": [
        {
          "id": "urn:example:clinic:form:12",
          "format": "application/json",
          "content": {
            "status": "signed",
            "signedOn": "2026-08-06"
          }
        }
      ]
    },
    {
      "name": "orientation",
      "status": "complete",
      "detail": "The complete orientation source for patient-17, episode-4, program example-support, through 2026-08-08 UTC was searched. One note and no recorded acceptance of prior orientation were found.",
      "records": [
        {
          "id": "urn:example:clinic:note:34",
          "format": "text/plain",
          "content": "The patient completed the program's orientation in a live video session with a program instructor for this enrollment episode. The session finished on August 7, 2026."
        }
      ]
    }
  ]
}
```

Both sources report `complete`, so the Preparer can distinguish an absent record
from an unfinished search. The retrieved form is signed and dated August 6.
The note describes a live video orientation completed on August 7. No acceptance
of prior orientation was found.

The tool provides records and retrieval status. The Preparer still has to
interpret the records against the requirements, preserving their patient,
episode, program, and timing relationships.

### 4. Clarify what the orientation requirement means

The note describes a video session, but the criterion says “live orientation.”
The Preparer asks the Evaluator whether that kind of session qualifies.

```text
POST /coin/v0/requirements/example-response-1/clarify
Content-Type: application/json
```

```json
{
  "targetId": "live-orientation",
  "question": "Does live orientation include a real-time video session with a program instructor?"
}
```

The path identifies the original requirements response. `targetId` identifies
the criterion within its Criteria set. The question can therefore be interpreted
against the same requirements and context that the Preparer is using.

The Evaluator consults the program's established guidance and returns `200 OK`.

```json
{
  "outcome": "clarified",
  "explanation": "Live orientation includes a real-time session with a program instructor, either in person or by video. A prerecorded session alone does not qualify."
}
```

This explains the requirement. The Preparer uses the note to establish that
the patient completed the qualifying session for this episode by the review
date. Both participants retain the exchange in their Activity Records; the
Evaluator also records the policy source supporting its answer.

### 5. Assess the evidence and record findings

With both sources fully searched and the clarification available, the Preparer
assesses all three criteria and both expressions. Each finding records a state,
an explanation, and references to its basis.

| Entry | Finding | Basis |
| --- | --- | --- |
| Participation form | Satisfied | A signed form for the patient's episode dated August 6. |
| Live orientation | Satisfied | The August 7 note, interpreted using the program's clarification. |
| Prior orientation | Unresolved | The completed retrieval found no record establishing the program's acceptance. |
| Orientation requirement | Satisfied | The live-orientation pathway satisfies `any`. |
| Enrollment requirements | Satisfied | Both the form and orientation requirement satisfy `all`. |

The unresolved alternative remains visible even though the overall expression
is satisfied. The overall finding describes the evidence against the supplied
requirements. The program's review team makes the subsequent enrollment decision.

For example, the Activity Record contains this live-orientation finding.

```json
{
  "targetId": "live-orientation",
  "state": "satisfied",
  "explanation": "The note records a completed live video orientation for this enrollment episode. The program's clarification confirms that real-time video qualifies.",
  "basis": [
    "#/activities/2/exchange/response/result/structuredContent/sources/1/records/0",
    "#/activities/3/exchange/response/body"
  ]
}
```

The first `basis` reference points to the note in the retained MCP response.
The second points to the clarification response. These JSON Pointers locate
content within the same Activity Record, so a reviewer can inspect the evidence
and explanation used together.

The record's assessment links to the matched requirements response and lists all
assigned target IDs. A missing-evidence finding refers to the completed retrieval;
an expression finding refers to its operand findings. Conflicting information
and unresolved interpretations remain visible in the record.

### 6. Prepare the evidence payload

The Preparer prepares evidence in the format required by the Profile. This
example's enrollment Profile chooses a JSON object with `profile`, `context`,
and `items` fields. The Preparer copies the signed form and orientation note
into that format, with references back to their locations in the Activity Record.

```json
{
  "profile": {
    "id": "https://example.org/coin/profiles/example-enrollment",
    "version": "1"
  },
  "context": {
    "patientId": "patient-17",
    "episodeId": "episode-4",
    "program": "example-support",
    "reviewDate": "2026-08-08"
  },
  "items": [
    {
      "id": "urn:example:clinic:form:12",
      "format": "application/json",
      "content": {
        "status": "signed",
        "signedOn": "2026-08-06"
      },
      "source": "https://mitre.github.io/COIN/walkthrough/profile/preparer-record.json#/activities/2/exchange/response/result/structuredContent/sources/0/records/0"
    },
    {
      "id": "urn:example:clinic:note:34",
      "format": "text/plain",
      "content": "The patient completed the program's orientation in a live video session with a program instructor for this enrollment episode. The session finished on August 7, 2026.",
      "source": "https://mitre.github.io/COIN/walkthrough/profile/preparer-record.json#/activities/2/exchange/response/result/structuredContent/sources/1/records/0"
    }
  ]
}
```

This example's payload preserves the retrieved content without conversion.
The Activity Record explains how that content was obtained and assessed,
including the unresolved prior-orientation finding. Together they form the
packet for review, along with any referenced content needed to inspect it.

### 7. Review and hand off

The coordinator checks that the packet concerns the correct patient, episode,
program, and dates. The review also checks source support, the interpretation of
the orientation note, completeness, and unresolved work. The coordinator can
return the preparation for correction or approve handoff.

In this task, the coordinator reviews the unresolved alternative and approves
the packet. The coordinator sends it to the program's review team using the
configured delivery method and records the delivery. The team can inspect the
findings and their supporting information when making its enrollment decision.

The completed [Preparer Activity Record](profile/preparer-record.json) includes
assignment, exchanges, assessment, payload preparation, review, and handoff.
The [Evaluator Activity Record](profile/evaluator-record.json) contains its
requirements and clarification exchanges and their supporting policy sources.

## Build the Profile

A Profile makes this workflow reusable by specifying what participating clinics
and programs must implement. It defines participant responsibilities, task
inputs, data access, exchanges, outputs, and review conditions.

The enrollment Profile combines these written requirements with
[JSON metadata and a Capability definition](profile/profile.json).

### 1. Define the purpose and responsibilities

The intended output is a reviewed evidence packet for enrollment evaluation.
That purpose establishes the preparation task and its handoff.

> Prepare evidence about a participation form and orientation for a patient's
> enrollment episode. Obtain the program's requirements, gather and assess
> relevant records, and prepare an evidence payload and Activity Record for
> coordinator review. After approval, the coordinator delivers the packet to
> the program's review team for its enrollment decision.

The Profile assigns responsibilities for preparation, review, and the enrollment
decision.

| Participant | Profile responsibility |
| --- | --- |
| Preparing Party | Authorizes the task and access to its enrollment records. Provides a coordinator to review, approve, and deliver the packet. |
| Preparer | Obtains requirements, retrieves records, seeks clarification, assesses evidence, and prepares the outputs. |
| Evaluating Party | Establishes the applicable program requirements and makes the enrollment decision through its review team. |
| Evaluator | Supplies Criteria and explains their meaning using the program's policy and established interpretations. |

The Preparer's permitted actions are retrieval, requirements and clarification
requests, assessment, and output preparation. Handoff requires coordinator
approval and is performed by the coordinator.

These responsibilities apply to participating clinics and programs. In the
walkthrough, the clinic and program each implement their corresponding roles.

### 2. Select the interaction model

Disclosure fits this workflow because a program can supply its requirements
before evidence gathering begins. The Profile selects COIN specification
`draft` and Disclosure API `v0`.

The Profile requires the Evaluator to support requirements and clarification
requests and to list this Profile through `GET /coin/v0/profiles`. A Preparer can
skip discovery when both systems' support for the same Profile version is already
configured. Evidence checks are optional; an unsupported check returns
`check-unavailable` under the Disclosure HTTP binding.

Each implementation configures the Evaluator origin for every supported program,
the Preparer's MCP connection, output locations, retention settings, and handoff
destination. Before a task starts, participants verify shared Profile support,
authorized access, and availability of the required Capability.

### 3. Define the evaluation context and requirements

The Evaluator needs the program and review date to select applicable
requirements. The enrollment [Profile](../profile/index.md#use-of-coin) makes
both fields required in the Preparer's request `context`. These field names
are choices for this example.

| Field chosen for this Profile | Type | Meaning |
| --- | --- | --- |
| `program` | string | The program identifier agreed by the participants and used to select requirements. Configuration identifies its Evaluator. |
| `reviewDate` | string | A valid calendar date in `YYYY-MM-DD` form, interpreted in UTC, for which requirements are requested. |

The Preparer supplies these two values in every requirements request. The
Evaluator preserves them as received in its Activity Record's `context`.
It records its selected requirements and explanations in responses and
activities. This Profile defines no optional request context fields. The
[JSON conventions](../conventions/index.md#json-conventions) apply.

The Evaluator selects its applicable Criteria using the program and review date.
A matched set must fit the participation-form and orientation data scope and
include a `result` that identifies an expression for the overall finding. The
Preparer assesses every criterion and expression, preserving the patient,
episode, program, and timing relationships required by the Criteria.

The Evaluator must retain each matched request and response for subsequent
clarification. A valid request with no applicable requirements receives
`not-found`; malformed context receives `invalid-request`. A clarification that
the source cannot support receives `unresolved`. Processing failures use
[Disclosure HTTP errors](../disclosure/index.md#http-binding).

The program in this walkthrough supplies Criteria set `example-enrollment`,
version `1`, for `example-support` and August 2026 review dates, and returns
`not-found` for other programs or dates. Other programs can supply their own
Criteria within the same Profile's workflow and data scope. The program's
Criteria and source rules determine how missing evidence affects each finding.

### 4. Define the data Capability

The Preparer needs access to forms, orientation notes, and recorded acceptances
of prior orientation. The Profile defines `enrollment-data` as a `data-access`
Capability required by the Preparer, with one tool named `get_enrollment_records`.

The tool uses the clinic's patient and enrollment episode identifiers, together
with the program and review date, to scope retrieval. The clinic's implementation
obtains these inputs when assigning the task. The example tool names the local
identifier inputs `patientId` and `episodeId`.

The scope covers all those records for the selected program in the clinic's
enrollment file for the requested patient and episode, through the review date.
Implementations connect their systems to this shared interface. They preserve
original content and verify that each record concerns the requested patient,
episode, and program.

The tool's `inputSchema` turns the task inputs into a callable interface.

```json
{
  "type": "object",
  "properties": {
    "patientId": {
      "type": "string",
      "minLength": 1,
      "description": "The Preparing Party's patient identifier."
    },
    "episodeId": {
      "type": "string",
      "minLength": 1,
      "description": "The enrollment episode for this patient."
    },
    "program": {
      "type": "string",
      "minLength": 1,
      "description": "The program identifier agreed by the participants. Retrieve records only for this program."
    },
    "reviewDate": {
      "type": "string",
      "format": "date",
      "description": "Include the episode's records through this UTC calendar date."
    }
  },
  "required": [
    "patientId",
    "episodeId",
    "program",
    "reviewDate"
  ],
  "additionalProperties": false
}
```

The operation returns the same four scope fields and exactly one result for each
source group. This defines the data coverage implementations must provide.

| Source group | Required records and representation |
| --- | --- |
| `forms` | All participation forms within scope. Each record contains an `application/json` object with `status` equal to `signed`, `unsigned`, or `unknown`, and optional `signedOn`, a date. A missing date cannot establish when the form was signed. |
| `orientation` | All orientation notes and recorded acceptances of prior orientation within scope. Each record preserves its original `text/plain` text, including identifiable dates and events. |

Each source result contains `name`, `status`, `detail`, and `records`. Each record
has a stable URI `id`, a media type `format`, and `content`. Source names appear
once each, and record IDs do not repeat within a result.

Assessment requires every source to report `complete`. The source statuses
distinguish completed retrieval from partial or failed access.

| Status | Meaning |
| --- | --- |
| `complete` | The entire source scope was searched and all matching records were returned. The result may be empty. |
| `incomplete` | Some scope or content remains unread. |
| `unavailable` | The source could not be accessed. `records` is empty. |
| `restricted` | Access restrictions prevented retrieval. `records` is empty. |

`detail` explains the scope searched and any limitation. The tool returns all
records in one call, with no pagination. An unidentified patient, episode, or
program produces a tool error. Other invocation failures follow MCP error
handling; handled retrieval limitations are reported through each source's status.

The Profile selects [MCP `2025-11-25`](https://modelcontextprotocol.io/specification/2025-11-25)
with the [stdio transport](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports#stdio).
The host launches the configured server and discovers its tool through
`tools/list`. The tool returns `structuredContent` and serialized JSON in a text
content block. Its `inputSchema` and `outputSchema` use JSON Schema 2020-12.
The [completed Capability](profile/profile.json) embeds the tool definition and
both schemas in the Profile's `capabilities` array.

### 5. Specify outputs, completion, and review

The COIN Profile specifies the evidence payload's format, including any
standards, versions, and conformance requirements. For example, it could require
FHIR resources conforming to US Core profiles
from a specified release. The Preparer would map source information into the
required resources and document transformations affecting meaning or findings
in the Activity Record.

For this enrollment example, the Profile defines a JSON object that retains the
records used in findings and links them to their sources in the Activity Record.

| Field in this example payload | Type | Meaning |
| --- | --- | --- |
| `profile` | [Profile reference](../conventions/index.md#profile-reference) | The Profile and version used for preparation. |
| `context` | object | The patient and episode identifiers, program, and review date supplied with the clinic's assignment. |
| `items` | object[] | All supporting and conflicting records used in findings, copied from the Activity Record. May be empty. |

Each item has required `id`, `format`, `content`, and `source` fields. The first
three preserve the retrieved record. `source` is a
[Content reference](../conventions/index.md#content-reference) to that record
within the retained MCP response. The JSON conventions apply to the payload.
The [example payload](profile/evidence.json) shows the completed output.

The Preparer's Activity Record preserves the inputs supplied with the clinic's
assignment in its `context`. These include the patient and episode identifiers
used for retrieval. The Evaluator's record preserves only the context received
in the requirements request.

Each participant embeds its Disclosure and MCP exchanges in the corresponding
activities in its own Activity Record. The Preparer links findings directly to
retained evidence, clarification, retrieval results, or operand findings.

Preparation is complete when all required sources report `complete`, every
assigned target has a finding, and the evidence payload, Activity Record, and
referenced content are available for inspection. A completed preparation may
contain not-satisfied or unresolved findings.

The Profile requires coordinator review of subject, episode, program, dates,
source support, interpretations, completeness, and unresolved work. The
coordinator returns work for correction or records approval and delivers the
packet to the program's review team. The packet includes the evidence payload,
Preparer Activity Record, and referenced content. The clinic records the delivery.
Each participant retains its Activity Record, outputs, and supporting information
for the review period established by the workflow participants.

#### Incomplete work and changes

The Profile also defines how work continues or stops when evidence is absent,
retrieval fails, or task conditions change.

| Situation | Required behavior |
| --- | --- |
| Completed retrieval finds no qualifying evidence. | Apply the Criteria and source rules. For the example policy, a missing signed form is not satisfied; missing orientation evidence remains unresolved. Complete the assigned assessments and return the results for review. |
| Requirements are not found, the Criteria set is invalid, or requirements exceed the Profile's data scope. | Stop automated preparation, record the limitation, and return incomplete work to the coordinator. |
| An exchange fails or a source reports a status other than `complete`. | Stop automated preparation and return incomplete work for review. Retain attempted operations and failures; targets without findings remain unassessed. |
| Clarification is unresolved. | Retain the question and response. Continue assessment, leaving the affected finding unresolved when the answer is needed to interpret the evidence. |
| Evidence conflicts. | Preserve the conflicting information and explain the finding. Record unresolved findings when the available information cannot establish a result. |
| Task inputs, the Profile, source records, or requirements change during review. | Start a new task and obtain a new requirements response. Retain the original outputs and review the new outputs before handoff. |

This Profile performs one attempt per operation. The coordinator can initiate a
new task after a failure is resolved. Additional clarification questions must
stand alone and refer to the original requirements response.

### 6. Identify and publish the Profile

A stable identifier and version let implementations advertise support and let
each task record exactly which workflow it followed.

#### Identification

| Item | Value |
| --- | --- |
| Title | Enrollment evidence preparation |
| Identifier | `https://example.org/coin/profiles/example-enrollment` |
| Version | `1` |
| Maintainer | Publishing organization (fictional) |
| COIN specification | `draft` |
| Interaction model | Disclosure, API `v0` |

The initial JSON metadata records the Profile's identity and interaction model.

```json
{
  "id": "https://example.org/coin/profiles/example-enrollment",
  "version": "1",
  "interaction": "disclosure"
}
```

The completed metadata adds the `enrollment-data` definition to `capabilities`,
including its type, description, scope, and embedded MCP tool. The
[profile.json](profile/profile.json) file contains that metadata and the full
Capability definition. The written workflow rules and JSON metadata are published
together under the same identifier and version.

The result is a Profile another clinic or program can implement by taking on
its roles and providing the required services and data access. Patient values,
service addresses, and a program's Criteria can vary within its scope. Changes
to the Profile's shared rules or metadata require a new version.
