---
title: Introduction
---

# Conversational Interoperability (COIN)

Conversational Interoperability (COIN) describes an approach to healthcare
interoperability in which AI agents help participants exchange and interpret
information and coordinate workflows. Agents could clarify what each participant
needs, find relevant information in their respective systems, and resolve
differences in how that information is represented or understood.

Agents could use structured exchanges, natural-language dialogue, or both,
depending on the task. This approach could reduce the effort needed to build and
maintain custom integrations, helping organizations adapt more readily as
systems, requirements, and workflows change.

This proposal outlines an approach to putting COIN into practice. Building on
existing standards, APIs, and data sources, the proposed specifications establish
shared expectations for agent behavior, interactions, and outputs. The aim is to
support the safe and reliable use of AI agents in healthcare workflows. Further
work would explore how to test conformance and benchmark agent performance, and
what implementation guidance would help organizations build and evaluate agents
against these expectations.

## Initial focus

The initial proposal focuses on helping one participant understand another
participant’s evaluation requirements and prepare the data and evidence needed
for that evaluation.

In prior authorization, for example, a provider’s agent could ask a payer’s agent
which requirements apply to a requested service and clarify what evidence is
needed. The provider’s agent could then gather relevant patient information,
assess it against those requirements, and identify missing or conflicting
evidence for review.

Similar preparation tasks arise in quality measurement, clinical trial
matching, and specialist referrals. Each workflow would define the
required outputs, how findings are reviewed and used, and who makes subsequent
decisions.

## Initial proposed specifications

Four proposed specifications work together to support this initial focus.

| Specification | Purpose |
| --- | --- |
| [Dialogue](dialogue/index.md) | Defines how an Agent obtains applicable evaluation requirements, asks for clarification, and optionally checks evidence against an identified requirement. |
| [Criteria](criteria/index.md) | Represents evaluation requirements using readable statements, explicit logical relationships, and references to accepted concepts. |
| [Agent](agent/index.md) | Defines common behavior for matching evidence to criteria and producing traceable findings. |
| [Profile](profile/index.md) | Defines the structure for individual profiles that describe how COIN is used within a broader workflow, including participant responsibilities and interactions. |

Dialogue exchanges requirements represented in Criteria. Agent
defines how an agent matches evidence to those requirements and records findings.
Individual Profiles describe how this work fits within the broader workflow
for a use case.

This initial workflow provides a starting point for exploring broader
coordination among agents. These proposed specifications are an initial
contribution toward this broader vision. Their scope, terminology, and design
remain open for community discussion.

## Copyright and trademarks

©2026 The MITRE Corporation. ALL RIGHTS RESERVED. Approved for Public Release; Distribution Unlimited. Public Release Case Number 26-2020

Third-party standards and terminology are subject to their respective copyright
and licensing terms. [HL7® and FHIR®](https://hl7.org/fhir/R5/license.html) are
registered trademarks of Health Level Seven International.
[SNOMED CT®](https://www.snomed.org/get-snomed) is copyright SNOMED International.
References do not imply endorsement.
