$(function(){
  var canvas = new fabric.Canvas('canvas');
  fabric.Image.fromURL('../assets/background-canvas.png', function(img) {
    canvas.add(img);
  });

  function readURL(input,el) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        el.attr('src', e.target.result);
        var imgElement = document.getElementById('img-load');
        console.log(imgElement);
        var imgInstance = new fabric.Image(imgElement, {
          left: 0,
          top: 0,
          angle: 0,
          opacity: 1
        });
        canvas.add(imgInstance);
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
