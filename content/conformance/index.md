---
title: Conformance
weight: 60
category: Guidance
---

# Conformance

Conformance to COIN and a [Profile](../profile/index.md) concerns whether an
implementation fulfills its responsibilities and meets the requirements for its
operations, behavior, and outputs. This preliminary exploration considers possible
ways to assess those requirements and gather evidence for a conformance judgment.

## Basis for conformance

Base COIN conformance covers the shared requirements for the roles and components
being assessed. Profile conformance includes those applicable requirements and
the Profile's selections and additional constraints for a particular workflow.
Profiles preserve the behavior and meaning of the COIN components they use.

One approach is to reuse base tests across Profiles and add tests for each
Profile's specific requirements. Reports can identify the scope tested,
implementation configuration, COIN specification version, and applicable Profile
and version.

## What to assess

Each area can be tested independently and then within the Profile's workflow,
including review and handoff.

### Capabilities

A [Capability](../capability/index.md) groups related operations that an
implementation makes available through MCP to agents acting as the Preparer or
Evaluator. Base COIN defines the Capability structure, permitted types, and common
behavior, including MCP exposure. The Profile specifies the required operations,
schemas, data scope, and conditions of use. The only current type is `data-access`;
future types could extend this approach beyond data access.

Potential base checks include Capability definitions, MCP discovery and
invocation, and the distinction between completed searches with no matching
records and restricted, unavailable, or incomplete retrieval. Profile tests can
exercise the required tools against known source data and permissions to verify operation
behavior, data coverage, source references, and reporting of retrieval scope and
completeness.

### Preparer

The Preparer gathers and interprets evidence for its assigned task. In
[Disclosure](../disclosure/index.md), it assesses evidence against
[Criteria](../criteria/index.md). In [Inquiry](../inquiry/index.md), it exchanges
questions and supported answers as information needs develop. Its outputs and
[Activity Record](../activity-record/index.md) connect findings or answers to
their supporting sources and make gaps and conflicts visible. The Profile defines
the task context, required Capabilities, output formats, safeguards, and review
process.

A possible test setup supplies a task, known data through MCP tools, and
controlled Evaluator exchanges that provide Criteria or questions. Base checks
can examine Criteria interpretation where applicable, source support,
clarification, uncertainty, and Activity Records.
Profile checks can cover the assigned task, required access, output formats,
permissions, safeguards, and review requirements. Possible cases include unclear
requirements, missing or conflicting evidence, and retrieval failures. Reviewed
expectations can allow equivalent supported outputs and valid variations in tool
use and exchanges. An unresolved finding can be the expected result.

### Evaluator

The Evaluator supplies applicable Criteria, explains their meaning, and checks
evidence where supported in Disclosure. In Inquiry, it asks and refines questions,
reviews supplied information, and identifies further information needs. Either
participant can ask questions or seek clarification. The Evaluator's
Activity Record preserves its exchanges,
supporting sources, and unresolved issues. The Profile specifies task context,
permissions, accepted evidence formats, and any required evidence checks.

A possible test setup uses known source requirements and task contexts to compare
supplied Criteria and clarifications with those sources. Base checks can examine
faithful representation of requirements, supported explanations, reported
limitations, version handling, authorization, and
Activity Records. Inquiry cases can present
complete, partial, or conflicting answers and examine whether
follow-up addresses remaining information needs. Profile checks can cover context
rules, selection of applicable requirements, permitted access, accepted formats,
and required evidence checks.
