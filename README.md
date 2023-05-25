# Pilori

Cette saison on a vu comment créer des serveur HTTP et comment faire un site dynamique en respectant l'architecture MVC.

Les saisons passées on a travaillé des intégrations statiques des pages types du projet Pilori.

Il est grand temps de passer à une version dynamique de ce projet. Cela nous permettra de reprendre les différents points de la saison pour s'entraîner.

L'objectif est donc : créer un serveur http pour servir les pages du site pilori qui présentent notamment une liste de site non accessibles, une page de détail par site, un formulaire pour ajouter un site, la possibilité de créer un compte utilisateur.

## 1. Mise en place du projet

1. On initialise un projet qui va avoir des dépendances donc on crée d'abord un fichier `package.json` avec `npm init -y`
2. On va avoir des dépendances qu'on ne souhaite pas partager sur github donc on crée un fichier `.gitignore` contenant `node_modules`, on peut y écrire `.env` également vu qu'on aura probablement des variables d'environnement
3. On peut déjà créer un fichier `.env` pour y définir une variable d'environnement pour le port de notre serveur et un fichier `.env.example` qui servira d'exemple
4. On va utiliser la syntaxe ESM (import / export) donc on ajoute l'option `type: module` dans le `package.json`
5. On peut commencer par installer un package pratique : `node-dev` (avec l'option `--save-dev` dans la commande d'installation puisque ça n'est utile que sur l'environnement de développement)
6. On crée le fichier principal de notre programme qui contiendra notre futur serveur HTTP : un fichier `index.js` à la racine du projet. Pour l'instant on place uniquement un `console.log` dedans on va bientôt tester que tout va bien
7. On peut ajouter des scripts pratiques dans le `package.json` pour lancer l'index via `node-dev`. Pour cela on peut reprendre des scripts d'un projet passé.

Place au test : on peut lancer notre script (quelque chose comme `npm run dev`) et voir le `console.log` de notre index.

Si tout va bien on continue sinon on cherche ce qui ne va pas.

Tu peux maintenant mettre en place les dossiers de base pour notre architecture MVC

A savoir
- Un dossier `app` qui contiendra le code de notre serveur
- Un dossier `app/views` qui servira aux vues
- Un dossier `app/controllers` qui servira aux contrôleurs
- Un dossier `app/models` qui servira aux modèles

## 2. Mise en place des dépendances et du serveur

1. On peut déjà anticiper pas mal de dépendances et les installer, si on en oublie pas grave, on les ajoutera après :
  - `bcrypt` pour le hachage des mots de passe
  - `dotenv` pour prendre en compte les variables d'environnement du fichier `.env`
  - `ejs` pour gérer les templates constituant nos vues
  - `express` pour définir notre serveur http
  - `express-session` puisqu'on va avoir une mécanique de session pour maintenir nos utilisateurs connectés
  - `validator` pour valider des données notamment l'email à l'inscription
2. On va remplir l'`index.js` principal avec la mise en place de notre serveur, on peut d'ores et déjà y placer :
  - L'appel à dotenv pour la configuration des variables d'environnement
  - La définition d'un port
  - La création du serveur via la fonction express
  - L'ajout des configurations pour définir le moteur de vues et le dossiers des views
  - L'ajout du middleware d'express-session : n'oublie pas de définir une variable d'environnement pour l'option `secret`
  - L'ajout du middleware `urlencoded` puisqu'on va gérer des formulaires envoyant des informations dans le corps de la requête qu'il faudra parser
  - L'appel à la méthode `listen` pour mettre le serveur en mode écoute

Et voilà ! Une bonne chose de fait ! Enfin à condition de tester :

- Lance ton serveur et corrige les erreurs éventuelles
- Envoie une requête depuis ton navigateur, tu dois avoir le message par défaut d'express `Cannot GET ...`

On va maintenant pouvoir mettre en place des réponses plus intéressantes

## 3. Assets statiques

Cette étape on va la regarder ensemble car on va mettre en place un truc sympa qu'on n'a jamais fait.

L'objectif est de servir les assets statiques, pour ça on va mettre en place le middleware `express.static`

Habituellement on faisait un dossier `public` à la main. 

Sauf que nos assets statiques, on les a déjà construits les saisons passées. C'est le _build_ qu'on avait construit avec parcel.

On pourrait faire un copier / coller de ce build chaque fois qu'on le modifie dans notre dossier `public`.  
Ou bien, plus intéressant, on va pouvoir utiliser un `submodule` avec git.

Un _submodule_, c'est un dépot git récupéré à l'intérieur d'un autre dépôt git.

Donc dans notre projet :

- On tape la commande `git submodule add ADRESSE_DU_DEPOT_INTE`  
  tu remarques à ce stade 2 choses : un dossier `inte-pilori` a été récupéré, correspondant à notre intégration et un fichier `.gitmodules` a été ajouté pour faire le lien avec notre _submodule_  
- De plus je te donne un script à ajouter, le lead developper te l'a préparé, il sera pratique :
  - `"build": "git submodule update --recursive --remote & npm i --prefix inte-pilori & npm run build --prefix inte-pilori"`
  qui te permet de faire le _build_ de l'inté pour générer les assets après avoir mis à jour le _submodule_ pour partir de l'intégration à jour
- Lance le script `npm run build`, ainsi ton dossier d'assets statiques est prêt dans `./inte-pilori/public`

Il ne reste plus qu'à servir les assets statiques !

- Mets donc en place le middleware `express.static` pour servir `./inte-pilori/public`
- Pour tester tu peux envoyer une requête vers `/bandeau.jpg` depuis ton navigateur et voir si l'image est bien servie

Une fois ceci en place, on entre dans le vif du sujet puisqu'on va pouvoir attaquer les pages dynamiques.

## 4. Routes

D'abord on va s'organiser pour nos routes

1. Crée un router dans un fichier dédié, disons `app/router.js`
2. Exporte le et récupère le dans ton index pour l'ajouter à ton serveur

Puis on va en créer une première pour tester

3. Crée une première route pour l'accueil sur `/` en get
4. Crée un contrôleur pour y ranger la fonction associée à la route
5. Envoie une réponse minimaliste pour commencer par exemple `res.send('ok')`
6. Teste depuis ton navigateur en appelant `/` et vois si tu as la réponse attendue.

Pour l'instant on n'a pas cherché à faire une réponse sophistiquée, juste à mettre en place les fondations de notre projet

Quand ton test est ok, tu peux répéter l'opération pour les routes qu'on va chercher à implémenter durant les jours qui viennent sur cet atelier à savoir

- `/mentions-legales` en `get` pour la page de mentions légales
- `/plan` en `get` pour la page plan du site
- `/contact` en `get` pour la page de contact
- `/tomates` en `get` pour la liste des sites tomatés
- `/tomates/denoncer` en `get` pour le formulaire de dénonciation
- `/tomates/denoncer` en `post` pour le traitement du formulaire de dénonciation
- `/tomates/:slug` en `get` pour les pages de détail d'un site dénoncé, une route paramétrée sera pratique
- `/connexion` en `get` pour le formulaire de connexion
- `/connexion` en `post` pour le traitement du formulaire de connexion
- `/inscription` en `get` pour le formulaire d'inscription
- `/inscription` en `post` pour le traitement du formulaire d'inscription
- `/deconnexion` en `get` pour la déconnexion
- `/profil` en `get` pour la page de profil d'un utilisateur

Contente toi à chaque fois d'une réponse minimaliste (tu peux tester les routes en GET dans ton navigateur).

Au niveau des contrôleurs, je te conseille

- un contrôleur regroupant les méthodes des routes génériques
- un contrôleur regroupant les méthodes des routes des site dénoncés
- un contrôleur regroupant les méthodes des routes liées à l'authentification
- un contrôleur regroupant les méthodes des routes liées au profil d'un utilisateur

Bien sûr, fais comme selon ce que tu juges pratique.

## 5. Premier modèle

On a mis en place une bonne partie des choses. On va pouvoir maintenant travailler nos routes une par une.

Si on analyse la page d'accueil, on voit qu'elle liste des sites.  
On va commencer par définir les données de cette liste de sites et surtout le modèle qui définit ce qu'est un site

1. Crée une classe `Website` dans un fichier dédié qui servira de modèle et exporte là
2. Nos sites aurons pour commencer 5 caractéristiques, définis une propriété privée pour chacune d'entre elle :
  - un titre
  - une description
  - une adresse 
  - un appareil
  - un niveau
3. Définis un getter pour chaque propriété qui retourne sa valeur
4. Définis un setter pour chaque propriété qui réassigne sa valeur en fonction d'un paramètre.  
   Ne pose pas encore de validation, on y va par étape
5. Définis un `constructor` qui appelle le setter de chaque propriété en fonction de son/ses paramètre(s) 

Place au test

- Importe ta classe n'importe où pour la tester, par exemple dans ton `index`
- Instancie là avec des informations bidons pour tester
- Contrôle ton instance et ses getter voir si tout est conforme et corrige les éventuels soucis

Une fois que tout est ok, ajoute les validations dans tes setter, cela évitera d'avoir des données mal formées dans notre application :

- Le titre doit être une chaîne de caractère, il est obligatoire
- L'adresse est obligatoire, elle doit être une adresse de site internet (le package `validator` fourni une méthode pratique, regarde sa documentation)  

Autrement pas de contrainte particulière.

En bonus si tu le sens tu peux faire en sorte de n'autoriser que 3 valeurs pour l'appareil à savoir _Mobile, Ordinateur ou Lecteur d'écran_.  
De même pour le niveau à savoir _Bloquant, Gênant ou Casse-tête_.

- Teste l'instanciation avec des données correcte et incorrecte pour voir si les erreurs sont bien jetées.
- Quand tout est ok définis une liste de sites qui va nous servir à dynamiser nos pages
  - crée un fichier `app/data/website.js`
  - exportes-y un tableau qui représentent la liste des sites
  - place 4 instances de ton modèle dans ce tableau avec les données suivantes
    - Premier site 
    ```
    Titre: 'Oclock.io'
    Description: "Il y a un gros problème. Je constate de très gros soucis pour naviguer et c'est impossible d'utiliser correctement tous les boutons à disposition."
    Adresse: 'https://oclock.io/'
    Appareil: 'Mobile'
    Niveau: 'Bloquant'
    ```
    - Deuxième site 
    ```
    Titre:  'NPM'
    Adresse: 'https://www.npmjs.com/'
    ```
    - Troisième site 
    ```
    Titre: 'Google'
    Description: 'Il y a un tout petit problème.'
    Adresse: 'https://www.google.com/'
    Appareil: 'Ordinateur'
    Niveau: 'Casse tête'
    ```
    - Quatrième site 
    ```
    Titre: 'Wikipédia'
    Description: "C'est pas jojo"
    Adresse: 'https://fr.wikipedia.org/'
    Appareil: 'Mobile'
    Niveau: 'Bloquant'
    ```

N'hésite pas à importer ta liste dans ton index pour la contrôler.  
Puis une fois que tu t'es assuré que tout est ok, enlève les tests de ton index.

## 6. Dynamisation d'une première page avec l'accueil

Bon, on a des données prêtes à être présentées, un serveur qui entend des requêtes, des routes en places pour dire à quelles demandes répondre.

Allons compléter une première route, celle de la page d'accueil. Ce n'est pas une mince affaire, teste bien chaque étape

1. Modifie la méthode de contrôleur associée à la route d'accueil pour y faire le rendu d'une vue pour l'accueil
2. Prépare la vue correspondante en créant un fichier `ejs`
3. Copie-colle à l'intérieur le code HTML de la page d'accueil puisqu'on y avait déjà refléchit au moment de l'intégration. Tu le trouveras dans `inte-pilori/src/index.html`
4. Pour éviter les répétitions dans nos futures routes, prévois des vues partielles pour toute l'entête du site et pour le pied de page
5. Edite les liens et les images pour pointer vers les bons chemins
6. On va dynamiser la liste des sites
  - Importe la liste des sites dans ton contrôleur
  - Passe la liste des sites à ta vue
  - Remplace les cartes en dur dans ta vue par une boucle qui parcourt ta liste de site
  - Pour chaque site dynamise le code html correspondant à une carte présentant un site  
  _Tu te demandes peut-être quoi mettre dans le `href` du lien `Lire la suite` ? Bonne question, peu importe pour l'instant on verra lors de l'étape 10 !_
  _Ne te préoccupe pas de l'image, du compteur de tomates et des boutons, on ne gère pas ces fonctionnalités durant cet atelier_  
7. On ne veut que 3 sites sur l'accueil, documente-toi sur la méthode `slice` des `Array` pour voir comment ne passer que les 3 premières valeurs de ton tableau à ta vue

En bonus n'hésite pas à faire des vues partielles pour certains fragments de la page qui seront présents sur d'autres pages, à savoir le formulaire de dénonciation et une carte présentant un site.

## 7. Quelques pages supplémentaires

Prends 30 secondes pour souffler. Visualise ce qu'on vient de faire : 

- on a un serveur en mode écoute qui entend quand on envoie une requête sur `/`
- on a une route correspondante qui est appelée en conséquence
- dans la méthode de contrôleur associée on a pu préparer une liste de sites, des instances d'un modèle qui décrit la forme de nos informations
- dans cette même méthode on a pu passer cette liste à une vue
- cette vue est un assemblage de fragments de html dynamisé avec les données de nos sites

Pas mal quand même !

Continuons maintenant.

Le lead developper t'as préparé une première vue

<details>
  <summary>1ère vue</summary>

```ejs
<%- include('partials/header') %>
<main class="content">
  <h1 class="content-title"><%= title || 'Prochainement' %></h1>
  <section class="segment">
    <p>La page demandée n'existe pas encore mais nous y travaillons.</p>
    <div class="segment-actions">
      <a class="btn btn--outline" href="/tomates">Envoyer des tomates</a>
      <a class="btn" href="/tomates/denoncer">Commencer la dénonciation</a>
    </div>
  </section>
</main>
<%- include('partials/footer') %>
```

</details>

Elle va nous servir pour indiquer que les pages Plan du site, Contact et Mentions légales sont en construction pour l'instant

1. Copie ce code dans une vue `ejs`
2. Renvoie cette vue pour la page Contact. Adapte les chemins vers les vues partielles si ça ne correspondant pas à ton projet.
3. Tu remarques que cette vue peut utiliser une donnée `title`, fais en sorte de lui passer le titre `Contact` depuis ton contrôleur
4. Fais de même pour les pages Plan du site et Mentions légales

Hop 3 pages en plus.

On va gérer maintenant la vue d'erreur, encore une fois le lead developper t'as préparé du code

<details>
  <summary>2ème vue</summary>

```ejs
<%- include('partials/header') %>
<main class="content">
  <h1 class="content-title">Erreur</h1>
  <section class="segment">
    <p><%= locals.message || 'Une erreur s\'est produite' %></p>
    <div class="segment-actions">
      <a class="btn btn--outline" href="/tomates">Envoyer des tomates</a>
      <a class="btn" href="/tomates/denoncer">Commencer la dénonciation</a>
    </div>
  </section>
</main>
<%- include('partials/footer') %>
```

</details>

1. Ajoute un middleware pour la page d'erreur 404
2. Fais-y le rendu de cette vue avec le bon status
3. Tu remarques qu'elle peut utiliser une donnée `message`, configure là avec le message `La page demandée n'a pas pu être trouvée`

## 8. Encore une page pour le listing des sites

On ne s'arrête plus en si bon chemin. On va maintenant faire la page de listing de tous les sites pour la route `/tomates`.

- Fais le rendu d'une vue
- Passe la liste de tous les sites à cette vue
- Inspire toi de la vue d'accueil pour ta vue, sauf qu'on ne veut qu'une liste sur celle-ci, pas le formulaire de dénonciation
- Pense à changer le titre, on voudrait `Tous les sites`

## 9. Premier formulaire pour la recherche

On va désormais rendre fonctionnelle le formulaire de recherche en haut de page.

A la validation de ce formulaire, on va afficher la page de listing mais avec une liste de sites filtrée.

- Fais en sorte que ton formulaire génère des requête en `GET` sur `/tomates`
- On veut passer les critères de recherche dans la requête, vérifie que le champ de recherche a bien un attribut `name`

Modifie ensuite la méthode de contrôleur associée à la route `/tomates` en get. Ce qu'on veut y dire c'est :

- Si un critère de recherche est présent dans la requête (à toi de voir comment accéder aux infomrations passées via un formulaire en get)
  - On filtre la liste des sites en fonction du critères de recherche, on ne veut que le site dont le titre inclue la recherche
  - Si il y a des résultats, on renvoie la vue avec la liste filtrée avec le titre `Résultats`
  - Sinon on envoie une vue d'erreur indiquant qu'il n'y a aucun résultat.
- Sinon (quand aucun critère de recherche n'est présent)
  - On renvoie la vue avec la liste de tous les sites avec le titre `Tous les sites`

## 10. Première route paramétrée pour le détail d'un site

Allez ça prend sacrément forme ! Et ça va être encore mieux avec la prochaine route qui est une route paramétrée.

On va travailler la route `/tomates/:slug`. Le but va être de renvoyer une page dynamisée avec les informations d'un site.

D'abord premier problème, on n'a rien pour identifier un site d'après notre modèle `Website`, pas d'`id` ni de `slug`.  
Et bien on va ajouter un `slug` (un identifiant textuel).

1. Ajoute un getter pour `slug`, pas besoin d'ajouter de propriété privée, de setter ou de modifier le constructor, on va le calculer à partir du titre déjà présent
2. Installe le package `slugify` puis ouvre sa documentation
3. Fais en sorte que ton getter `slug` retourne un slug à partir du titre grâce à slugify

Ainsi puisque chaque site a un titre, pour chaque site on aura accès à un slug.

- Tu peux à présent modifier les `href` des cartes des sites dans tes vues `ejs` pour que les liens `Lire la suite` pointent vers `/tomates/ICI-LE-SLUG-D-UN-SITE`.  
  Désormais quand on clique sur un de ces liens, c'est la route `/tomages/:slug` qui va s'activer. 

Améliorons la réponse

1. Place toi dans la méthode de contrôleur associé à la route pour y préparer les données
2. A partir de la liste des sites (le tableau que tu as préparé dans les étapes précédente), trouve le site en fonction du slug demandé dans la requête (tu sais on peut retrouver la partie paramétrée)
3. Si aucun site n'a été trouvé laisse passer au middleware d'erreur
4. Sinon fais le rendu d'une vue en lui passant les données du site demandé
5. Complète ta vue `ejs` à partir de l'intégration qu'on avait fait dans `inte-pilori/src/pages/detail.html` et dynamise là avec les données du site

Teste un peu tes différentes pages, on a normalement accès au détail de chaque site !

## 11. Second formulaire pour l'ajout d'un site

Occupons-nous maintenant de l'ajout de site quand on valide le formulaire de dénonciation.

1. Déjà il faut faire le rendu d'une vue dans la méthode de contrôleur associée à `/tomates/denoncer` en `GET`
2. Dans cette vue on veut décrire une page contenant le même formulaire que sur la page d'accueil
3. Fais en sorte que le formulaire génère des requêtes en `POST` vers `/tomates/denoncer` lors de sa soumission
4. Veille à ce que les données des champs soient envoyées à la soumission en vérifiant que ceux-ci portent bien chacun un attribut `name`
5. Complète ensuite la méthode de contrôleur associée à `/tomates/denoncer` en `POST` pour décrire quoi faire à la validation du formulaire
  - Dans cette méthode il faut essayer d'instancier le modèle `Website` en fonction des informations reçues dans la requête post
  - quand tout va bien on ajoute le site ainsi crée dans la liste des sites
  - et on redirige vers la page de détail du site nouvelement créé 
  - quand tout va mal, on attrape les erreurs jetées par le modèle 
  - et on fait à nous le rendu de la vue du formulaire en lui passant le message d'erreur à afficher

## 12. Connexion et inscription

Prochaine étape : permettre à des utilisateurs de s'inscrire et de se connecter

Pour cette étape on va procéder un peu différemment puisqu'on l'a déjà fait

Déjà visualisons ce dont on a besoin :

- D'un modèle définissant la forme de nos objets représentant nos utilisateur
- D'un formulaire d'inscription
- D'un formulaire de connexion
- D'une méthode de contrôleur pour créer une instance d'utilisateur à l'inscription en veillant à hacher le mot de passe
- D'une méthode de contrôleur pour connecter nos utilisateurs en changeant leur statut dans la session (rappelons qu'on a déjà mis le middelware d'`express-session` dans les étapes préliminaires)

En fait c'est exactement la même chose que la dernière fois,

Ainsi base toi sur le projet `exos-auth` pour

1. Reprendre le modèle `User.js` et l'adapter 
  - pas besoin de présentation notamment
  - juste un email et un mot de passe, enfin un hash
2. Reprendre le contrôleur `authController.js` et l'adapter
  - vérifier que le nom des méthodes correspond aux routes du projet
  - vérifier que les url de redirections sont pertinentes pour notre projet
3. Reprendre les vues `register.ejs` et `login.ejs` et les adapter. Pour les noms des classes à utiliser sur la structure html on peut regarder du côté des formulaires présent dans l'intégration `inte-pilori/src/pages`

En profiter quand on adapte pour s'assurer qu'on comprend l'utilité de chaque ligne, sinon demander !

## 13. Contrôle d'accès et page profil

Dernière étape !

Notre menu en haut à droite n'est pas pratique, en effet il nous faut des boutons différents suivant si on est connecté ou non pour pointer soit vers la connexion/inscription soit vers la deconnexion/profil.  
Ce menu étant présent sur toutes les pages, il va falloir passer une information à toutes les vues pour savoir si oui ou non on est connecté.

1. Crée un middleware et utilise le pour toutes les requêtes, il faut que ce middleware soit appelé après express-session mais avant ton routeur, puisque son job va être de rendre dispo une information de la session à toutes tes vues
2. Dans ce middleware regarde si une information en session te permet de savoir si l'utilisateur est connecté (une information qu'on a ajouté donc au moment de sa connexion)
3. On ajoute une information pour toutes nos vues via la propriété `res.locals` qui représente le fait qu'on est connecté ou non
4. Dans notre `header` on ajoute une condition suivant si on est connecté ou non pour afficher 2 liens vers connexion et inscription ou 2 liens vers déconnexion et profil

Ensuite si ce n'est pas déjà fait met en place la déconnexion

Occupons-nous maintenant de la page profil

Le lead developper t'a préparé la vue

<details>
  <summary>vue porfil</summary>

```ejs
<%- include('partials/header') %>
<main class="content">
  <h1 class="content-title">Mon compte</h1>
  <section class="segment">
    <h2 class="segment-title">
      <%= user.email %>
    </h2>
  </section>
</main>
<%- include('partials/footer') %>
```

</details>

- Fais le rendu de cette vue pour la méthode de contrôleur associée à la route `/profil`
- Elle a besoin des informations de l'utilisateur connecté
  - tu dois donc trouver les informations de l'utilisateur en session et les passer à ta vue
  - pour faire tes tests veille donc à te connecter 

Dernière chose à mettre en place, actuellement on peut accéder à `/profil` ou `/logout` par url direct même si on est pas connnecté

- Met en place un test pour vérifier en fonction de la session si on est connecté avant d'envoyer une réponse pour ces requêtes, sinon envoie une page d'erreur avec le statut correspondant.

## Aller plus loin

Si c'est fini, tu peux envisager d'ajouter ce qui te fait plaisir.  
Par exemple imagine comment gérer les boutons pour compter les tomates lancées.  
Ou intéresse-toi à l'upload d'images pour le formulaire de dénonciation, pour cela le package [`multer`](https://www.npmjs.com/package/multer) te seras utile.  
Ou quoi que ce soit qui te passe par la tête ! S'il reste beaucoup de temps imagine même ton propre site sur une thématique différente.