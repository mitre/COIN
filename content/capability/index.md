---
title: Capability
weight: 35
category: Artifacts
---

# Capability

A Capability specifies a set of related operations that implementations make
available to an agent through the
[Model Context Protocol (MCP)](https://modelcontextprotocol.io/specification/latest).
A [Profile](../profile/index.md) contains one or more Capability definitions when
its agents require these operations. Each definition specifies the Capability's
type, operations, required behavior, and conditions of use. The Profile identifies
the participant roles for which it must be provided.

Capabilities can describe different categories of operations. This version
defines one type, `data-access`, for discovering and retrieving information.

This page establishes the common requirements for defining and implementing
Capabilities. Profiles supply the concrete operation definitions and data
requirements.

## Defining a Capability

A Profile gives each Capability an identifier and purpose and specifies:

| Area | Required description |
| --- | --- |
| Type | A Capability type defined by this specification. The only current value is `data-access`. |
| Participant roles | The roles whose agents require the Capability and the tasks it supports. |
| Operations | The operations, their names, inputs, outputs, schemas, and expected behavior. |
| Type-specific requirements | For `data-access`, the information that must be accessible, its scope and sources, supported formats, and required source references. |
| MCP interface | Required MCP protocol versions and transports, and how the operations and their results are exposed. |
| Conditions of use | Authorization and configuration requirements, permitted actions, and when the Capability must be available. |
| Results and failures | How results indicate their scope and completeness, and how unavailable, restricted, or incomplete access is reported and handled. |

Capability definitions are part of the fixed content identified by the
Profile's version. Operation names, schemas, and meanings remain consistent
across implementations of that version. Deployment-specific connection details
are supplied through configuration under the Profile's rules.

### MCP interface

Capability operations must be exposed through MCP. Each Capability embeds the
[MCP tools](https://modelcontextprotocol.io/specification/latest/server/tools)
that define its operations. The Profile specifies any
[MCP resources](https://modelcontextprotocol.io/specification/latest/server/resources)
used to supply their results. It specifies how the agent's host identifies and
connects to the implementations that provide the required operations.

A Profile-defined Capability groups operations for a task. MCP's capability
declarations identify supported protocol features, such as tools and resources.

## Capability types

Every Capability has a required `type` that constrains the operations it can
provide and the requirements its definition must include. A Profile uses a type
defined by the applicable COIN specification version. The current representation
accepts only `data-access`; additional types require a specification and schema
revision.

### Data access

A Capability with type `data-access` provides operations for discovering and
retrieving information. It specifies the data categories, subject or population,
dates, and sources within its scope, or how that scope is established for an
individual task. It defines the operations needed to discover and retrieve the
required information, including any content referenced by a result.

The Profile specifies the representations that agents must be able to use and
the source references and context needed to interpret the information. It defines
how retrieval scope, limits, and incomplete results are reported. When operations
search or return part of a collection, their results must make the extent of
retrieval clear under those rules.

The required access concerns information within the defined scope. Whether that
information establishes an evaluation requirement is assessed separately.
A completed retrieval with no matching records remains distinguishable from
restricted, unavailable, or unfinished retrieval.

## JSON representation

The preliminary [JSON Schema](capability.schema.json) represents one Capability.
The Profile includes its definitions in the
[`capabilities` array](../profile/index.md#identification-and-versioning) of its
JSON metadata. Each definition contains its MCP tool definitions.

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `id` | string | Yes | Identifier unique within the Profile. |
| `type` | string | Yes | The operation category. Currently only `data-access` is allowed. |
| `description` | string | Yes | The Capability's purpose. |
| `scope` | string | Yes | The Capability's scope, interpreted according to its type. |
| `tools` | array of MCP Tool objects | Yes | One or more embedded tool definitions specifying the Capability's operations. |

For `data-access`, `scope` describes the required information and its boundaries,
or references the relevant requirements within the same Profile. It identifies
the data categories, sources, subject or population, and time scope, or how those
are established for a task. This preliminary representation keeps those
requirements in prose.

Role assignments, MCP versions and transports, authorization, and workflow
policies are specified in the enclosing Profile. The Capability inherits the
Profile's version.

The following example illustrates a definition within a hypothetical quality
measurement Profile. It requires access to USCDI+ Quality Version 2 information
while allowing implementations to choose the representations. US Quality Core
is recommended for structured data. The tool names and behavior are choices
made by that Profile.

```json
{
  "id": "quality-data",
  "type": "data-access",
  "description": "Access patient information for quality measurement.",
  "scope": "Recorded information described by USCDI+ Quality Version 2 for the requested patient, across the implementing organization's clinical systems and document repositories. Original documents and attachments containing that information, including PDFs, must be accessible. Implementations may choose the data representations, provided they preserve the required information. US Quality Core is recommended for structured data.",
  "tools": [
    {
      "name": "get_quality_data",
      "description": "Retrieve the patient's information within this Capability's scope. Return content directly or provide content identifiers retrievable through read_quality_content. Identify each item's source, media type, and applicable format or schema. Include enough information to interpret locally defined formats. Report missing information and restricted, unavailable, or incomplete retrieval distinctly. Return a continuation cursor when additional results remain.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "patientId": {
            "type": "string",
            "minLength": 1,
            "description": "The patient identifier assigned by the implementing organization."
          },
          "cursor": {
            "type": "string",
            "minLength": 1,
            "description": "The continuation cursor returned by a previous call for this patient. Omit for the first call."
          }
        },
        "required": ["patientId"],
        "additionalProperties": false
      }
    },
    {
      "name": "read_quality_content",
      "description": "Retrieve the complete content identified by get_quality_data, including original documents and attachments. Preserve its representation and identify its media type and source. Report restricted, unavailable, or incomplete retrieval.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "contentId": {
            "type": "string",
            "minLength": 1,
            "description": "A content identifier returned by get_quality_data."
          }
        },
        "required": ["contentId"],
        "additionalProperties": false
      }
    }
  ]
}
```

These operations can supply FHIR resources, documented tables, or original
reports. The agent adapts its interpretation to the returned content. The access
requirement covers recorded information and does not imply that every patient
has every data element.

Only the listed fields are allowed in the Capability object.
The Capability's `id`, `description`, and `scope` must be nonempty.
Field names and type values are case-sensitive. Capability IDs must be unique
within a Profile, and tool names must be unique within a Capability.

The schema checks required fields, the allowed type, the data access scope, a
nonempty tool array, and basic MCP tool structure. Each tool requires a nonempty
`name` and an `inputSchema` object whose root `type` is `object`. An optional
`outputSchema` must be a JSON Schema object. Other MCP tool fields remain
available under the protocol version specified by the Profile.

Complete MCP tool validation, validation of embedded input and output schemas,
identifier uniqueness, and agreement between operation behavior and Capability
type are additional checks. Schema validation alone does not establish that an
implementation provides the required access.

## Providing a Capability

An implementation must make each required Capability available through MCP to
the agents performing the corresponding participant role. This includes
configuring the agent's host and establishing authorized access under the
Profile's rules. For `data-access`, it also includes connecting the required data
sources. The agent must be able to discover and invoke the required operations
and use the information they return.

Operation behavior must conform to the Capability's declared type and the
Profile's definitions.

Implementations may use different underlying systems while preserving the
Profile's required interface and behavior. For `data-access`, conformance
requires both the specified operations and the data coverage they must provide.

When required operations or access are unavailable, the implementation
identifies the affected Capability and scope and follows the Profile's rules
for continuing, stopping, or returning work for review. Incomplete or failed
work must remain visible in the results and related workflow records.

Relevant operations, sources, results, and access limitations are documented in
the participant's [Activity Record](../activity-record/index.md), linked to the
applicable Profile and Capability definitions.
