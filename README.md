# onyxia-LS3

Onyxia customization source for the internal deployment of Onyxia: LS³.

What this does: 
- Customize theme and branding as documented [here](https://docs.onyxia.sh/admin-doc/theme).  
- Implement an alternative Home page.

<img width="2056" height="1170" alt="Image" src="https://github.com/user-attachments/assets/4cb63663-e1f3-4eac-a6be-b3aed087a1f9" />

<img width="2056" height="1170" alt="Image" src="https://github.com/user-attachments/assets/26d841c4-c390-4536-b07f-93c5be352312" />

## Development

To run this plugin locally:  

```bash
git clone https://github.com/InseeFrLab/onyxia
cd onyxia
# Checkout the version you are deploying the plugin against
# Version list here: https://github.com/InseeFrLab/onyxia/releases
git checkout v11.3.0 
cd web
yarn
git clone https://github.com/garronej/onyxia-LS3
cd onyxia-LS3
npm install
npm run dev
# OPTIONAL: Check if the code is sound, typewise:
npm run typecheck
```

## Production Build

> NOTE: This repo comes with CI Action for GitHub Action and GitLab CI that 
> build the plugin and publish it an an artifact.

```bash
git clone https://github.com/garronej/onyxia-LS3
cd onyxia-LS3
npm install
npm run build # Generate ./onyxia-LS3.zip
```

To deploy onyxia with this plugin, 

`apps/onyxia/values.yaml`
```yaml
onyxia:
    web:
        env:
            CUSTOM_RESOURCES: "<https url to onyxia-LS3.zip>"
            # The rest of the values in ./env.local.yaml
```
