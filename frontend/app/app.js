angular.module('app', ['ngRoute'])
    .factory('fileUploadService',fileUploadService)
    .component('paint', {
        templateUrl: 'app/paint/paint.html',
        controller: PaintController,
        controllerAs: 'vm'
    })
    .config(appConfig)
    .run(run);

function run(){


    window.onbeforeunload = function Uday(){
        return "message";
    }


}