$(function(){

  var text = 0;
  window.scaleImage = 1;
  var texts = [
    '/assets/texts/f1.png',
    '/assets/texts/f2.png',
    '/assets/texts/f3.png',
    '/assets/texts/f4.png',
  ];
  var instance;
  function ChangeText() {
    var img = new Image();
    img.src = texts[text];
    img.onload = function () {
      var center = canvas.getCenter();
      canvas.setOverlayImage(texts[text], canvas.renderAll.bind(canvas), {
        crossOrigin: 'anonymous',
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

  function zoom(i) {
    i = parseFloat(floorFigure(i,2));
    if( i > window.scaleImageInit ) window.scaleImage = window.scaleImageInit;
    if( i < 0 ) window.scaleImage = 0;
    var center = canvas.getCenter();
    window.instanceImg.set({
      scaleY: i,
      scaleX: i,
      left: center.left,
      top: center.top,
      originX: 'center',
      originY: 'center'
    });
    canvas.renderAll();
    canvas.calcOffset();
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
    var w = Math.floor($(".canvas").width());
    var imgProfile = "https://graph.facebook.com/" + id + "/picture?width="+w+"&height="+w;
    $('#img-load')[0].crossOrigin = "Anonymous";
    $('#img-load')[0].crossorigin = "anonymous";
    $('#img-load').attr("src",imgProfile);
    $('#img-load').on('load', function(event) {
      renderPhoto();
    });
  }

  function iOS() {

  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'Safari',
    'iPad',
    'iPhone',
    'iPod'
  ];

  if (!!navigator.platform) {
    while (iDevices.length) {
      if (navigator.platform === iDevices.pop()){ return true; }
    }
  }

  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if( isSafari ){
    return true;
  }

  return false;
  }

  function renderPhoto(){
    if( typeof window.instanceImg != "undefined" ){ canvas.remove(window.instanceImg); }
    var imgElement = document.getElementById('img-load');
    var HideControls = {
          'tl':false, //top left corner is visible
          'tr':false,
          'bl':false,
          'br':false,
          'ml':false,
          'mt':false,
          'mr':false,
          'mb':false,
          'mtr':true
      };

    if ( iOS() ){
      fabric.util.loadImage(imgElement.src, function(img) {
          var w = Math.floor($(".canvas").width());
          var wI = img.width;
          var scale = (w/wI);

          var maxWidth = w; // Max width for the image
          var maxHeight = w;    // Max height for the image
          if( $(window).width() < 768 ){
            window.cornerSize = 28;
            scale = 543 / wI;
            maxHeight = 543;
            maxWidth = 543;
          } else {
            window.cornerSize = 14;
          }

          var ratio = 0;  // Used for aspect ratio
          var width = img.width;    // Current image width
          var height = img.height;  // Current image height
          var w = 543;
          var h = 543;

          if(width >= maxWidth){
              ratio = maxWidth / width;   // get ratio for scaling image
              h = height * ratio;   // Set new height
              w = maxWidth;
          }
          if(height >= maxHeight){
              ratio = maxHeight / height; // get ratio for scaling image
              h = maxHeight;   // Set new height
              w = width * ratio;   // Set new height
          }

          var object = new fabric.Image(img);
          object.set({
            left: 0,
            top: 0,
            angle: 0,
            opacity: 1,
            cornerSize: window.cornerSize,
            borderColor: 'rgba(2, 0, 61, 0.95)',
            cornerColor: 'rgba(2, 0, 61, 0.95)',
            transparentCorners: false,
            crossOrigin: 'Anonymous',
            width: w,
            height: h,
          });
          window.instanceImg = object;
          object.setControlsVisibility(HideControls);
          canvas.add(object).setActiveObject(object);
          canvas.moveTo(object, -1);
          window.scaleImage = scale;
          window.scaleImageInit = scale;
          $(".canvas").addClass('active');

        }, null, {
          crossOrigin: 'anonymous'
        });
    }else{
      var w = Math.floor($(".canvas").width());
      var wI = $(imgElement).width();
      var scale = (w/wI);
      if( $(window).width() < 768 ){
        window.cornerSize = 28;
        scale = 543 / wI;
      } else {
        window.cornerSize = 14;
      }
      var imgInstance = new fabric.Image(imgElement, {
        left: 0,
        top: 0,
        angle: 0,
        opacity: 1,
        cornerSize: window.cornerSize,
        borderColor: 'rgba(2, 0, 61, 0.95)',
        cornerColor: 'rgba(2, 0, 61, 0.95)',
        transparentCorners: false,
        crossOrigin: 'Anonymous',
        scaleX: scale,
        scaleY: scale,
      });
      window.instanceImg = imgInstance;
      imgInstance.setControlsVisibility(HideControls);
      canvas.add(imgInstance).setActiveObject(imgInstance);
      canvas.moveTo(imgInstance, -1);
      window.scaleImage = scale;
      window.scaleImageInit = scale;
      $(".canvas").addClass('active');
    }


  }

  function readURL(input,el) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        el.attr('src', e.target.result);
        renderPhoto();
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  function floorFigure(figure, decimals){
    if (!decimals) decimals = 2;
    var d = Math.pow(10,decimals);
    return (parseInt(figure*d)/d).toFixed(decimals);
  };

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '316155298796722',
      xfbml      : true,
      version    : 'v2.9',
      status     : true
    });
    FB.AppEvents.logPageView();

    FB.getLoginStatus(function(response) {
      if( response.status == 'connected' ){
        getPhoto(response.authResponse.userID);
      }
    },true);

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


  // $(".fb-btn.share button").on('click', function(event) {
  //   FB.ui({
  //     method: 'share_open_graph',
  //     action_type: 'og.shares',
  //     action_properties: JSON.stringify({
  //         object : {
  //            'og:url': "https://riseandshine.ga",
  //            'og:title': "Bimbo",
  //            'og:description': "Rise and Shine",
  //            'og:og:image:width': 543,
  //            'og:image:height': 543,
  //            'og:image': "https://riseandshine.ga/assets/logo.png"
  //         }
  //     })
  //   },function (response) {
  //     console.log(response);
  //   });
  // });


  $(".fb-btn.publish button, .donwload button, .fb-btn.share button").on('click', function(event) {

    if( typeof window.instanceImg == "undefined" ){
      swal("Please choose a photo");
      return;
    }

    var w = $(".canvas").width();
    var authToken = FB.getAccessToken();
    var dataURL = window.intanceCanvas.toDataURL("image/jpeg", 0.98);
    var _this = $(this);

    // var img = new Image();
    // img.crossOrigin = "Anonymous";
    // img.crossorigin = "anonymous";
    // img.src = dataURL;
    // img.onload = function () {
    //
    //   var canvas = document.createElement("canvas");
    //   var w = 543;
  	// 	var h = w;
    //
  	// 	canvas.width = w;
  	// 	canvas.height = h;
  	// 	var ctx = canvas.getContext("2d");
  	// 	ctx.drawImage(img, 0, 0, w, h);
  	// 	var dataURL = canvas.toDataURL("image/jpeg", 0.98);
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
          //window.open("services/donwload.php?url="+url, "_blank");
          // $("#download_link").attr("href","services/donwload.php?url="+url)[0].click();
          $("#download_link").attr("src","services/donwload.php?url="+url);
          swal.close();
        }else if ( _this.parent().hasClass('share') ){
          swal.close();
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
                   'og:image': url
                }
            })
          },function (response) {
            console.log(response);
          });
        }else{

          FB.getLoginStatus(function(response) {
            if( response.status == 'connected' ){
              FB.api('/photos', 'post', {
                  //message:'photo created by https://riseandshine.ga/',
                  url: url
              }, function(response){
                console.log(response);
                if( typeof response.error == 'undefined' ){
                  swal({
                    title: 'Congratulations',
                    text: ' Your photo has been published',
                    type: 'success',
                    confirmButtonColor: '#fb8f22',
                  });
                }else{
                  var msj = "";
                  if( response.error.message.split("(#200)").length > 0 ){
                    msj = "Please allow the permissions app";
                  }else{
                    msj = "Information";
                  }
                  swal({
                    title: 'Information',
                    text: msj,
                    type: 'info',
                    confirmButtonColor: '#fb8f22',
                  });
                  $(".btnc.profile-photo button").trigger('click');
                }
              });
            }else{
              swal.close();
              $(".btnc.profile-photo button").trigger('click');
            }
          }, true);

        }
      });
    // }
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

  // var canvas = new fabric.StaticCanvas('canvas',{
  var canvas = new fabric.Canvas('canvas',{
        preserveObjectStacking: true,
        selection: false,
        centeredScaling:true,
        allowTouchScrolling: true,
    });

  window.intanceCanvas = canvas;

  $(".canvas").on('touchstart touchmove touchend', function(event) {
    event.preventDefault();
  });

  fabric.Image.fromURL('/assets/background-canvas.png', function (img) {
    canvas.add(img);
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
    crossOrigin: 'anonymous',
  },{crossOrigin: 'Anonymous'});

  // $(".photo .canvas .canvas-container").on('click', function(event) {
  $(".btnc.change-msj button").on('click', function(event) {
    ChangeText();
  });

  $(".photo .btns .less span").on('click touchend', function(event) {
    window.scaleImage -= 0.1;
    zoom(window.scaleImage);
  });

  $(".photo .btns .plus span").on('click touchend', function(event) {
    window.scaleImage += 0.1;
    zoom(window.scaleImage);
  });

  ChangeText();


  if( iOS() ){
    // $(".btnc.load-photo, .donwload").hide();
    $(".donwload").hide();
    $(".fb-btn").css("margin-bottom","118px");
  }

});
