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

  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }

  function canvasFixSize() {
    $(".canvas").height($(".canvas").width());
  }

  function getPhoto(id) {
    var w = $(".canvas").width();
    var imgProfile = "https://graph.facebook.com/" + id + "/picture?width="+w+"&height="+w;

    $('#img-load').attr("src",imgProfile);
    $('#img-load')[0].crossOrigin = "Anonymous";
    $('#img-load').on('load', function(event) {
      renderPhoto();
    });
  }

  function renderPhoto(){
    setTimeout(function () {
      if( typeof window.instanceImg != "undefined" ){
        canvas.remove(window.instanceImg);
      }
      var imgElement = document.getElementById('img-load');
      var imgInstance = new fabric.Image(imgElement, {
        left: 0,
        top: 0,
        angle: 0,
        opacity: 1,
        borderColor: 'rgba(2, 0, 100, 0.9)',
        cornerColor: 'rgba(2, 0, 100, 0.9)',
        transparentCorners: false
      });
      window.instanceImg = imgInstance;
      canvas.add(imgInstance).setActiveObject(imgInstance);
      canvas.moveTo(imgInstance, -9999);
    },100);
  }

  function readURL(input,el) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        el.attr('src', e.target.result);
        el[0].crossOrigin = "Anonymous";
        renderPhoto();
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '274662929667884',
      xfbml      : true,
      version    : 'v2.9'
    });
    FB.AppEvents.logPageView();

    FB.getLoginStatus(function(response) {
      if( response.status == 'connected' ){
        getPhoto(response.authResponse.userID);
      }
    });

  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  $(".btnc.profile-photo button").on('click', function(event) {
    FB.login(function(response) {
      if (response.authResponse) {
        FB.api('/me', function(response) {
          getPhoto(response.id);
        });
      }
    },{scope: 'publish_actions'});
  });


  $(".fb-btn.share button").on('click', function(event) {
    FB.ui({
      method: 'share_open_graph',
      action_type: 'og.shares',
      action_properties: JSON.stringify({
          object : {
             'og:url': "https://riseandshine.ga",
             'og:title': "Bimbo",
             'og:description': "Rise and Shine",
             'og:og:image:width': 543,
             'og:image:height': 543,
             'og:image': "https://riseandshine.ga/assets/logo.png"
          }
      })
    },function (response) {
      console.log(response);
    });
  });


  $(".fb-btn.publish button, .donwload button").on('click', function(event) {
    var w = $(".canvas").width();
    var authToken = FB.getAccessToken();
    var dataURL = canvas.toDataURL("image/jpeg", 0.98);
    var _this = $(this);

    var img = new Image();
    img.src = dataURL;
    img.crossOrigin = "Anonymous";
    img.onload = function () {

      var canvas = document.createElement("canvas");
      var w = 543;
  		var h = w;

  		canvas.width = w;
  		canvas.height = h;
  		var ctx = canvas.getContext("2d");
  		ctx.drawImage(img, 0, 0, w, h);
  		var dataURL = canvas.toDataURL("image/jpeg", 0.98);
      blob = dataURItoBlob(dataURL);

      var fd = new FormData();
      fd.append("foto", blob);
      swal({
        title: 'Loading...',
        showCancelButton: false,
        showConfirmButton: false,
        showCloseButton: false,
      });
      $.ajax({
         url: "services/upload_photo.php",
         type: "POST",
         data: fd,
         processData: false,
         contentType: false,
      }).done(function(response){

        var url = window.location.origin+"/"+response;
        console.log(url);
        if( _this.parent().hasClass('donwload') ){
          window.open("services/donwload.php?url="+url, "_blank");
        }else{

          FB.getLoginStatus(function(response) {
            if( response.status == 'connected' ){
              FB.api('/photos', 'post', {
                  message:'photo description',
                  url: url
              }, function(response){
                console.log(response);
                swal({
                  title: 'Congratulations',
                  text: ' Your photo has been published',
                  type: 'success',
                  confirmButtonColor: '#fb8f22',
                });
              });
            }else{
              swal.close();
              $(".btnc.profile-photo button").trigger('click');
            }
          });

        }
      });
    }
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

  // $(".photo .canvas .canvas-container").on('click', function(event) {
  $(".btnc.change-msj button").on('click', function(event) {
    ChangeText();
  });

  ChangeText();

});
