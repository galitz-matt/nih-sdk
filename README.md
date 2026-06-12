# NIH RePORTER SDK

Type-safe TypeScript SDK for querying the NIH RePORTER Project API.

The NIH RePORTER API provides powerful search capabilities for federally funded biomedical research projects, but constructing request payloads manually can be tedious and error-prone.

This SDK provides:

- Fluent query builders
- Type-safe request construction
- Generated NIH lookup enums
- Built-in request validation
- Rate-limited API access
- Direct execution from query builders

---

## Installation

```bash
npm install nih-sdk
```
---

# Quick Start

Import the SDK entry point:

```ts
import nih from "nih-sdk";
```

Build and execute a query:

```ts
const results = await nih.projects
    .query()
    .fiscalYears(2024, 2025)
    .activityCodes("R01", "AY2")
    .limit(25)
    .execute();
```

That's it.

---

# Usage

## Fluent Query Builder

Queries are constructed using a builder API.

```ts
import nih from "nih-sdk";

const results = await nih.projects
    .query()
    .orgStates("NJ", "AL", "CA")
    .activityCodes("R01", "R21")
    .awardAmountRange(100000, 5000000)
    .execute();
```

Each call adds criteria to the underlying NIH request.

---

## Using Generated Enums

Many NIH lookup values are available as generated enums.

```ts
import {
    OrgState,
    ActivityCode,
    FundingMechanism
} from "nih-reporter-sdk";

const results = await nih.projects
    .query()
    .organizationStates(
        OrgState.CA,
        OrgState.NY
    )
    .activityCodes(
        ActivityCode.R01,
        ActivityCode.R21
    )
    .fundingMechanisms(
        FundingMechanism.ResearchCenters // "RC"
    )
    .execute();
```

This provides autocomplete and compile-time safety.

---

## Selecting Response Fields

Request only the fields you need.

```ts
import { Field } from "nih-reporter-sdk";

const results = await nih.projects
    .query()
    .includeFields([
        Field.ProjectTitle,
        Field.AwardAmount,
        Field.PrincipalInvestigators,
        Field.Organization
    ])
    .execute();
```

---

## Pagination

```ts
const results = await nih.projects
    .query()
    .offset(100)
    .limit(50)
    .execute();
```

---

## Advanced Text Search

```ts
import { Field } from "nih-sdk"

const results = await nih.projects
    .query()
    .advancedTextSearch({
        kind: "and",
        field: Field.AbstractText
        terms: ["machine", "learning"]
    })
    .execute();
```

---

## Principal Investigator Search

```ts
const results = await nih.projects
    .query()
    .piNames([
        {
            firstName: "John",
            lastName: "Smith"
        }
    ])
    .execute();
```

---

## Organization Search

```ts
const results = await nih.projects
    .query()
    .organizationNames([
        "Stanford University"
    ])
    .execute();
```

---

## Project Number Search

```ts
const results = await nih.projects
    .query()
    .projectNumbers([
        "1R01GM123456-01"
    ])
    .execute();
```

---

# Executing Raw Requests

If you already have a valid NIH RePORTER request payload, you can execute it directly.

```ts
const results = await nih.projects.execute({
    criteria: {
        fiscal_years: [2025],
        activity_codes: ["R01"]
    },
    limit: 25,
    offset: 0
});
```

This is useful when migrating existing codebases or dynamically generating requests.

---

# Query Lifecycle

```ts
const query = nih.projects
    .query()
    .fiscalYears([2025])
    .activityCodes(["R01"]);

const results = await query.execute();
```

Each call to `query()` creates a fresh builder instance.

Builders are not shared across requests.

---

# Features

- Fluent Builder API
- Full TypeScript Support
- Generated NIH Lookup Enums
- Request Validation
- Built-in Rate Limiting
- Direct Query Execution
- Raw Request Execution
- NIH RePORTER Project API Support

---

# Example

```ts
import nih, {
    ActivityCode,
    OrgState,
    Field
} from "nih-reporter-sdk";

const results = await nih.projects
    .query()
    .fiscalYears([2025])
    .activityCodes(
        ActivityCode.R01
    )
    .organizationStates(
        OrgState.CA
    )
    .includeFields(
        Field.ProjectTitle,
        Field.AwardAmount,
        Field.PrincipalInvestigators
    )
    .limit(10)
    .execute();

results.toTextFile("my-results.txt");
```

---

# Roadmap

- Project Search API
- Publications Search API
- Patents Search API
- Additional NIH lookup generators
- Query serialization/deserialization
- Response model improvements

---