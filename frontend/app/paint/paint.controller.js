function PaintController(fileUploadService) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.setOptions = setOptions;
    vm.setCanvas= setCanvas;
    vm.undo=undo;
    vm.redo=redo;
    vm.clear = clear;
    vm.ChangeLineWidth=ChangeLineWidth;
    vm.changeBrushColor = changeBrushColor;
    vm.undoCacheEmpty=undoCacheEmpty;
    vm.redoCacheEmpty=redoCacheEmpty;
    vm.add=add;
    vm.downloadImage = downloadImage;
    vm.saveImage = saveImage;
    vm.getImage = getImage;
    vm.undoCache = [];
    vm.redoCache = [];
    var isTouch = !!('ontouchstart' in window);
    var PAINT_START = isTouch ? 'touchstart' : 'mousedown';
    var PAINT_MOVE = isTouch ? 'touchmove' : 'mousemove';
    var PAINT_END = isTouch ? 'touchend' : 'mouseup';
    function $onInit() {
        vm.options={};
        vm.setOptions();
    }


    function setOptions(){
        vm.options.width = 1080;
        vm.options.height = 600;
        vm.options.backgroundColor = '#fff';
        vm.options.color ='#000';
        vm.options.opacity = 0.9;
        vm.options.lineWidth = 10;
        vm.setCanvas();
    }

    function setCanvas(){
        vm.canvas = document.getElementById('CanvasMain');
        vm.canvasTmp = document.getElementById('CanvasTmp');
        vm.ctx = vm.canvas.getContext('2d');
        vm.ctxTmp = vm.canvasTmp.getContext('2d');

        vm.point = {
            x: 0,
            y: 0
        };
        vm.ppts = [];
        //set canvas size
        vm.canvas.width = vm.canvasTmp.width = vm.options.width;
        vm.canvas.height = vm.canvasTmp.height = vm.options.height;

        //set context style
        vm.ctx.fillStyle = vm.options.backgroundColor;
        vm.ctx.fillRect(0, 0, vm.canvas.width, vm.canvas.height);
        vm.ctxTmp.globalAlpha = vm.options.opacity;
        vm.ctxTmp.lineJoin = vm.ctxTmp.lineCap = 'round';
        vm.ctxTmp.lineWidth = vm.options.lineWidth;
        vm.ctxTmp.strokeStyle = vm.options.color;
        vm.getImage();
        vm.undoCache.push(vm.ctx.getImageData(0, 0, vm.canvasTmp.width, vm.canvasTmp.height));

        initListeners();
    }

     function initListeners() {
        vm.canvasTmp.addEventListener(PAINT_START, StartTmpImage, false);
        vm.canvasTmp.addEventListener(PAINT_END, copyTmpImage, false);

        if (!isTouch) {
            var MOUSE_DOWN;

            document.body.addEventListener('mousedown', mousedown);
            document.body.addEventListener('mouseup', mouseup);
            vm.canvasTmp.addEventListener('mouseenter', mouseenter);
            vm.canvasTmp.addEventListener('mouseleave', mouseleave);
        }

        function mousedown() {
            MOUSE_DOWN = true;
        }

        function mouseup() {
            MOUSE_DOWN = false;
        }

         function mouseenter(e) {
             if (MOUSE_DOWN) {
                 StartTmpImage(e);
             }
         }

         function mouseleave(e) {
             if (MOUSE_DOWN) {
                 copyTmpImage(e);
             }
         }

    }


    function StartTmpImage(e) {
        e.preventDefault();
        vm.canvasTmp.addEventListener(PAINT_MOVE, paint, false);

        setPointFromEvent(vm.point, e);
        vm.ppts.push({
            x: vm.point.x,
            y: vm.point.y
        });
        vm.ppts.push({
            x: vm.point.x,
            y: vm.point.y
        });

        paint();
    }

    function copyTmpImage() {
        vm.redoCache = [];
        vm.canvasTmp.removeEventListener(PAINT_MOVE, paint, false);
        vm.ctx.drawImage(vm.canvasTmp, 0, 0);
        vm.ctxTmp.clearRect(0, 0, vm.canvasTmp.width, vm.canvasTmp.height);
        vm.ppts = [];
        vm.undoCache.push(vm.ctx.getImageData(0, 0, vm.canvasTmp.width, vm.canvasTmp.height));
    }



    function paint(e) {
        if (e) {
            e.preventDefault();
            setPointFromEvent(vm.point, e);
        }

        // Saving all the points in an array
        vm.ppts.push({
            x: vm.point.x,
            y: vm.point.y
        });
        // Tmp canvas is always cleared up before drawing.
        vm.ctxTmp.clearRect(0, 0, vm.canvasTmp.width, vm.canvasTmp.height);
        vm.ctxTmp.beginPath();
        vm.ctxTmp.moveTo(vm.ppts[0].x, vm.ppts[0].y);

        for (var i = 1; i < vm.ppts.length - 2; i++) {
            var c = (vm.ppts[i].x + vm.ppts[i + 1].x) / 2;
            var d = (vm.ppts[i].y + vm.ppts[i + 1].y) / 2;
            vm.ctxTmp.quadraticCurveTo(vm.ppts[i].x, vm.ppts[i].y, c, d);
        }

        // For the last 2 points
        vm.ctxTmp.quadraticCurveTo(
            vm.ppts[i].x,
            vm.ppts[i].y,
            vm.ppts[i + 1].x,
            vm.ppts[i + 1].y
        );
        vm.ctxTmp.stroke();
    }

    function setPointFromEvent(point, e) {
        if (isTouch) {
            point.x = e.changedTouches[0].pageX - getOffset(e.target).left;
            point.y = e.changedTouches[0].pageY - getOffset(e.target).top;
        } else {
            point.x = e.offsetX !== undefined ? e.offsetX : e.layerX;
            point.y = e.offsetY !== undefined ? e.offsetY : e.layerY;
        }
    }


    function undo(){
        if (vm.undoCache.length > 1) {
            vm.redoCache.push(vm.undoCache.pop());
            vm.ctx.putImageData(vm.undoCache[vm.undoCache.length-1],0,0);
        }

    }

    function redo(){
        if(vm.redoCache.length>0){
            vm.undoCache.push(vm.redoCache.pop());
            vm.ctx.putImageData(vm.undoCache[vm.undoCache.length-1],0,0);
        }
    }

    function clear(){
        vm.redoCache = [];
        var b = vm.undoCache[0];
        vm.undoCache = [b];
        vm.ctx.putImageData(vm.undoCache[vm.undoCache.length-1],0,0);
    }

    function ChangeLineWidth(number){
        vm.ctxTmp.lineWidth = number;
    }

    function changeBrushColor(value){
        vm.ctxTmp.strokeStyle = value;
    }

    function undoCacheEmpty(){
        return vm.undoCache.length < 2;
    }

    function redoCacheEmpty(){
        return vm.redoCache.length < 1;
    }

    function add(){
        var f = document.getElementById('file').files[0];
        var r = new FileReader();
        r.onload = function(e){
            var image = new Image();
            image.onload = function(){
                var hRatio = vm.canvas.width / image.width    ;
                var vRatio = vm.canvas.height / image.height  ;
                var ratio  = Math.min ( hRatio, vRatio );
                var centerShift_x = ( vm.canvas.width - image.width*ratio ) / 2;
                var centerShift_y = ( vm.canvas.height - image.height*ratio ) / 2;
                vm.ctxTmp.drawImage(image, 0,0, image.width, image.height, centerShift_x,centerShift_y,image.width*ratio, image.height*ratio);
                copyTmpImage();
            };
            image.src = e.target.result;
        };
        r.readAsDataURL(f);

    }


    function downloadImage(){
         var image =  vm.canvas.toDataURL();
        var imageElement = document.getElementById('download');
        imageElement.href = image;
        imageElement.download = 'image.jpeg';

    }

    function saveImage(){
        var dataURL = vm.canvas.toDataURL();
        var blob = dataURItoBlob(dataURL);
        var fd = new FormData(document.forms[0]);
        fd.append("canvasImage",blob);
        return fileUploadService.saveData(fd)
            .then(function test(){
                alert("saved image successfully")
            });
    }


    function dataURItoBlob(dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    }

    function getImage(){
        var image = new Image();
        image.onload = function(){
            vm.ctx.drawImage(image, 0,0);
            copyTmpImage();
        };
        image.src = 'http://localhost:8080/api/image/download';
        image.crossOrigin = "Anonymous";
    }


}
