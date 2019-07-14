/*
 * jQuery File Upload Plugin JS Example 8.9.1
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/* global $, window */

$(function () {
    'use strict';
  // Initialize the jQuery File Upload widget:

    $('.fileupload').each(function () {
      var theurl = '';
      var id_dossier = $('#id_dossier').val();
      
      switch (this.id) {
        case 'pieces-formes':
          theurl = '/dossiers/dossier/'+id_dossier+'/save_pieces/pieces-formes'
          break;
        case 'pieces-fonds':
          theurl = '/dossiers/dossier/'+id_dossier+'/save_pieces/pieces-fonds'
          break;
        case 'ecritures-recues':
          theurl = '/dossiers/dossier/'+id_dossier+'/save_pieces/ecritures-recues'
          break;
        case 'ecritures-envoyees':
          theurl = '/dossiers/dossier/'+id_dossier+'/save_pieces/ecritures-envoyees'
          break;
        case 'courriers-divers':
          theurl = '/dossiers/dossier/'+id_dossier+'/save_pieces/courriers-divers'
          break;

        default:
          // code block
      };  
      if(this.id == 'pieces-formes'){
         $(this).fileupload({
            dropZone: $(this),
            url:theurl
          });
      }else if (this.id == 'pieces-fonds'){
        $(this).fileupload({
            dropZone: $(this),
            url:theurl
          });
      }else if (this.id == 'ecritures-recues'){
        $(this).fileupload({
            dropZone: $(this),
            url:theurl
          });
      }else if (this.id == 'ecritures-envoyees'){
        $(this).fileupload({
            dropZone: $(this),
            url:theurl
          });
      }else if (this.id == 'courriers-divers'){
        $(this).fileupload({
            dropZone: $(this),
            url:theurl
          });
      }else{
                return;
                }

      
      
      // Load existing files:
      $(this).addClass('fileupload-processing');
      $.ajax({
          // Uncomment the following to send cross-domain cookies:
          //xhrFields: {withCredentials: true},
          url: $(this).fileupload('option', 'url'),
          dataType: 'json',
          context: $(this)[0]
      }).always(function () {
          $(this).removeClass('fileupload-processing');
      }).done(function (result) {
          $(this).fileupload('option', 'done')
              .call(this, $.Event('done'), {result: result});
      });
    });
  

    
    

  ////////////////////////////////////////////////////////   #fileupload-pieces-formes
 /* 
    // Initialize the jQuery File Upload widget:
    $('#fileupload-pieces-formes').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: '/dossiers/dossier/5c5b90748f331f2ce0078662/save_pieces/pieces-formes'
    });

    if (window.location.hostname === 'blueimp.github.io') {
        // Demo settings:
        $('#fileupload-pieces-formes').fileupload('option', {
            url: '//jquery-file-upload.appspot.com/',
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator.userAgent),
            maxFileSize: 5000000,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
        });
        
    } else {
        // Load existing files:
        $('#fileupload-pieces-formes').addClass('fileupload-processing');
      //var documents = new FormData();
      //documents.append('files[]', files);
        $.ajax({
            
            url: $('#fileupload-pieces-formes').fileupload('option', 'url'),
            dataType: 'json',
            context: $('#fileupload-pieces-formes')[0]
        }).always(function () {
            $(this).removeClass('fileupload-processing');
        }).done(function (result) {
            $(this).fileupload('option', 'done')
                .call(this, $.Event('done'), {result: result});
        });
    }

*/
////////////////////////////////////////////////////////   #fileupload-pieces-fonds
/*
// Initialize the jQuery File Upload widget:
    $('#fileupload-pieces-fonds').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: '/dossiers/dossier/5c5b90748f331f2ce0078662/save_pieces/pieces-fonds'
    });

    if (window.location.hostname === 'blueimp.github.io') {
        // Demo settings:
        $('#fileupload-pieces-fonds').fileupload('option', {
            url: '//jquery-file-upload.appspot.com/',
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/
                .test(window.navigator.userAgent),
            maxFileSize: 5000000,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
        });
        
    } else {
        // Load existing files:
        $('#fileupload-pieces-fonds').addClass('fileupload-processing');
      //var documents = new FormData();
      //documents.append('files[]', files);
        $.ajax({
            
            url: $('#fileupload-pieces-fonds').fileupload('option', 'url'),
            dataType: 'json',
            context: $('#fileupload-pieces-fonds')[0]
        }).always(function () {
            $(this).removeClass('fileupload-processing');
        }).done(function (result) {
            $(this).fileupload('option', 'done')
                .call(this, $.Event('done'), {result: result});
        });
    }
   */

////////////////////////////////////////////////////////   #fileupload-ecritures-recues
/*


  $('#fileupload-ecritures-recues').fileupload({
      // Uncomment the following to send cross-domain cookies:
      //xhrFields: {withCredentials: true},
      url: '/dossiers/dossier/5c5b90748f331f2ce0078662/save_pieces/ecritures-recues'
  });

  if (window.location.hostname === 'blueimp.github.io') {
      // Demo settings:
      $('#fileupload-ecritures-recues').fileupload('option', {
          url: '//jquery-file-upload.appspot.com/',
          // Enable image resizing, except for Android and Opera,
          // which actually support image resizing, but fail to
          // send Blob objects via XHR requests:
          disableImageResize: /Android(?!.*Chrome)|Opera/
              .test(window.navigator.userAgent),
          maxFileSize: 5000000,
          acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
      });

  } else {
      // Load existing files:
      $('#fileupload-ecritures-recues').addClass('fileupload-processing');
    //var documents = new FormData();
    //documents.append('files[]', files);
      $.ajax({

          url: $('#fileupload-ecritures-recues').fileupload('option', 'url'),
          dataType: 'json',
          context: $('#fileupload-ecritures-recues')[0]
      }).always(function () {
          $(this).removeClass('fileupload-processing');
      }).done(function (result) {
          $(this).fileupload('option', 'done')
              .call(this, $.Event('done'), {result: result});
      });
  }

*/

////////////////////////////////////////////////////////   #fileupload-ecritures-envoyees
/*


$('#fileupload-ecritures-envoyees').fileupload({
      // Uncomment the following to send cross-domain cookies:
      //xhrFields: {withCredentials: true},
      url: '/dossiers/dossier/5c5b90748f331f2ce0078662/save_pieces/ecritures-envoyees'
  });

  if (window.location.hostname === 'blueimp.github.io') {
      // Demo settings:
      $('#fileupload-ecritures-envoyees').fileupload('option', {
          url: '//jquery-file-upload.appspot.com/',
          // Enable image resizing, except for Android and Opera,
          // which actually support image resizing, but fail to
          // send Blob objects via XHR requests:
          disableImageResize: /Android(?!.*Chrome)|Opera/
              .test(window.navigator.userAgent),
          maxFileSize: 5000000,
          acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
      });

  } else {
      // Load existing files:
      $('#fileupload-ecritures-envoyees').addClass('fileupload-processing');
    //var documents = new FormData();
    //documents.append('files[]', files);
      $.ajax({

          url: $('#fileupload-ecritures-envoyees').fileupload('option', 'url'),
          dataType: 'json',
          context: $('#fileupload-ecritures-envoyees')[0]
      }).always(function () {
          $(this).removeClass('fileupload-processing');
      }).done(function (result) {
          $(this).fileupload('option', 'done')
              .call(this, $.Event('done'), {result: result});
      });
  }

*/



////////////////////////////////////////////////////////   #fileupload-courriers_divers

/*
$('#fileupload-courriers-divers').fileupload({
      // Uncomment the following to send cross-domain cookies:
      //xhrFields: {withCredentials: true},
      url: '/dossiers/dossier/5c5b90748f331f2ce0078662/save_pieces/courriers-divers'
  });

      // Load existing files:
      $('#fileupload-courriers-divers').addClass('fileupload-processing');
    //var documents = new FormData();
    //documents.append('files[]', files);
      $.ajax({
          url: $('#fileupload-courriers-divers').fileupload('option', 'url'),
          dataType: 'json',
          context: $('#fileupload-courriers-divers')[0]
      }).always(function () {
          $(this).removeClass('fileupload-processing');
      }).done(function (result) {
          $(this).fileupload('option', 'done')
              .call(this, $.Event('done'), {result: result});
      });
*/

});