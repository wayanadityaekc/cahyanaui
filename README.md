# Cahyana monorepo

Two Next.js sites and the component library they share.

```
apps/cue        cahyanaubudexperience.com  - tours and experiences
apps/villas     ubudprivatevillas.com      - the villas
packages/ui     @cahyana/ui                - the shared library
```

## The library is the product

Anything that lives in a site lives in the library first and is imported by
the site. That holds even for a block only one site uses today - a future
villa site should be able to drop its own content into the same slots.

The library is built from CUE's components as the source. It borrows
**shadcn/ui's structure** - three layers, components you own rather than a
dependency you upgrade - but takes no code and no dependency from it.

## Layers

```
tokens      colour, type, spacing, radius, shadow, motion.  CSS variables.
primitives  Button, Input, Badge, Select, DateField...      small, dumb.
blocks      Hero, Navbar shell, Footer shell, Card shell... composed.
```

Build bottom-up; a layer never imports from the layer above it.

## Deploys

Each site still deploys from its **own** repo for now - this monorepo does
not deploy anything, and the two apps' old workflow files sit at
`apps/*/.github/`, where GitHub does not look. Cutting a site over is a
change in the Hostinger panel, done once this repo has proven itself.
