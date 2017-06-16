$(function(){
  var canvas = new fabric.Canvas('backgroundCanvas');
  fabric.Image.fromURL('../assets/background-canvas.png', function(img) {
    canvas.add(img);
  });

  function readURL(input,el) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        el.attr('src', e.target.result);

        setTimeout(function () {
          var canvas = new fabric.Canvas('photoCanvas');
          var imgElement = document.getElementById('img-load');
          var imgInstance = new fabric.Image(imgElement, {
            left: 1,
            top: 1,
            angle: 10,
            opacity: 1
          });
          canvas.add(imgInstance);
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



});
