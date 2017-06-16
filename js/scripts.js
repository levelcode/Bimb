$(function(){

  function canvasFixSize() {
    $(".canvas").height($(".canvas").width());
  }

  $(window).on('resize', function(event) {
    canvasFixSize();
  });

  var canvas = new fabric.Canvas('canvas',{
        preserveObjectStacking: false
    });

  canvas.setOverlayImage('../assets/background-canvas.png', canvas.renderAll.bind(canvas), {
    originX: 'left',
    originY: 'top',
    left: 0,
    top: 0,
    zindex: 999
   });


  function readURL(input,el) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        el.attr('src', e.target.result);

        setTimeout(function () {
          var imgElement = document.getElementById('img-load');
          var imgInstance = new fabric.Image(imgElement, {
            left: 0,
            top: 0,
            angle: 0,
            opacity: 1
          });
          canvas.add(imgInstance);
          canvas.moveTo(imgInstance, -9999);

        },100);

      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  $(".btnc input.file").on('change',function(event) {

    if( typeof this.files[0] != 'undefined' ){
      var f = this.files[0];
      readURL(this,$(this).siblings('img'));
    }
  });

  $(".btnc input.file").hover(function() {
      $(this).next().addClass('hover');
  }, function() {
    $(this).next().removeClass('hover');
  });



});
