
## Objectif

La présente charte d'usage a pour objectif de définir pour la plateforme LS³ :

- Ses règles d’utilisation.
- Les responsabilités des utilisateurs.
- Les actions interdites non pas techniquement mais organisationnellement.

Le respect de cette charte d'usage est fondamental dans la mesure où contrevenir à celle-ci entraînerait l'augmentation du risque :

- De rupture de confidentialité des données.
- De dégradation de la qualité de service voire d'indisponibilité de la plateforme.
- D'atteinte à l'intégrité des données hébergées au sein de la plateforme.
- De perte totale ou partielle de traçabilité de certaines actions effectuées sur la plateforme.

## Confidentialité

Lorsqu'un utilisateur souhaite stocker un fichier dans un espace de travail S3 d'un projet Onyxia personnel ou de groupe, il s'engage à le placer dans le path correspondant à son degré de sensibilité parmi ceux qui sont par défaut présents :

- Les données ouvertes doivent être stockées dans le path `open_data`.
- Les données pour lesquelles l'ensemble des agents de l'Insee ont le droit d'accès doivent être stockées dans le path `insee`.
- Les données confidentielles, c'est-à-dire celles pour lesquelles seule une partie des agents de l'Insee a le droit d'accès, doivent être stockées :
    - dans le path `confidentiel/personnel_sensible` pour les fichiers de données à caractère personnel sensibles.
    - dans le path `confidentiel/personnel_non_sensible` pour les fichiers de données à caractère personnel non sensibles.
    - dans le path `confidentiel/autres` pour tout autre type de données confidentielles (données agrégées destinées à la diffusion mais encore sous embargo, données individuelles non à caractère personnel mais pour lesquelles seulement certains agents de l'Insee sont habilités à accéder, etc.)

Lorsqu'un utilisateur souhaite stocker un fichier dans un espace de partage S3, il s'engage à vérifier que l'espace d'accueil est autorisé à accueillir ce fichier :

- Les espaces de partage S3 de type `opendata` peuvent accueillir uniquement des fichiers de données ouvertes.
- Les espaces de partage S3 de type `insee` peuvent accueillir uniquement des fichiers de données ouvertes ou bien pour lesquels l'ensemble des agents de l'Insee ont le droit d'accès.
- Les espaces de partage S3 de type `confnp` peuvent accueillir uniquement des fichiers des deux catégories précédentes et des fichiers de données confidentielles qui ne sont pas à caractère personnel.
- Les espaces de partage S3 de type `confpns` peuvent accueillir uniquement des fichiers des trois catégories précédentes et des fichiers de données confidentielles à caractère personnel non sensibles.
- Les espaces de partage S3 de type `confps` peuvent accueillir tout type de fichier, y compris des fichiers de données à caractère personnel sensibles.
- Les espaces de partage S3 de type `public` peuvent accueillir uniquement des fichiers de données ouvertes ou bien pour lesquels l'ensemble des agents de l'Insee ont le droit d'accès.

L'utilisateur s'engage à ne pas exposer des données confidentielles via des applications de datavisualisation (typiquement des applications shiny) sans authentification déployées à partir de la plateforme à des fins de mise à disposition auprès d'autres agents.

L'utilisateur s'engage à copier un fichier de données confidentielles depuis un espace AUS vers un espace de travail S3 de projet Onyxia de groupe uniquement après avoir vérifié que tous les membres du projet Onyxia de groupe en question ont l'autorisation d'accéder à ce fichier de données. Pour cela, l'utilisateur doit prendre contact avec le propriétaire du projet Onyxia de groupe et/ou consulter la liste des personnes membres du projet Onyxia de groupe en question via l'interface https://gestion-comptes-utilisateurs.insee.fr/realm/SSP/applications/k8s-datascience.

L'utilisateur s'engage à copier un fichier de données confidentielles depuis un espace AUS vers un espace de partage S3 uniquement après avoir vérifié que toutes les personnes ayant accès à cet espace de partage S3 ont l'autorisation d'accéder à ce fichier de données. Pour cela, l'utilisateur doit prendre contact avec le propriétaire du projet Onyxia de groupe et/ou consulter la liste des personnes ayant accès à cet espace de partage S3 via l'interface https://gestion-comptes-utilisateurs.insee.fr/realm/SSP/applications/s3-datascience.

L'utilisateur s'engage à copier un fichier de données confidentielles depuis un espace de travail S3 de projet Onyxia de groupe ou un espace de partage S3 vers un espace AUS uniquement après avoir vérifié que toutes les personnes ayant accès à cet espace AUS ont l'autorisation d'accéder à ce fichier de données. Pour cela, l'utilisateur doit prendre contact avec le propriétaire de l'espace AUS en question et/ou consulter la liste des personnes ayant accès à cet espace AUS via l'interface http://pdeasyvphpln100.ad.insee.intra/recherche_aus.php.

Avant d'installer un package R ou Python "exotique" au sein d'un service interactif lancé depuis le portail Onyxia de la plateforme, l'utilisateur s'engage à vérifier, même a minima, que ce package ne présente pas de risques de sécurité pouvant porter atteinte à la confidentialité des données qu'il traitera.

L'utilisateur s'engage à ne jamais mettre de credentials personnels (en particulier le mot de passe du compte AD) dans un secret kubernetes posé dans un namespace de projet Onyxia de groupe.

L'utilisateur s'engage à ne jamais mettre de credentials personnels (en particulier le mot de passe du compte AD) dans le panneau "Mes secrets" pour un projet Onyxia de groupe.

L'utilisateur s'engage à ne jamais injecter de credentials personnels (en particulier le mot de passe du compte AD) dans un service interactif lancé à partir d'un projet Onyxia de groupe.

L'utilisateur s'engage à n'utiliser les services interactifs d'un projet Onyxia de groupe que pour déployer des applications (par exemple des portails shinyproxy) dans le namespace de ce projet et pour déboguer les applications déployées au sein de ce namespace.

## Disponibilité

L'utilisateur s'engage à éteindre les services lancés depuis Onyxia dès qu'il n'en a plus besoin.

L'utilisateur s'engage à désinstaller les applications (de datavisualisation shiny, etc.) déployées à partir de la plateforme dès qu'elles ne sont plus utiles.

Lorsqu'un utilisateur configure un service du catalogue avant de le lancer, il s'engage à définir des valeurs de requests et de limits CPU et RAM correspondantes à son réel besoin. En particulier :

- Concernant les requests CPU et RAM, ne pas modifier la valeur configurée par défaut dans le panneau de configuration du service, sauf besoin particulier temporaire de garantie de ressources pour qu'un traitement important soit assuré de s'exécuter correctement.
- Concernant les limits CPU et RAM, indiquer une valeur légèrement supérieure aux pics de consommation attendus s'ils sont connus précisément ou du moins approximativement.

Lorsqu'un utilisateur déploie une application (de datavisualisation shiny, etc.) à partir de la plateforme, il s'engage à définir des valeurs de requests et de limits CPU et RAM correspondantes à son réel besoin.

L'utilisateur s'engage à essayer de minimiser la consommation inutile de ressources en optimisant ses traitements dès que cela est possible. L'équipe datascience se tient à disposition des utilisateurs pour les accompagner à cette fin.

L'utilisateur est conscient que toute consommation de ressources d'un service qu'il a lancé depuis le portail Onyxia de la plateforme ayant pour conséquence un risque élevé de dégradation de la qualité de service de la plateforme voire d'indisponibilité de cette dernière pour les autres utilisateurs pourra amener à ce qu'il soit contacté pour réduire immédiatement cette consommation et pourra même voir en dernier recours son service arrêté en urgence par l'équipe datascience.

L'utilisateur est conscient que le service de stockage S3 interne à la plateforme ne présente pas à ce jour d'offre de sauvegarde, et s'engage donc à copier tout fichier important vers le service de stockage d'AUS, qui, lui, présente une telle offre. 

## Intégrité

L'utilisateur s'engage à ne pas modifier ou supprimer les subpath présents par défaut dans les espaces S3 de travail de ses projets Onyxia.

L'utilisateur s'engage à ne pas modifier ou supprimer un fichier stocké dans un espace S3 de travail d'un projet de groupe Onyxia à partir du moment où il ignore ce que ce fichier contient.

L'utilisateur s'engage à ne pas modifier ou supprimer un fichier stocké dans un espace S3 partagé à partir du moment où il ignore ce que ce fichier contient.

L'utilisateur s'engage à ne pas utiliser le stockage S3 interne de la plateforme pour récupérer puis installer par ses propres moyens un logiciel au sein d'un service lancé depuis le catalogue Onyxia.

L'utilisateur s'engage à ne pas utiliser les fonctionnalités d'upload de fichiers offertes par les services interactifs du catalogue pour récupérer puis installer par ses propres moyens un logiciel en leur sein.

Avant d'installer un package R ou Python "exotique" au sein d'un service lancé depuis le catalogue Onyxia, l'utilisateur s'engage à vérifier, même a minima, que ce package ne présente pas de risques de sécurité pouvant porter atteinte à l'intégrité des données qu'il traitera.

Quand un utilisateur souhaite promouvoir une image dans le registre des images customisées des utilisateurs afin de l'utiliser ensuite au sein de la plateforme LS³, il s'engage à utiliser une image du registre officiel des images mises à disposition par l'équipe datascience (https://gitlab.insee.fr/datascience/registry-prod/container_registry), sauf cas particulier à discuter au préalable avec l'équipe Datascience.

## Traçabilité

L'utilisateur s'engage à utiliser les comptes de service S3 génériques uniquement pour un accès applicatif à des fichiers de données sur S3 (par exemple pour une application de datavisualisation shiny déployée à partir de la plateforme), et non pas pour un accès interactif.
