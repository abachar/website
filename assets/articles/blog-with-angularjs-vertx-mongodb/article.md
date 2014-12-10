Le web asynchrone!! Les bases de données No SQL et le SPA/SPI!! En fait ça veut dire quoi tous ces termes ?? Dans ce 
tutoriel nous allons voir comment crée un Blog en utilisant AngularJS, Vert.x et Mongo DB et au fur à mesure que nous 
avançons dans la construction de notre blog nous expliquerons tous ces termes.

# I- AngularJS

Angular JS est un framework de développement Javascript côté client opensource. Google est à l’origine de ce framework 
et de nombreuses personnes contribuent à ce projet, voici les fonctionnalités les plus intéressantes de AngularJS :

- Two Way Data-Binding
- Templates
- MVC
- Dependency Injection
- Directives/Components

## 1- Configuration de AngularJS

Nous allons commencer par créer l'arborescence de notre projet :

```
[webapp]
    [assets]
        [js]
            app.js
        [libs]
            [angular]
            [jquery]
    index.html
    server.js
```

Commencer par télécharger la librairie jQuery sur le site [http://jquery.com](http://jquery.com),
placez votre fichier jquery-x.y.z.js dans le dossier webapp/assets/libs/jquery, l’utilisation de jQuery n’est
pas obligatoire mais elle est souhaitable, AngularJS utilisera jQuery s’il le trouve dans le cas contraire
Angular utilisera une implémentation lite de jQuery qu’il appel jQLite.

Ensuite télécharger AngularJS depuis le site [http://angularjs.org](http://angularjs.org) je vous
conseille la version stable en zip, pour commencer nous allons utiliser les deux fichiers angular.js et
i18n/angular-locale_fr-fr.js que nous placerons sous le dossier webapp/assets/libs/angular et
webapp/assets/angular/i18n.

Dans la page index.html copier ce code :

```html
<!doctype html>
<html lang="fr" ng-app="blog">
<head>
    <meta charset="utf-8" />
    <title>Blog</title>
</head>
<body>
    <script src="assets/libs/jquery/jquery-1.9.1.min.js" ></script>
    <script src="assets/libs/angular/angular-1.0.1.min.js"></script>
    <script src="assets/libs/angular/i18n/angular-locale_fr-fr.js"></script>
    <script src="assets/js/blog.js"></script>
</body>
</html>
```

Et dans le fichier blog.js

```js
var blog = angular.module('blog', []);
```

Tester dans votre navigateur, de préférence google chrome car vous pouvez y installer un plugin AngularJS utile lors 
du développement.

Voila votre application est maintenant bien configurer :) mais c’est quoi le ng-app et la ligne de code écrite dans le 
fichier app.js ?

- **angular.module** : Elle permet de déclarer un module Angular qui à son tour permet de déclarer : des directives, des 
controleurs, des filtres, des constantes et des services.
- **ng-app**: La directive ng-app (ngApp) initialise automatiquement l’application. L’affectation d’une valeur contenant
un identifiant implique le chargement du module déclaré précédemment avec angular.module

## 2- Liste des articles

Avant d'utiliser une vrai base de données, nous commencerons par une liste javascript qui jouera le rôle de notre DB.

```js
// db.blog.js
var listOfPosts = [
    {
        code  : 'vertx',  
        title : 'Vert.x', 
        date  : new Date(2013, 1, 25), 
        author: 'Abdelhakim Bachar', 
        text  : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu justo quam, gravida pharetra urna. Etiam lacinia massa quis nisi pharetra id iaculis arcu gravida. Phasellus a odio quam, sed tincidunt metus. Duis hendrerit sodales sapien eget cursus. Suspendisse potenti. Cras orci libero, luctus in sodales ac, sagittis eu lectus. Maecenas commodo libero non leo bibendum lobortis. Nunc tristique scelerisque ligula eget venenatis. Etiam sed ante nisl. Sed elit nunc, dictum vel convallis et, vulputate ac neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
        comments: [
            {date: new Date(2013, 1, 25), author: 'Abdelhakim Bachar', subject: 'Lorem ipsum dolor sit amet', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu justo quam, gravida pharetra urna.'},
            {date: new Date(2013, 1, 26), author: 'Ilyas', subject: 'Vivamus eros neque', text: 'Vivamus eros neque, elementum non venenatis pharetra, volutpat et ante. Pellentesque et orci turpis, nec vulputate orci.'}
        ],
        nbComments: 2
    }, {
        code: 'angularjs', 
        title: 'AngularJS', 
        date: new Date(2012, 10, 2), 
        author: 'Abdelhakim Bachar', 
        text: 'Vivamus eros neque, elementum non venenatis pharetra, volutpat et ante. Pellentesque et orci turpis, nec vulputate orci. In hac...',
        nbComments: 0
    }, {
        code: 'jquery', 
        title: 'jQuery', 
        date: new Date(2010, 5, 10), 
        author: 'Abdelhakim Bachar', 
        text: 'Integer eros arcu, sodales ut euismod in, hendrerit vel magna. Quisque condimentum, libero vel ultricies...',
        nbComments: 0
    }
];

/**
 *
 */
function getPostByCode(code) {

    var post = null;
    $.each(listOfPosts, function(index, value) {
        post = value;
        return false;
    });
    return post;
}
```


```js
var blog = angular.module('blog', []);

/**
 * Configure routes
 */
blog.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
        when('/', {templateUrl:'partials/posts.html', controller: listController}).
        otherwise({redirectTo:'/'});
}]);

/**
 *
 */
var listController = function($scope) {
    $scope.posts = listOfPosts;
}
```

- Dependency Injection
- config
- routeProvider
- when, otherwise
- controller
- $scope

```html
<!doctype html>
<html lang="fr" ng-app="blog">
<head>
    <meta charset="utf-8" />
    <title>Blog</title>
</head>
<body>
    <div ng-view></div>

    <script src="assets/libs/jquery/jquery-1.9.1.js"></script>
    <script src="assets/libs/angular/angular.js"></script>
    <script src="assets/libs/angular/i18n/angular-locale_fr-fr.js"></script>
    <script src="assets/js/db.blog.js"></script>
    <script src="assets/js/blog.js"></script>
</body>
</html>
```

ng-view

Et en fin le code HTML de la page de liste des articles 

```html
<h2>Liste des articles</h2>

<section id="posts">
    <article ng-repeat="post in posts">
        <h3><a ng-href="#/post/{{post.code}}">{{post.title}}</a></h3>
        <small>Le <time>{{post.date | date:'dd MMMM yyyy'}}</time> par <strong>{{post.author}}</strong></small>
        <p>{{post.text}}</p>
        <small>Il y a {{post.nbComments}} commentaires sur ce post, <a ng-href="#/post/{{post.code}}">Lire la suite</a></small>
    </article>
</section>
```

- Tow way data binding
- {{ }}
- les filtres
- ng-repeat
- ng-href

## 3- Affichage du post

```js
/**
 * Configure routes
 */
app.config(['$routeProvider', function($routeProvider) {

    $routeProvider.
        when('/post/:code', {templateUrl:'partials/post.html', controller: showController}).
        when('/', {templateUrl:'partials/posts.html', controller: listController}).
        otherwise({redirectTo:'/'});
}]);

/**
 *
 */
var showController = function($routeParams, $scope) {
    $scope.postCode = $routeParams.code;
    $scope.post     = getPostByCode($scope.postCode);
}
```

```html
<h2>{{post.title}}</h2>

<section>
    <small>Le <time>{{post.date | date:'dd MMMM yyyy'}}</time> par <strong>{{post.author}}</strong></small>
    <p>{{post.text}}</p>
</section>
```

## 4- Liste de commentaires

```js
/**
 *
 */
var showController = function($routeParams, $scope) {
    $scope.postCode = $routeParams.code;
    $scope.post     = getPostByCode($scope.postCode);
    $scope.comments = $scope.post.comments;
}
```

> Je sais bien que les commentaires sont accessible directement via l'objet _$scope.post_ mais je garde la séparation qui 
> me sera utile quand j'utiliserais Ajax.

```html
<h2>{{post.title}}</h2>

<section>
    <small>Le <time>{{post.date | date:'dd MMMM yyyy'}}</time> par <strong>{{post.author}}</strong></small>
    <p>{{post.text}}</p>
</section>

<section id="comments">
    <h2>Commentaires</h2>
    <article ng-repeat="comment in comments">
        <h4>{{comment.subject}}</h4>
        <small>Le <time>{{comment.date | date:'dd MMMM yyyy'}}</time> par <strong>{{comment.author}}</strong></small>
        <p>{{comment.text}}</p>
    </article>
</section>
```

## 5- Formulaire de saisie de commentaire

```html
<h2>{{post.title}}</h2>

<section>
    <small>Le <time>{{post.date | date:'dd MMMM yyyy'}}</time> par <strong>{{post.author}}</strong></small>
    <p>{{post.text}}</p>
</section>

<section id="comments">
    <h2>Commentaires</h2>
    <article ng-repeat="comment in comments">
        <h4>{{comment.subject}}</h4>
        <small>Le <time>{{comment.date | date:'dd MMMM yyyy'}}</time> par <strong>{{comment.author}}</strong></small>
        <p>{{comment.text}}</p>
    </article>

    <form>
        <fieldset>
            <legend>Ajouter un commentaire</legend>

            <div ng-show="httpError">
                Une erreur est survenue lors de la sauvegarde du commentaire
            </div>

            <label>Nom *</label>
            <input type="text" ng-model="comment.name" required /><br />

            <label>Objet *</label>
            <input type="text" ng-model="comment.subject" required /><br/>

            <label>Commentaire *</label>
            <textarea rows="8" ng-model="comment.text" required /><br />

            <button type="submit" ng-click="sendComment()">Envoyer</button>
       </fieldset>
    </form>
</section>
```

- ng-show
- ng-model
- ng-click

```js
/**
 *
 */
var showController = function($routeParams, $scope) {

    $scope.postCode = $routeParams.code;
    $scope.post     = getPostByCode($scope.postCode);
    $scope.comments = $scope.post.comments;

    $scope.httpError = false;
    $scope.sendComment = function() {
        $scope.comments.push({
            date   : new Date(2013, 1, 25), 
            author : $scope.comment.name, 
            subject: $scope.comment.subject,
            text   : $scope.comment.text
        });

        $scope.post.nbComments++;
    }
}
```

# 2- Twitter bootstrap

Twitter Bootstrap est un framework CSS/HTML développé par Twitter, permettant d'obtenir très rapidement un design moderne. Ce Framework permet donc un gain de temps dans la phase d'intégration de votre application, de votre site web classique ou mobile.

Parmi ses fonctionnalités, outre celles de base fournies par de nombreux frameworks CSS (grille, composants HTML...), Twitter Bootstrap contient un ensemble de composants facilement modifiables tels que :
Gestion des menus
Gestion des boutons
Pack d'icônes modernes
Gestion de Slider
Gestion de popup et autres modales...

## 1- Configuration Twitter bootstrap

Quand vous téléchargez la librairie vous obtenez un fichier zippé contenant un répertoire bootstrap avec 3 sous-répertoires contenant quelques fichiers :

* css
* img
* js

Pour que bootstrap fonctionne Il faut ensuite déclarer au minimum le fichier bootstrap.min.css (ou bootstrap.css) dans l'en-tête de la page web :

```html
<!doctype html>
<html lang="fr" ng-app="blog">
<head>
    <meta charset="utf-8" />
    <title>Blog</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="assets/libs/bootstrap/css/bootstrap.css" />
    <link rel="stylesheet" href="assets/css/style.css" />
</head>
<body>
    <header class="navbar navbar-inverse navbar-fixed-top">
        <div class="navbar-inner">
            <div class="container">
                <a class="brand" href="#/">Mon blog avec AngularJS</a>
            </div>
        </div>
    </header>

    <div class="container">
        <div ng-view></div>
    </div>

    <script src="assets/libs/jquery/jquery-1.9.1.js"></script>
    <script src="assets/libs/angular/angular.js"></script>
    <script src="assets/libs/angular/i18n/angular-locale_fr-fr.js"></script>
    <script src="assets/js/db.blog.js"></script>
    <script src="assets/js/blog.js"></script>
</body>
</html>
```

- navigation bar
- container

## 2- Styling avec Twitter bootstrap

```html
<h2>Liste des articles</h2>

<section id="posts">
    <article ng-repeat="post in posts">
        <h3><a ng-href="#/post/{{post.code}}">{{post.title}}</a></h3>
        <small>Le <time>{{post.date | date:'dd MMMM yyyy'}}</time> par <strong>{{post.author}}</strong></small>
        <p>{{post.text}}</p>
        <small>Il y a <span class="badge badge-info">{{post.nbComments}}</span> commentaires sur ce post, <a ng-href="#/post/{{post.code}}">Lire la suite</a></small>
    </article>
</section>
```

badge

```html
<h2>{{post.title}}</h2>

<section>
    <small>Le <time class="label label-important">{{post.date | date:'dd MMMM yyyy'}}</time> par <strong>{{post.author}}</strong></small>
    <p>{{post.text}}</p>
</section>

<section id="comments">
    <h2>Commentaires</h2>
    <article ng-repeat="comment in comments">
        <h4>{{comment.subject}}</h4>
        <small>Le <time>{{comment.date | date:'dd MMMM yyyy'}}</time> par <strong>{{comment.author}}</strong></small>
        <p>{{comment.text}}</p>
    </article>

    <form class="form-horizontal">
        <fieldset>
            <legend>Ajouter un commentaire</legend>

            <div class="alert alert-error" ng-show="httpError">
                Une erreur est survenue lors de la sauvegarde du commentaire
            </div>

            <div class="control-group">
                <label class="control-label">Nom *</label>
                <div class="controls">
                    <input type="text" ng-model="comment.name" required />
                </div>
            </div>
            <div class="control-group">
                <label class="control-label">Objet *</label>
                <div class="controls">
                    <input type="text" ng-model="comment.label" required />
                </div>
            </div>
            <div class="control-group">
                <label class="control-label">Commentaire *</label>
                <div class="controls">
                    <textarea rows="8" ng-model="comment.text" required />
                </div>
            </div>
            <div class="control-group">
                <div class="controls">
                    <button type="submit" ng-click="sendComment()">Envoyer</button>
                </div>
            </div>
        </fieldset>
    </form>

</section>
```
- label
- alert
- form-horizontal, control-group, control-label, controls

Costom style

```css
body {
    // Ceci est une recommendation bootstrap: Quand vous utilisez .navbar-fixed-top il ne faut pas oublier d'ajouter 
    // au moins 40px de padding-top au body
    margin-top: 50px;
}

h2 {
    font-size: 28px;
    font-weight: normal;
    text-transform: uppercase;
    margin: 30px 0;
}

h3 {
    font-size: 22px;
    font-weight: normal;
}

#posts article {
    margin-bottom: 40px;
}

#posts article h3 {
    margin-bottom: 0;
}

#comments article {
    margin: 0 50px 50px 40px;
}
```

# 3- Vert.x
## 1- Installation de Vert.x

Getting a distro

The easiest way to get hold of a distribution is to download a binary distro. Alternatively you can build from source. To do that see the instructions on thegithub wiki.
Pre-requisites

Operating System. Vert.x runs out of the box on Linux, OSX or Windows.
JDK. Vert.x requires JDK 1.7.0 or later. You can use the official Oracle distribution or the OpenJDK version. Make sure the JDK bin directory is on your PATH.
JRuby. If you want to use Ruby with Vert.x you will need to have installed JRuby and have the JRUBY_HOME environment variable pointing at the base of your JRuby installation. You will also need to install the json Ruby Gem since this is used in Vert.x. You can do this by running jruby -S gem install json. If you're not using Ruby in Vert.x you don't need any of this.
Jython. If you want to use Python with Vert.x you will need to have installed Jython and have the JYTHON_HOME environment variable pointing at the base of your Jython installation. If you're not using Jython in Vert.x you don't need any of this.
Install vert.x

Once you've got the pre-requisites installed, you install vert.x as follows:
Unzip the distro somewhere sensible (e.g. your home directory)
Add the vert.x bin directory to your PATH.
Check the version

To make sure you've installed it correctly, open another console and type:
tim@Ethel:~/example$ vertx version
vert.x 1.3.1.final
You should see output something like the above.

## 2- Serveur web Vert.x en javascript

- load
- logger
- createHttpServer
- requestHandler
- request
- request.response.end

```js
load('vertx.js');

// Constants
var PORT = 9080;

// Logger
var logger = vertx.logger;

// Création d'un serveur HTTP
vertx.createHttpServer().requestHandler(function(request) {
    logger.info('Traitement de la requête : ' + request.path);
}).listen(PORT);
logger.info('Serveur démarré sur le port ' + PORT);
```

## 3- Servir les fichiers statiques

- request.path.indexOf
- request.response.sendFile

```js
load('vertx.js');

// Constants
var PORT = 9080;
var WEBAPP = 'webapp/';

// Logger
var logger = vertx.logger;

// Création d'un serveur HTTP
vertx.createHttpServer().requestHandler(function(request) {
    logger.info('Traitement de la requête : ' + request.path);

    // Assets/* et Partials/*
    if ((request.path.indexOf('/assets') == 0)
        || (request.path.indexOf('/partials') == 0) {
        request.response.sendFile(WEBAPP + request.path);
    }
    // index.html
    else if (request.path === '/') {
        request.response.sendFile(WEBAPP + 'index.html');
    }
}).listen(PORT);
logger.info('Serveur démarré sur le port ' + PORT);
```

## 4- Liste des post en json

Angular ajax request

```js
/**
 *
 */
var listController = function($scope, $http) {
    $http.get('/ajax/posts.json').success(function(data) {
        $scope.posts = data;
    });
}
```

N'oubliez de supprimer la ligne <code><script src="assets/js/db.blog.js"></script></code> du fichier index.html

```js
var listOfPosts = [
];

var listOfComments = [
];
```

handle ajax requests
JSON.stringify
Module postService
getPosts

```js
// Service namespace
var Service = {

    getPosts: function() {
        return listOfPosts;
    }
};
```

```js
load('vertx.js');
load('blog.db.js');
load('blog.service.js');

// Constants
var PORT = 9080;
var WEBAPP = 'webapp/';

// Logger
var logger = vertx.logger;

// Création d'un serveur HTTP
vertx.createHttpServer().requestHandler(function(request) {
    logger.info('Traitement de la requête : ' + request.path);

// …

    // index.html
    else if (request.path === '/') {
        request.response.sendFile(WEBAPP + 'index.html');
    }

    // Requêtes ajax
    else if (request.path.indexOf('/ajax') == 0) {

        switch (request.path) {
            case '/ajax/posts.json':
                var posts = Service.getPosts();
                request.response.end(JSON.stringify(posts));
                break;

            default: // Requête inconnues
                request.response.statusCode = 404;
                request.response.end();
        }
    }
}).listen(PORT);
logger.info('Serveur démarré sur le port ' + PORT);
```

## 5- Détail du post en json

```js
/**
 *
 */
function detailPostController($scope, $routeParams, $http) {
    $scope.postCode = $routeParams.code;

    $http({url: '/ajax/post.json', method: "GET", params: {code: $scope.postCode}}).success(function(data) {
        $scope.post = data;
    });
}
```

- getPost
- request.params().code
- post sans comments

```js
// ...
var Service = {

    getPosts: function() {
// ...
    },

    getPost: function(code) {
        logger.info('Chargement du post ayant le code : ' + code);
            return {
                code  : 'vertx'    , 
                title : 'Vert.x'   , 
                date  : new Date(2013, 1, 25), 
                author: 'Abdelhakim Bachar', 
                text  : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu justo quam, gravida pharetra urna. Etiam lacinia massa quis nisi pharetra id iaculis arcu gravida. Phasellus a odio quam, sed tincidunt metus. Duis hendrerit sodales sapien eget cursus. Suspendisse potenti. Cras orci libero, luctus in sodales ac, sagittis eu lectus. Maecenas commodo libero non leo bibendum lobortis. Nunc tristique scelerisque ligula eget venenatis. Etiam sed ante nisl. Sed elit nunc, dictum vel convallis et, vulputate ac neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. '
        };
    }
};

// Création d'un serveur HTTP
vertx.createHttpServer().requestHandler(function(request) {
    logger.info('Traitement de la requête : ' + request.path);

// …

    // Requêtes ajax
    else if (request.path.indexOf('/ajax') == 0) {

        switch (request.path) {
            case '/ajax/posts.json':
                var posts = Service.getPosts();
                request.response.end(JSON.stringify(posts));
                break;

            case '/ajax/post.json':
                var post = Service.getPost(request.params().code);
                request.response.end(JSON.stringify(post));
                break;

            default: // Requête inconnues
                request.response.statusCode = 404;
                request.response.end();
        }
    }

// ...
```

## 6- Liste des commentaires en json

```js
/**
 *
 */
function detailPostController($scope, $routeParams, $http) {
    $scope.postCode = $routeParams.code;

    $http({url: '/ajax/post.json', method: "GET", params: {code: $scope.postCode}}).success(function(data) {
        $scope.post = data;
    });

    $http({url: '/ajax/comments.json', method: "GET", params: {code: $scope.postCode}}).success(function(data) {
        $scope.comments = data;
    });
}
```

```js
// ...
var Service = {

// ...

    getPost: function(code) {
// ...
    },

    getComments: function(code) {
        logger.info('Chargement des commentaire du post ayant le code : ' + code);
        return [
            {date: new Date(2013, 1, 25), author: 'Abdelhakim Bachar', subject: 'Lorem ipsum dolor sit amet', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu justo quam, gravida pharetra urna.'},
            {date: new Date(2013, 1, 26), author: 'Ilyas', subject: 'Vivamus eros neque', text: 'Vivamus eros neque, elementum non venenatis pharetra, volutpat et ante. Pellentesque et orci turpis, nec vulputate orci.'}
        ];
    }
};

// Création d'un serveur HTTP
vertx.createHttpServer().requestHandler(function(request) {
    logger.info('Traitement de la requête : ' + request.path);

// …

    // Requêtes ajax
    else if (request.path.indexOf('/ajax') == 0) {

        switch (request.path) {
            case '/ajax/posts.json':
                var posts = Service.getPosts();
                request.response.end(JSON.stringify(posts));
                break;

            case '/ajax/post.json':
                var post = Service.getPost(request.params().code);
                request.response.end(JSON.stringify(post));
                break;

            case '/ajax/comments.json':
                var comments = Service.getComments(request.params().code);
                request.response.end(JSON.stringify(comments));
                break;

            default: // Requête inconnues
                request.response.statusCode = 404;
                request.response.end();
        }
    }

// ...
```

## 7- Sauvegarde du commentaire

```js
/**
 *
 */
function detailPostController($scope, $routeParams, $http) {
    $scope.postCode = $routeParams.code;

    $http({url: '/ajax/post.json', method: "GET", params: {code: $scope.postCode}}).success(function(data) {
        $scope.post = data;
    });

    $http({url: '/ajax/comments.json', method: "GET", params: {code: $scope.postCode}}).success(function(data) {
        $scope.comments = data;
    });

    //
    $scope.httpError = false;
    $scope.sendComment = function() {
    $http.post('/ajax/save_comment.json', {code: $scope.postCode, comment: $scope.comment}).success(function(data) {
        // Cacher la ligne d'erreur
        $scope.httpError = false;
        // Vider le formulaire
        $scope.comment = {};
        // Ajout du commentaire à la liste des commantaire
        $scope.comments.push(data);
        }).error(function(data) {
            // Afficher la ligne d'erreur
            $scope.httpError = true;
        });
    }
}
```

request.dataHandler

```js
// ...
var Service = {

// ...

    getComments: function(code) {
// ...
    },

    saveComment: function(comment) {
        logger.info('Sauvegarde du commentaire : ' + JSON.stringify(comment));
    }
};

// Création d'un serveur HTTP
vertx.createHttpServer().requestHandler(function(request) {
    logger.info('Traitement de la requête : ' + request.path);

// …

    // Requêtes ajax
    else if (request.path.indexOf('/ajax') == 0) {

        switch (request.path) {
            case '/ajax/posts.json':
                var posts = Service.getPosts();
                request.response.end(JSON.stringify(posts));
                break;

            case '/ajax/post.json':
                var post = Service.getPost(request.params().code);
                request.response.end(JSON.stringify(post));
                break;

            case '/ajax/comments.json':
                var comments = Service.getComments(request.params().code);
                request.response.end(JSON.stringify(comments));
                break;

            case '/ajax/save_comment.json':
                // Le données du formulaire sont dans le body
                request.dataHandler(function(buffer) {
                    Service.saveComment(JSON.parse(buffer).comment);
                    request.response.end();
                });
                break;

            default: // Requête inconnues
                request.response.statusCode = 404;
                request.response.end();
        }
    }

// ...
```
# 4- Mongo DB
## 1- Installation de Mongo DB sur linux Ubuntu

Suivant la distribution sur laquelle vous tournez, deux solutons s'offrent à vous.
Passer par le gestionnaire de paquets
Télécharger le code source directement (plus pénible)
Si vous êtes sur Debian ou Ubuntu, tapez la série de commandes ci-dessous :
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10

Cette première commande ajoutera la clé publique de 10gen sur votre terminal vous permettant ainsi de récupérer les mises à jour. La deuxième commande ajoutera une entrée dans le fichier /etc/apt/sources.list pour préciser à Ubuntu où aller chercher les paquets de 10gen.
sudo echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" > /etc/apt/sources.list

Finalement, effectuez une recherche de paquets puis lancez l'installation.
sudo apt-get update
sudo apt-get install mongodb-10gen

Une fois l'installation faite, allez à la racine du disque dur et créez les répertoires /data/db et /data/logs à l'aide des commandes suivantes exécutées en tant que root.
sudo su
mkdir /data/db

Enfin, démarrez le serveur avec la commande mongod puis ouvrez un nouveau terminal avant de passer au chapitre suivant.
Pour ceux qui sont sur Fedora ou CentOS, ajoutez le bloc ci-dessous dans le fichier /etc/yum.repos.d/10gen.repo puis mettez à jour vos paquets et installez mongodb de la même façon que pour Ubuntu avec les commandes adéquates. Si vous avez une installation 64 bits :
[10gen]
name=10gen Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/x86_64
gpgcheck=0

Si vous êtes en 32 bits :
[10gen]
name=10gen Repository
baseurl=http://downloads-distro.mongodb.org/repo/redhat/os/i686
gpgcheck=0

Vous êtes maintenant prêts à utiliser MongoDB une fois que vous avez créé les repertoires /data/logs et /data/db..
Si votre distribution n'est pas mentionnée ci-dessus, vous trouverez les informations pour utiliser directement le code source sur la documentation officielle de MongoDB.



## 2- Shell de requêtes


## 3- Création de la BD


## 4- Récupération de la liste de posts

```js
vertx.mongopersistor
vertx.deployModule
vertx.eventBus
eb.send & callback
mongodb : find in mongodb shell and vertx

load('vertx.js');

// Constants
var PORT   = 9080;
var WEBAPP = 'webapp/';

// Vert.x event bus
var eb = vertx.eventBus;
// Mongo DB persistor address
var pa = 'vertx.mongopersistor';

// Logger
var logger = vertx.logger;

// Service namespace
var Service = {

    getPosts: function(handler) { // TODO Construire la liste des posts dans le service
        eb.send(pa, {action: 'find', collection: 'posts', matcher: {}, sort: {title: 1}}, function(reply) {
            handler(reply);
        });
    },

    getPost: function(code) {
// …
};

// Start a MongoDB persistor module
vertx.deployModule('vertx.mongo-persistor-v1.2', {
    'address': pa,
    'host'   : 'localhost',
    'port'   : 27017,
    'db_name': 'blog_db'
});

// Création d'un serveur HTTP
vertx.createHttpServer().requestHandler(function(request) {
// ...
        switch (request.path) {
            case '/ajax/posts.json':
                Service.getPosts(function(reply) {
                    var posts    = reply.results;
                    var response = new Array();

                    for (var i = 0; i < posts.length; i++) {
                        response[i] = {
                            code      : posts[i].code,
                            title     : posts[i].title,
                            date      : posts[i].date.$date,
                            author    : posts[i].author,
                            nbComments: posts[i].comments.length,
                            text      : posts[i].text.substr(0, 120) + (posts[i].text.length > 120 ? '...' : '')
                        }
                    }
                    request.response.end(JSON.stringify(response));
                });
                break;

            case '/ajax/post.json':
// ...
```

## 5- Récupération d'un post par code-post

mongodb : findone in mongodb shell and vertx

```js
// ...

    getPost: function(code, handler) { // TODO Construire le post dans le service

        eb.send(pa, {action: 'findone', collection: 'posts', matcher: {code: code}}, function(reply) {
            handler(reply);
        });
    },
// ...
            case '/ajax/post.json':
                Service.getPost(request.params().code, function(reply) {
                    var post     = reply.result;
                    var response = {
                        code  : post.code,
                        title : post.title,
                        date  : post.date.$date,
                        author: post.author,
                        text  : post.text
                    };
                    request.response.end(JSON.stringify(response));
                });
                break;
// ...
```

## 6- Récupération de la liste des commentaires

```js
// ...

    getComments: function(code, handler) { TODO Construire la liste des com dans le srv
        eb.send(pa, {action: 'findone', collection: 'posts', matcher: {code: code}}, function(reply) {
            handler(reply);
        });
    },
// ...
            case '/ajax/comments.json':
                Service.getComments(request.params().code, function(reply) {
                    var comments = reply.result.comments;
                    var response = new Array();
                    for (var i = 0; i < comments.length; i++) {
                        response[i] = {
                            author  : comments[i].author,
                            subject : comments[i].subject,
                            text    : comments[i].text
                        }
                    }
                    request.response.end(JSON.stringify(response));
                });
                break;
// ...
```

## 7- Sauvegarde d'un commentaire

mongodb : update in mongodb shell and vertx

```js
// ...

    saveComment: function(code, comment, handler) {
        comment.date = new Date();
        logger.info('Sauvegarde du commentaire : ' + JSON.stringify(comment));
        eb.send(pa, {action: 'update', collection: 'posts', criteria: {code: code}, objNew: {$push: {comments: comment}} /*, upsert: false, multi: false */}, function(reply) {
            handler(reply);
        });
    }
// ...
            case '/ajax/save_comment.json':
                // Le données du formulaire sont dans le body
                Service.saveComment(data.code, data.comment, function(comment) {
                    request.response.end(JSON.stringify(comment));
                });
                break;
// ...
```