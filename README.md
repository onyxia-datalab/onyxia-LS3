# onyxia-LS3

Custom LS3 resources for Onyxia.

This project is authored in TypeScript/TSX and builds to the plain custom-resource
format consumed by Onyxia:

```txt
docs/
assets/
js/
  index.mjs
```

Runtime dependencies are still provided by Onyxia through `ctx.import(...)`. The
build step only compiles the local TypeScript/TSX source and bundles the local
custom-resource code.

## Development

Clone this repository inside the Onyxia web directory, next to `src/` and
`public/`:

```bash
git clone https://github.com/InseeFrLab/onyxia
cd onyxia/web
yarn
git clone https://github.com/garronej/onyxia-LS3
cd onyxia-LS3
npm install
npm run dev
```

`npm run dev`:

- copies `onyxia-LS3/.env.local.yaml` to `web/.env.local.yaml`;
- removes and recreates `web/public/custom-resources`;
- builds `custom-resources/docs`, `custom-resources/assets`, and `src/main.ts`
  into `web/public/custom-resources`;
- watches source/static files and rebuilds on changes;
- starts Onyxia with `npm run dev` from `web/`.

The dev command intentionally refuses to run if this repository itself is located
at `web/public/custom-resources`, because that directory is deleted before each
dev build.

## Production Build

```bash
git clone https://github.com/InseeFrLab/onyxia
# Checkout the version d'Onyxia you're building against.
#git checkout v11.2.0
cd onyxia/web
yarn
git clone https://github.com/garronej/onyxia-LS3
cd onyxia-LS3
npm install
npm run build
```

The build creates:

```txt
onyxia-LS3.zip
```

The zip contains:

```txt
docs/
assets/
js/
  index.mjs
```

Upload `onyxia-LS3.zip` to a CDN and configure Onyxia with:

```yaml
onyxia:
    web:
        env:
            CUSTOM_RESOURCES: "<https url to onyxia-LS3.zip>"
```
