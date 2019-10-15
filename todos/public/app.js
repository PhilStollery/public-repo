var todoy = angular.module('todos', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // get all todos and show them
    $http.get('api/todos')
        .success(function(data) {
            $scope.todos = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // send the text to the node API
    $scope.createTodo = function() {
        $http.post('api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; 
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo
    $scope.deleteTodo = function(id, task) {
        console.log('Delete: api/todos/' + id +'/' + task);        
        $http.delete('api/todos/' + id +'/' + task)
            .success(function(data) {
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}