# onyxia-LS3

## Dev

```bash
git clone https://github.com/InseeFrLab/onyxia
cd onyxia
cd web
yarn install
cd public
rm -rf custom-resources
git clone https://github.com/garronej/onyxia-LS3 custom-resources
node custom-resources/scripts/setup-env-local-yaml.mjs
cd ..
yarn dev
```

## Building for production

```bash
git clone https://github.com/garronej/onyxia-LS3 
cd onyxia-LS3
zip -r onyxia-ls3.zip . -x "./README.md" "./env.local.yaml"
```