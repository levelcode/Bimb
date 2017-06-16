$(function(){

  var text = 0;
  var texts = [
    '../assets/texts/f1.png',
    '../assets/texts/f2.png',
    '../assets/texts/f3.png',
    '../assets/texts/f4.png',
  ];
  var instance;
  function ChangeText() {
    var img = new Image();
    img.src = texts[text];
    img.onload = function () {
      var w = img.width;
      var l = ( $(".canvas").width() - w ) / 2;
      var center = canvas.getCenter();
      canvas.setOverlayImage(texts[text], canvas.renderAll.bind(canvas), {
        top: 30,
        left: center.left,
        originX: 'center',
        originY: 'top'
       });
       img = {};
    }
    text++;
    if( text == 4 ){
      text = 0;
    }
  }

  function canvasFixSize() {
    $(".canvas").height($(".canvas").width());
  }

  canvasFixSize();

  var canvas = new fabric.Canvas('canvas',{
        preserveObjectStacking: true,
        selection : false,
    });

  fabric.Image.fromURL('../assets/background-canvas.png', function (img) {
    canvas.add(img);
    canvas.moveTo(img, 9999);
  },{
    left: 0,
    top: 0,
    angle: 0,
    opacity: 1,
    lockMovementX: true,
    lockMovementY: true,
    hasBorders: false,
    hasControls: false,
    evented: false,
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
            opacity: 1,
          });
          canvas.add(imgInstance);
          canvas.moveTo(imgInstance, -9999);
        },100);

      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  $(".photo .canvas .canvas-container").on('click', function(event) {
    ChangeText();
  });

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

  $(window).on('resize', function(event) {
    canvasFixSize();
  });

  ChangeText();


});
