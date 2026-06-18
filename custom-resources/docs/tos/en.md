## Objective

The purpose of this usage charter is to define for the LS³ platform:

- Its rules of use.
- User responsibilities.
- Actions that are not technically, but organizationally, prohibited.

Compliance with this user charter is essential, as failure to comply with it will increase the risk of :

- Breach of data confidentiality.
- Degradation of service quality, or even unavailability of the platform.
- Damage to the integrity of data hosted on the platform.
- Total or partial loss of traceability of certain actions carried out on the platform.

## Confidentiality

When a user wishes to store a file in the S3 workspace of a personal or Onyxia group project, he agrees to place it in the path corresponding to his degree of sensitivity, among those present by default:

- Open data must be stored in the `open_data` path.
- Data for which all INSEE agents have access rights must be stored in the `insee` path.
- Confidential data (i.e. data for which only some Insee agents have access rights) should be stored :
    - in path `confidentiel/personnel_sensible` for sensitive personal data files.
    - in the path `confidential/non-sensitive personal` for non-sensitive personal data files.
    - in the path `confidential/others` for all other types of confidential data (aggregated data intended for distribution but still under embargo, non-personal individual data for which only certain INSEE staff are authorized to access, etc.).

When a user wishes to store a file in an S3 share space, he/she undertakes to check that the host space is authorized to receive this file:

- S3 share spaces of type `opendata` can only host open data files.
- S3 share spaces of the `insee` type can only host open data files, or files for which all INSEE employees have access rights.
- The `confnp` type of S3 workspace can only host files from the two previous categories, as well as confidential data files that are not of a personal nature.
- S3 `confpns` sharespaces can only host files from the previous three categories and confidential data files of a non-personal nature.
- S3 sharespaces of the `confps` type can host any type of file, including sensitive personal data files.
- The `public` type of S3 sharing space can host only open data files, or files for which all INSEE employees have access rights.

The user agrees not to expose confidential data via unauthenticated datavisualization applications (typically shiny applications) deployed from the platform for the purpose of provisioning to other agents.

The user undertakes to copy a confidential data file from an AUS space to a group Onyxia project S3 workspace only after verifying that all members of the group Onyxia project in question have authorization to access this data file. To do this, the user must contact the owner of the Onyxia group project and/or consult the list of members of the Onyxia group project in question via the https://gestion-comptes-utilisateurs.insee.fr/realm/SSP/applications/k8s-datascience interface.

The user agrees to copy a confidential data file from an AUS space to an S3 share space only after verifying that all persons with access to this S3 share space have authorization to access this data file. To do this, the user must contact the owner of the Onyxia group project and/or consult the list of people with access to this s3 share space via the https://gestion-comptes-utilisateurs.insee.fr/realm/SSP/applications/s3-datascience interface.

The user undertakes to copy a confidential data file from an Onyxia group project s3 workspace or s3 share space to an AUS space only after verifying that all persons with access to this AUS space have authorization to access this data file. To do this, the user must contact the owner of the AUS space in question and/or consult the list of people with access to this AUS space via the http://pdeasyvphpln100.ad.insee.intra/recherche_aus.php interface.

Before installing an "exotic" R or Python package within an interactive service launched from the platform's Onyxia portal, the user undertakes to check, even minimally, that this package does not present any security risks that could compromise the confidentiality of the data it will process.

The user undertakes never to place personal credentials (in particular the AD account password) in a kubernetes secret placed in a group Onyxia project namespace.

The user agrees never to put personal credentials (in particular the AD account password) in the "My secrets" panel for a group Onyxia project.

The user agrees never to inject personal credentials (in particular the AD account password) into an interactive service launched from a group Onyxia project.

The user agrees to use the interactive services of a group Onyxia project only to deploy applications (e.g. shinyproxy portals) in the namespace of this project and to debug the applications deployed within this namespace.

## Availability

The user agrees to turn off services launched from Onyxia as soon as they are no longer needed.

The user agrees to uninstall applications (shiny datavisualization, etc.) deployed from the platform as soon as they are no longer needed.

When a user configures a service from the catalog before launching it, he undertakes to define request values and CPU and RAM limits corresponding to his real need. In particular :

- With regard to CPU and RAM requests, do not modify the value configured by default in the service's control panel, unless you have a particular temporary need to guarantee resources so that important processing is guaranteed to run correctly.
- For CPU and RAM limits, specify a value slightly higher than the expected consumption peaks, if these are known precisely or at least approximately.


When a user deploys an application (shiny datavisualization, etc.) from the platform, he undertakes to define request values and CPU and RAM limits corresponding to his real needs.

The user undertakes to minimize unnecessary resource consumption by optimizing processing whenever possible. The datascience team is available to assist users in this respect.

The user is aware that any consumption of resources by a service launched from the platform's Onyxia portal resulting in a high risk of degradation of the platform's quality of service, or even its unavailability to other users, may result in the user being contacted to immediately reduce such consumption, and may even result in the service being stopped as a last resort by the datascience team.

The user is aware that the platform's internal S3 storage service does not currently offer a backup service, and therefore undertakes to copy any important files to AUS's storage service, which does offer such a service.

## Integrity

The user agrees not to modify or delete the subpaths present by default in the S3 workspaces of his Onyxia projects.

The user agrees not to modify or delete a file stored in an S3 workspace of an Onyxia group project if he/she does not know what the file contains.

The user agrees not to modify or delete a file stored in a shared S3 space if he/she does not know what this file contains.

The user agrees not to use the platform's internal S3 storage to retrieve and then install by his own means software within a service launched from the Onyxia catalog.

The user undertakes not to use the file upload functions offered by the catalog's interactive services to retrieve and install software within them.

Before installing an "exotic" R or Python package within a service launched from the Onyxia catalog, the user undertakes to check, even minimally, that this package does not present any security risks that could compromise the integrity of the data it will process.

When a user wishes to promote an image in the register of users' custom images for subsequent use within the LS³ platform, he/she undertakes to use an image from the official register of images made available by the Datascience team (https://gitlab.insee.fr/datascience/registry-prod/container_registry), except in special cases to be discussed in advance with the Datascience team.

## Traceability

The user agrees to use generic S3 service accounts only for application access to data files on S3 (e.g. for a shiny datavisualization application deployed from the platform), and not for interactive access.