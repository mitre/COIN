---
title: Activity Record
weight: 60
category: Specification
subcategory: Artifacts
---

# Activity Record

An Activity Record documents the work a participant performs as part of a COIN
task, including supporting work outside COIN exchanges. It connects actions and
exchanges to the information used, outputs produced, and limitations encountered.
Its primary purpose is audit and transparency, enabling authorized reviewers to
examine what was done and the basis for the results.

## Scope

Each participant maintains an Activity Record of its work. The
[Profile](../profile/index.md) defines how the record links to supporting
information and outputs and is made available to authorized reviewers.

## Expected content

An Activity Record is intended to include:

- The assigned work, applicable Profile and version, and participants involved.
- Relevant actions, who performed them, when, and their outcomes, including
  failed or incomplete work. This includes use of abilities and data access
  required by [Capabilities](../capability/index.md).
- Information and supporting sources used, with references that connect outputs
  to their basis.
- Requests, responses, and related exchanges.
- Outputs and concise explanations, including conflicting information,
  uncertainty, and unresolved issues.

## Use with interaction models

In [Disclosure](../disclosure/index.md#outputs-and-review), the Preparer's record
connects the [Criteria](../criteria/index.md) set and version to gathered evidence,
assessment findings, and clarifications retained within the record. The evidence
payload is a workflow output derived from the captured information. The
Evaluator's record documents the requirements supplied, explanations and checks
provided, and their supporting sources.

In [Inquiry](../inquiry/index.md), the Preparer's record would connect supported
answers and evidence to retrieved information and sources. The Evaluator's record
would document questions, follow-up requests, and unresolved information needs.
The common content supports recording work under either interaction model.

## JSON representation

An Activity Record is a JSON object. The following fields provide a common
representation of the content described above.

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `profile` | [Profile reference](../conventions/index.md#profile-reference) | Yes | The Profile and version used for the recorded work. |
| `participant` | [Participant](../conventions/index.md#participant) | Yes | The participant maintaining the record. The Profile identifies its role. |
| `context` | object | Yes | Actual context values supplied for this participant's work, using the fields and meanings defined by the [Profile](../profile/index.md#use-of-coin). |
| `activities` | [Activity](#activity)[] | Yes | Activities in their recording order. May be empty before work begins. |
| `assessments` | [Assessment](#assessment)[] | When criteria are assigned | One or more Disclosure assessments, identifying assigned entries and their findings. |

The [JSON conventions](../conventions/index.md#json-conventions) apply to the record
structure. The `context` preserves the Profile-defined inputs supplied to the
participant. Under Disclosure, the Evaluator's `context` contains the values
received in the requirements request. Derived information and results are
recorded in activities, exchanges, and assessments. Embedded protocol messages
and HTTP bodies preserve their original content under their own format rules.

### Activity

An Activity records an action and its outcome. It can describe a tool call,
protocol exchange, assessment, review, or handoff. Action and outcome descriptions
are plain text. Exchanges are retained within the activity; supporting sources and
separate outputs are linked through references.

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `at` | [Timestamp](../conventions/index.md#timestamp) | Yes | When the action's outcome was recorded. |
| `actor` | string (URI) | Yes | The person or service that performed the action. |
| `action` | string | Yes | What was done. For work using a Capability, identify it and any relevant operation or service. |
| `outcome` | string | Yes | What resulted, including failed or incomplete work and any remaining limitation. |
| `inputs` | [Content reference](../conventions/index.md#content-reference)[] | Yes | Information used, including supporting sources and earlier exchanges. May be empty. |
| `outputs` | [Content reference](../conventions/index.md#content-reference)[] | Yes | Information produced, including findings and payloads. May be empty. |
| `exchange` | [Exchange object](#exchange) | When recording an exchange | The request and any response sent or received as part of this action. |

The `inputs` and `outputs` need not repeat references to messages already held
in the activity's `exchange`. Relevant questions, conflicts, and limitations must
remain visible even when they do not prevent completion of the task.

### Exchange

Each participant retains the exchanges it took part in within its own Activity
Record. An Exchange preserves one request and its response, when available.
Record each attempt separately, including retries.

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `protocol` | string | Yes | The protocol used. Use `http` for HTTP or `mcp` for MCP. The Profile defines identifiers for other protocols. |
| `request` | object or string | Yes | The actual request sent, received, or attempted, in the representation below. |
| `response` | object or string | When available | The actual response sent or received, including errors. |

For HTTP, `request` has required string fields `method` and `path`, with `path`
relative to the service origin configured under the Profile. It also has `body`
when a body was sent or received. The `response` has a required integer `status`
containing the HTTP status code, and `body` when a body was sent or received.
JSON bodies retain their parsed values; non-JSON bodies are retained as text.
The request and response wrappers follow the record's JSON conventions.

For MCP, `request` and `response` preserve the complete JSON-RPC message objects,
including their method, parameters, identifiers, results, and errors as present.
The request identifies the operation, such as `tools/call` and its tool name.
A message that cannot be parsed as a JSON object is retained as text.

For other protocols, the Profile defines distinct `protocol` values and the
object or text representations used to retain requests and responses. These
representations preserve the actual message contents for review.

If no response is available, omit `response` and explain the timeout,
interruption, or other failure in the activity's `outcome`. Retain an invalid
response when available and explain the problem there.

### References

Reference fields use the shared
[Content reference](../conventions/index.md#content-reference) type.

An assessment's `requirements` and each finding's `basis` use fragment-only
references to content within the Activity Record. Retain the information needed
to inspect findings, including supporting and conflicting evidence, within the
record. Content already captured in an exchange need not be copied elsewhere
in the record.

Referenced content must preserve the information actually used or produced,
including its source and version where applicable. Save a copy or use a reference
to fixed content when the original can change. The Profile defines how referenced
content is retained and made available for review. Earlier findings and their
inputs remain inspectable when work is revised.

### Assessment

An Assessment records the Preparer's assigned criteria and expressions under
one requirements response. Different requirements responses have separate
assessments.

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `requirements` | [Content reference](../conventions/index.md#content-reference) | Yes | The complete matched requirements response body within this record, preserving the Evaluator, response ID, Criteria set, and version. Its request and context are retained in the record's activities. |
| `targets` | string[] | Yes | One or more unique criterion or expression IDs assigned for assessment from that Criteria set. |
| `findings` | [Finding](#finding)[] | Yes | Findings for assessed targets. May be empty before assessment. |

Each finding's `targetId` must appear in `targets` and must not repeat within
the assessment. A target without a finding has not been assessed. It is distinct
from a target assessed as unresolved. The Profile establishes which targets
must have findings before preparation is complete.

### Finding

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `targetId` | string | Yes | The assessed criterion or expression ID. |
| `state` | string | Yes | Exactly one of `satisfied`, `not-satisfied`, or `unresolved`, following the [Criteria interpretation rules](../criteria/index.md#operator-meaning). |
| `explanation` | string | Yes | The basis for the finding, including interpretation, conflicting information, and remaining uncertainty. |
| `basis` | [Content reference](../conventions/index.md#content-reference)[] | Yes | Supporting or conflicting evidence, relevant exchanges, retrieval results, or operand findings within this record. May be empty when no supporting information is available; explain that limitation. |

Evidence references identify the supporting content retained within the record.
A finding about missing evidence refers to the retrieval result that establishes
what was searched and whether retrieval completed. A finding for an expression
references the operand findings used to assess it. Findings must preserve the
subject, event, and timing relationships required by the Criteria.

## Example

For example, an orientation note and a clarification can support a finding
about a live orientation requirement. The `basis` references identify the note
and clarification response retained in the same Activity Record.

```json
{
  "targetId": "live-orientation",
  "state": "satisfied",
  "explanation": "The note records a completed live video orientation for this enrollment episode. The program's clarification confirms that real-time video qualifies.",
  "basis": [
    "#/activities/2/exchange/response/body",
    "#/activities/3/exchange/response/body"
  ]
}
```
