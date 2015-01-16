## Les directives
- Les directives sont des composants HTML réutilisables qui servent:
 - à la manipulation de DOM
 - à « binder » des évènements et définir leurs action
- Chaque directive à un nom
- La directive se declare avec la methode directive:

```
    angular.module('app').directive('nomDeLaDirective', function() {
    });
 ```
 - Dans l'exemple:
  - La directive se nomme nomDeLaDirective (en camelCase)
  - Recommandation: Utiliser un préfixe pour identifier vos directives
  - Elle peut etre utiliser dans la vue sous les formes:
   - nom-de-la-directive
   - nom: de:la:directive
   - data-nom-de-la-directive
   - x-nom-de-la-directive

### Cycle de vie
- Chaque directive subit un cycle quand Angular Compile et link le DOM
- Le cycle de vie des directives commence et finit dans le process demarrage d'Angular et avant l'affichage de la page
- Il y a plusieurs options qu'on peut configurer
- La relation entre ces options et très importante
- Il y a 4 fonctions qui peuvent etre executé (Si ils sont definis) pendant le cycle de vie de la directive
- Les quatres fonctios sont: compile, controller, pre-link and post-link.
- Chaque fonction permet de modifier la directive à tout moment du cycle de vie
- Exemple de declaration d'un directive avec les quatres fonctions

```
angular.module('app').directive("nomDeLaDirective",function () {
    return {
        controller: function() { /* Code du contrôleur */ },
        compile: {
            /* Code compile */
            return {
                pre: function() { /* Code pre-link */ },
                post: function() { /* Code post-link */ }
            };
        }
    }
})
```

### compile
- Permet à la directive de manipuler le DOM avant d'être compilé et lié
 - ajouter / supprimer / modifier les directives
 - ajouter / supprimer / modifier d'autres éléments DOM

### link
- pre-link: ???
- post-link:  ???
- En regle génerale pas toutes les methodes sont nécessaires
- Dans la plupart des cas on crée le contrôleur et post-link.

```
angular.module('app').directive("nomDeLaDirective",function () {
	return {
		controller: function() { /* Code du contrôleur */ },
		link: function() { /* Code du post-link */ }
	}
})
```

Dans cette configuration le link fait reference à la methode post-link
### scope
- Toutes les directives ont un scope qui leur est associé
- Ils utilisent le scope pour accéder aux données / méthodes à l'intérieur du template ou de la méthode link
- Par défaut les directive ne créent pas leur propre scope, ils iutilisent celui de leurs parents (Il faut le définir explicitement)
- Les valeurs possible du scope
 - false: la directuve utilise le scope du parent
 - true: la directive crée un nouveau scope hérité ~~prototypiquement~~ du scope de son parent
 - {}: la directive crée un nouveau scope isolé

### controller
- Expose l'API à d'autres directives

## Transclusion
- La transclusion est permet d'inserer du contenu HTML dans la template de la directive.
- Des fois on veux passer tout un contenue à la directive et pas seulement un string ou un objet.
- Exemple: *dialog* avec un contenu arbitraire.
- Il faut utiliser l'attribut transclude du DDO (directive definition object)

```
angular.module('docsTransclusionDirective', [])
    .controller('Controller', ['$scope', function($scope) {
        $scope.name = 'Tobias';
    }])
    .directive('myDialog', function() {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: '<div class="alert" ng-transclude></div>'
        };
    });
```
```
<div ng-controller="Controller">
    <my-dialog>Check out the contents, {{name}}!</my-dialog>
</div>
```

- Transclude permet au contenu transcluder d'acceder au scope parent de la directive et non pas au scope de la directive
- http://blog.xebia.fr/2013/11/20/liberer-le-potentiel-des-directives-angularjs/

### La transclusion manuelle
- Prenant l'exemple d'un bar de button ou les boutons primary sont à droite et les secondary sont à gauche.
- Il faut transclude les boutons à différents endroits
- Ceci n'est pas faisable avec un simple ng-transclude
- Il faut:
 - utiliser la transclusion par défaut (ng-transclude)
 - A la main: déplacer les buttons à gauche ou à droite
 - Supprimer le contenu transcluder par défaut

```
<div ng-controller="parentController">    
    <button-bar>
        <button class="primary" ng-click="onPrimary1Click()">{{primary1Label}}</button>
        <button class="primary">Primary2</button>
        <button class="secondary">Secondary1</button>
    </button-bar>
</div>
```
```
var testapp = angular.module('testapp', []);

testapp.controller('parentController', ['$scope', '$window',function($scope, $window) {
    $scope.primary1Label = 'Prime1';
    $scope.onPrimary1Click = function() {
        $window.alert('Primary 1 clicked');
    }        
}]);

testapp.directive('primary', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            element.addClass('btn btn-primary');
        }
    }
});
    
testapp.directive('secondary', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            element.addClass('btn');
        }
    }
});    

testapp.directive('buttonBar', function() {
    return {
        restrict: 'EA',
        template: '<div class="span4 well clearfix"><div class="primary-block pull-right"></div><div class="secondary-block"></div><div class="transcluded" ng-transclude></div></div>',
        replace: true,
        transclude: true,
        link: function(scope, element, attrs) {
            var primaryBlock = element.find('div.primary-block');
            var secondaryBlock = element.find('div.secondary-block');
            var transcludedBlock = element.find('div.transcluded');
            var transcludedButtons = transcludedBlock.children().filter(':button');
            angular.forEach(transcludedButtons, function(elem) {
                if (angular.element(elem).hasClass('primary')) {
                    primaryBlock.append(elem);
                } else if (angular.element(elem).hasClass('secondary')) {
                    secondaryBlock.append(elem);
                }
            });
            transcludedBlock.remove();
        }
    };
});
```

### Transcluder à la compilation (Deprecated)
- On peut passer la fonction de transclusion à la fonction compile mais c'est obsolète
 - Car: à la compilation le scope n'est pas encore disponible
- Il faut utiliser la fonction de transclusion dans le scope

### Transcluder au link

```
<div ng-controller="parentController">    
    <button-bar>
        <button class="primary" ng-click="onPrimary1Click()">{{primary1Label}}</button>
        <button class="primary">Primary2</button>
        <button class="secondary">Secondary1</button>
    </button-bar>
</div>
```

```
var testapp = angular.module('testapp', []);

testapp.controller('parentController', ['$scope', '$window', function($scope, $window) {
    $scope.primary1Label = 'Prime1';
    
    $scope.onPrimary1Click = function() {
        $window.alert('Primary 1 clicked');                
    }
}]);

testapp.directive('primary', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            element.addClass('btn btn-primary');
        }
    }
});

testapp.directive('secondary', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            element.addClass('btn');
        }
    }
});

testapp.directive('buttonBar', function() {
    return {
        restrict: 'EA',
        template: '<div class="span4 well clearfix"><div class="primary-block pull-right"></div><div class="secondary-block"></div></div>',
        replace: true,
        transclude: true,
        link: function(scope, elem, attrs, ctrl, transcludeFn) {
            transcludeFn(scope, function(clone) {
                var primaryBlock = elem.find('div.primary-block');
                var secondaryBlock = elem.find('div.secondary-block');
                var transcludedButtons = clone.filter(':button'); 
                angular.forEach(transcludedButtons, function(e) {
                    if (angular.element(e).hasClass('primary')) {
                        primaryBlock.append(e);
                    } else if (angular.element(e).hasClass('secondary')) {
                        secondaryBlock.append(e);
                    }
                });
            });
        }
    };
});
```
### Injecter $transclude dans le contrôleur
- On peut injecter $transclude dans le contrôleur
- $transclude est un fonction de link pré-lié au bon scope

```
<div ng-controller="parentController">    
    <button-bar>
        <button class="primary" ng-click="onPrimary1Click()">{{primary1Label}}</button>
        <button class="primary">Primary2</button>
        <button class="secondary">Secondary1</button>
    </button-bar>
</div>
```

```
var testapp = angular.module('testapp', []);

testapp.controller('parentController', ['$scope', '$window', function($scope, $window) {
    $scope.onPrimary1Click = function() {
        alert('Primary1 clicked');    
    };
    $scope.primary1Label = "Prime1"
}]);

testapp.directive('primary', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            element.addClass('btn btn-primary');
        }
    }
});

testapp.directive('secondary', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            element.addClass('btn');
        }
    }
});

testapp.directive('buttonBar', function() {
    return {
        restrict: 'EA',
        template: '<div class="span4 well clearfix"><div class="primary-block pull-right"></div><div class="secondary-block"></div></div>',
        replace: true,
        transclude: true,
        scope: {},
        controller: ['$scope', '$element', '$transclude', function ($scope, $element, $transclude) {
            $transclude(function(clone) {
                var primaryBlock = $element.find('div.primary-block');
                var secondaryBlock = $element.find('div.secondary-block');
                var transcludedButtons = clone.filter(':button'); 
                angular.forEach(transcludedButtons, function(e) {
                    if (angular.element(e).hasClass('primary')) {
                        primaryBlock.append(e);
                    } else if (angular.element(e).hasClass('secondary')) {
                        secondaryBlock.append(e);
                    }
                });
            });
        }],
    };
});
```
### La transclusion et le scope
- Le scope isolé d'une directive et le scope du transclude hérite du même parent
- Un exemple:
 - Controleur parent crée un scope
 - La directive crée un scope isolé
 - transclude crée un autre scope

## Conclusion

