---
title: Data Conventions
weight: 70
category: Specification
subcategory: Guidance
---

# Data Conventions

Shared data types and representation rules used by COIN formats are defined
below. The objects on this page follow the JSON conventions.

## JSON conventions

These rules apply to objects whose format references this section. Each format
identifies embedded content governed by another specification or by a Profile.
That content follows its own format rules.

- Only the fields listed for an object are allowed, except where its format
  permits additional content. Field names are case-sensitive and must not repeat.
- Required fields must be present. Unused optional fields are omitted. `null`
  is not an allowed value.
- Values must have the specified type. Types are not inferred or converted.
- Strings must contain at least one character unless the field definition
  explicitly permits an empty string.
- COIN identifiers and references to them are compared exactly, including case,
  without normalization. Enumerated string values are case-sensitive.
- No maximum string length or array size is prescribed unless a field or format
  specifies one. Additional string length constraints, minimum array sizes, and
  restrictions on array contents are specified by each field or format.

Primitive type names are lowercase. `string` is a JSON string; `integer` is a
JSON number with no fractional part. `T[]` denotes a JSON array whose items have
type `T`.

## Version identifiers

Version identifiers are JSON strings. COIN does not prescribe a version-number
format. Each artifact or referenced standard defines what its version identifies
and when it changes.

## Participant

A Participant object identifies a service or organization. It has a required
string field `id` and an optional string field `name` for display. The `id` is a
stable URI. These identifiers name participants;
authorization establishes whether a service may act for them.

For example, this object identifies a clinic's Preparer service:

```json
{
  "id": "https://example.org/clinic/preparer",
  "name": "Clinic Preparer"
}
```

## Profile reference

A Profile reference is an object containing only the required `id` and `version`
fields from [Profile metadata](../profile/index.md#identification-and-versioning).

For example, this reference selects version `draft` of a prior authorization
Profile:

```json
{
  "id": "https://example.org/coin/profiles/prior-authorization",
  "version": "draft"
}
```

The version is a JSON string. Using `"version": 1` would be invalid.

## Timestamp

A Timestamp is a JSON string using RFC 3339 in UTC with the uppercase `Z` suffix.

For example, the `at` field of an
[Activity](../activity-record/index.md#activity) can contain this value:

```json
"2026-08-08T14:00:00Z"
```

This represents 14:00 UTC on August 8, 2026.

## Content reference

A Content reference is a JSON string identifying inspectable content. It uses
a fragment-only reference for content within the same document, or a fully
qualified URI for another resource.

For JSON content, a fragment uses JSON Pointer. A reference to an entire external
resource omits the fragment. The Profile specifies how external content is made
available and locators for other formats when needed.

For example, this reference identifies the response body in the fourth activity
of the same Activity Record:

```json
"#/activities/3/exchange/response/body"
```
