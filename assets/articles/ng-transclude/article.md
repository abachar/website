## Les directives
 (Introduction)

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
angular.module('app').directive("name",function () {
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
angular.module('app').directive("name",function () {
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
 - true: la directive crée un nouveau scope hérité **prototypiquement** du scope de son parent
 - {}: la directive crée un nouveau scope isolé

### controller
- Expose l'API à d'autres directives

## Transclusion

## La transclusion à plusieurs endroits

### Transcluder à la compilation (Deprecated)

### Transcluder au link

### Injecter $transclude dans le contrôleur

### La transclusion et le scope

## Conclusion


-------------------------------------------------

## Les directives

Les directives sont les modules qui servent à la manipulation de DOM, à « binder » des évènements et définir leurs actions. Elles se traduisent par des composants HTML qui vont être réutilisables.

Partons de son rôle dans une vue, il faut définir comment ce composant doit être utilisé :

1. est ce qu’il va prendre place dans la vue comme une balise HTML
2. est ce qu’il va enrichir une autre balise
3. quels paramètres il va accepter

Il faut aussi définir son nom. Une directive se crée avec la méthode de module directive :
```
	angular.module('app').directive('ma-directive', function() {
	});
 ```
 
Cette directive se nomme donc maDirective, et vous constatez que son nom est en camelCase. C’est cette forme qu’il faudra utiliser. Une recommandation est à prendre en compte ici : il faut définir un préfixe pour identifier vos directives. Ceci permet d’éviter les collisions entre des directives de même nom de différentes sources. Par exemple chez Synbioz une directive est préfixée de synbioz ou sz. La précédente directive se nommerait alors szMaDirective.

A savoir que les directives seront disponibles dans les vues sous plusieurs formes : sz-ma-directive, sz:ma:directive, data-sz-ma-directive et x-sz-ma-directive. AngularJS nous laisse invoquer nos directives sous ces différentes syntaxes pour être compatible avec plusieurs validateurs HTML.

Une fois ces étapes terminées, on peut attaquer le développement du cœur de la directive. Il n’y a pas de limitation, ce peut être une fonctionnalité entièrement créée par nos soins, mais il est aussi possible d’englober et d’enrichir des composants externes à AngularJS. Notez d’ailleurs que pour utiliser une fonctionnalité extérieure, il est préférable de l’englober dans une directive. Les erreurs pourront ainsi être interceptées et manipulées dans l’application. Dans le cas contraire les erreurs éventuelles seront tout simplement ignorées.

## Transclude

We've seen that you can pass in models to a directive using the isolate scope, but sometimes it's desirable to be able to pass in an entire template rather than a string or an object. Let's say that we want to create a "dialog box" component. The dialog box should be able to wrap any arbitrary content.

To do this, we need to use the transclude option.
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


	<div ng-controller="Controller">
	  <my-dialog>Check out the contents, {{name}}!</my-dialog>
	</div>
```
What does this transclude option do, exactly? transclude makes the contents of a directive with this option have access to the scope outside of the directive rather than inside.

http://blog.xebia.fr/2013/11/20/liberer-le-potentiel-des-directives-angularjs/
 
## Transclude at multiple locations

Lets say we would like to enhance our buttonBar directive to have two kinds of buttons - primary and secondary; with primary buttons right-aligned and secondary left-aligned. It would entail picking up the contents(buttons in our example) of the directive and adding them into two separate divs, one for primary buttons and the other for secondary buttons. Transclude into two different locations, if you will. The result should look something like this -

Well, that's not possible with the default mechanism. One approach to achieve this could be -

Allowing the default transclude in an element in the template.
Programmatically moving child elements(buttons) to appropriate div.
Finally, removing the original transcluded element from DOM in compile or link function of the directive.

```
<div ng-controller="parentController">    
    <button-bar>
        <button class="primary" ng-click="onPrimary1Click()">{{primary1Label}}</button>
        <button class="primary">Primary2</button>
        <button class="secondary">Secondary1</button>
    </button-bar>
</div>

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

### Transclude argument to compile function in a directive

The Angular developer guide for directive gives following signature for the compile function of a directive -

function compile(tElement, tAttrs, transclude) { ... }
And here is what it says about the third argument -

transclude - A transclude linking function: function(scope, cloneLinkingFn).
Alright, let's use this function to achieve what we achieved in the last example without the need to transclude into an element and then removing it from DOM.

```
<div ng-controller="parentController">    
    <button-bar>
        <button class="primary" ng-click="onPrimary1Click()">{{primary1Label}}</button>
        <button class="primary">Primary2</button>
        <button class="secondary">Secondary1</button>
    </button-bar>
</div>

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
        compile: function(elem, attrs, transcludeFn) {
            return function (scope, element, attrs) {
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
            };
        }
    };
});
```

Please note there is no scope available in compile function and you'll have to pass the element that compile function received as the first argument to the transclude function. You might want to use this approach if you are already using the compile function (which is quite rare, at least for me) and don't need to work with scope. Otherwise, the next approach of injecting $transclude into Controller is the best bet.

### Injecting $transclude in a Controller

The Angular developer guide for directive states the following for $transclude injectable for Controller -

$transclude - A transclude linking function pre-bound to the correct transclusion scope: function(cloneLinkingFn).

```
<div ng-controller="parentController">    
    <button-bar>
        <button class="primary" ng-click="onPrimary1Click()">{{primary1Label}}</button>
        <button class="primary">Primary2</button>
        <button class="secondary">Secondary1</button>
    </button-bar>
</div>

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

### Transclude and scope
The Angular developer guide for directive mentions that a directive isolated scope and transclude scope are siblings (frères et sœurs). Now, what does that mean? If you take a careful look at previous example, you'll notice that parentController creates a scope, the buttonBar directive declares an isolated scope under it and as mentioned in the Angular documentation, transclude creates yet another scope. I have added log statements at appropriate places in the directive to illustrate the relationship between these three scopes.
