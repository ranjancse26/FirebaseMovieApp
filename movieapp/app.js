// Based on https://moviefire.firebaseapp.com/ngFire/app.html

var movieFire = angular.module("MovieFire", ["firebase"]);

movieFire.factory('MovieFactory', function($firebase){
    var movieCRUDOperations = 
    {
        saveToList : function(name, favMovies) {
            var mvName = name;
            if (mvName.length > 0) {
                favMovies.$add({
                    name: mvName
                });
            }
        },
        edit : function(index, key, name) {
            var newName = prompt("Update the movie name", name); // to keep things simple and old skool :D
            if (newName && newName.length > 0) {
                var updateMovieRef = movieCRUDOperations.buildEndPoint(key, $firebase);
                updateMovieRef.$set({
                    name: newName
                });
            }
        },
        del : function(index, key, name) {
            var response = confirm("Are certain about removing \"" + name + "\" from the list?");
            if (response == true) {
                var deleteMovieRef = movieCRUDOperations.buildEndPoint(key, $firebase);
                deleteMovieRef.$remove();
            }
        },
        buildEndPoint : function(key, $firebase) {
            return $firebase(new Firebase('https://moviefire.firebaseio.com/movies/' + key));
        }

    }
    return movieCRUDOperations;
});

function MovieController($scope, $firebase, MovieFactory) {
    $scope.favMovies = $firebase(new Firebase('https://moviefire.firebaseio.com/movies'));
    $scope.movies = [];
    
    $scope.favMovies.$on('value', function() {
        $scope.movies = [];
        var mvs = $scope.favMovies.$getIndex();
        for (var i = 0; i < mvs.length; i++) {
            $scope.movies.push({
                name: $scope.favMovies[mvs[i]].name,
                key: mvs[i]
            });
        };
    });

    $scope.saveToList = function(event){
        if (event.which == 13 || event.keyCode == 13) {
            MovieFactory.saveToList($scope.mvName, $scope.favMovies);
            movieName.value = ''; //movieName is the ID of  input box - Angular rocks!
        }
    }

    $scope.edit = function(index){
        MovieFactory.edit(index, $scope.movies[index].key, $scope.movies[index].name);
    }

    $scope.delete = function(index){
        MovieFactory.del(index, $scope.movies[index].key, $scope.movies[index].name);
    }
}
