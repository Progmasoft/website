<!-- SPDX-FileCopyrightText: 2026 Progmasoft <support@progmasoft.com> -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later WITH AdditionRef-Progmasoft-Patent-Grant-1.1 -->

# Language-site content contract

The site is an introduction to Visual X#, not the authority for every detail
of the language and not a release-coverage database. This document records
the content decisions reviewers should preserve when improving the pages.

## Reader questions

The homepage should answer three questions before asking the reader to
install anything:

1. What is Visual X# trying to make easier to reason about?
2. What makes that direction different enough to investigate?
3. What can I inspect or try today without assuming the project is finished?

The current answer is readable source with explicit semantic boundaries,
ownership that belongs to the language model, and a native pipeline whose
stages can be inspected. These are design choices, not a benchmark claim or
a promise that every public Spec example compiles now.

The overview expands those ideas. Getting started uses commands checked
against the compiler repository. The forum placeholder answers only whether
a discussion service exists; today it does not.

## Authority order

Use the current compiler repository as the source of truth:

1. `Spec/` defines intended public language behavior.
2. `Documents/` explains development workflows and implementation limits.
3. Compiler tests and actual outputs establish what the present build does.
4. Website copy summarizes those sources and links readers to them.

Do not reverse that order by changing the language description to match a
convenient website sentence. If the Spec and implementation differ, describe
the intended rule and the current limitation separately. If an example is
only a design example, avoid presenting it as a verified runnable tutorial.

The HelloWorld block on the site is copied from
`Examples/HelloWorld/HelloWorld.vxs`. When that file changes, update the
website example and the tests together. A program entry is a class method,
not a top-level function. Do not invent source syntax for a visual flourish.

## Page map

### Home

The hero introduces the project in one sentence and links to getting
started. The principles section answers “Why Visual X#?” without requiring
the reader to know internal intermediate-representation names. The source
block is small on purpose. The current-state section distinguishes the
language contract, compiler implementation, and ongoing work. It should
never say the runtime or compiler is broadly production-ready without a
specific tested release basis.

### Overview

This page is a readable conceptual map, not a substitute for `Spec/`.
Architecture names such as Core, CorePrep, Xpp, and Xmm are useful here
because they explain where meaning is checked and where the native boundary
begins. They should not be used as unexplained jargon in the hero.

The page distinguishes value and reference behavior as documented by the
language. Nested generic type composition must not be simplified to “the
outer type always wins.” A value-type generic expression remains a value
type only when all nested type arguments are value types. If its outer or
any nested member is a reference type, the result is a reference type.

The page should not expose private/internal notes as a public citation.
Link to the public Spec and Documents paths only. Its FAQ is a place for
honest scope statements, not speculative launch promises.

### Getting started

This guide starts with the source checkout because there is no stable
binary installer commitment. The toolchain text should match current
`Documents/BUILDING.md`, and CLI examples should match
`Documents/CLI.md`. The native graph belongs to Bazel; the Go developer
command is an orchestrator and doctor. Haskell and Kotlin have their own
component build interfaces. The supported development hosts are Windows
10/11 and macOS Sequoia/Tahoe. Do not casually list Linux as an official
development host based on incidental compatibility.

The guide may mention package managers only for installing development
tools. A developer installing LLVM through a package manager is not the
same thing as the Visual X# package service. There is no site-owned package
management flow to link from this guide.

### Forum placeholder

The placeholder may say the forum will come later, once the community is
ready. It must not imply that an account can be created now or that
discussion posts are stored elsewhere. Its default is English and dark,
with German and light options for consistency. Its noindex status applies
both in HTML and at the server boundary.

## Translation rules

`en-US` is the default and must carry complete content. `de-DE` should
express the same meaning, not mechanically mirror sentence length. Keep
technical spellings such as `Visual.XSharp.kts`, `CorePrep`, `Xpp`, and
`Xmm` stable. Translate navigation labels, help text, figure descriptions,
and accessible names. When adding a paragraph or an interaction, add both
languages in the same change so a locale switch never leaves mixed copy.

The URL is shared between language preferences. Do not emit inaccurate
`hreflang` alternatives implying separate German URLs. The document `lang`
attribute and browser metadata should follow the selected locale. The
canonical URL should remain the supported route without tracking query
parameters.

## Visual identity

The logo contains a leopard. Treat the leopard as an intentional mascot,
not a decorative abstract flourish to be replaced by a generic X. Use the
full Visual X# composition where it is large enough to read; use the
leopard-only vector crop for small browser and header contexts. It is
acceptable for the SVG background to be transparent on the webpage while
the social-preview image has a dark background.

Visual X# and Progmasoft share ownership, not a single interchangeable
mark. The corporate four-color artwork does not substitute for the purple
leopard logo. A footer may name Progmasoft as the project owner without
turning the language homepage into a corporate landing page.

## Interaction and accessibility

The design favors a calm editorial layout. Animation is optional and must
earn its place by improving clarity. Prefer short hover/focus transitions
to large continuously moving decoration. Honor reduced-motion settings.
Language and theme controls should be obvious, have useful accessible
names, and remain keyboard reachable. Their slightly rounded corners are
intentional; they should not turn into oversized pill buttons that dominate
the navigation.

The two themes should be checked for text, muted copy, border, link, and
focus contrast, including on the code block. The mobile layout must keep
the hero, the feature list, documentation sidebar, and navigation readable
without horizontal overflow. A desktop screenshot alone is insufficient.

## Search and indexing

The sitemap lists only the three supported main-domain language routes.
The forum placeholder stays noindex. Account, package, retired registry,
and staging endpoints must not appear in the sitemap. Each supported route
has its own title, description, social title/description, and canonical URL
when the application runs. The HTML shell has English home metadata so it
does not present a blank title before JavaScript initializes.

Opening the public site later is a separate decision from writing this
content. Until then, main-domain 503 is expected and should not be
misdiagnosed as a broken frontend build.

## Review checklist

Before approving a copy change, check:

- Is every language claim grounded in the public Spec or compiler tests?
- Does the wording say “designed to” where implementation is incomplete?
- Does the command match the latest CLI and toolchain guide?
- Does the German version preserve meaning and technical identifiers?
- Are internal notes and private file paths absent from the public page?
- Are homepage and docs links still valid after repository movement?
- Are source attribution and the Visual X# leopard identity intact?
- Are there any unintended account or package links on this language site?
- Can a reader distinguish site availability from compiler readiness?
