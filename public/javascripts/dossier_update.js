// INITIALIZE FUNCTIONS

jQuery(document).ready(function () {
  
  $('#save_mise_en_etat').click(function() {
    //mise_en_etat_create_post($('#id_dossier').val());
    //alert( "Handler for .click() called." );
  });
  
  $('#save_diligence').click(function() {
    //diligence_create_post($('#id_dossier').val());
  });
  
  $('#renseigner_mide_en_etat').click(function() {
    if ( $('#id_instruction').val() != "" || $('#id_instruction').val() != 'undefined'){
      mise_etat_get($('#id_dossier').val(),$('#id_instruction').val());
    }
  });
  
  $('#renseigner_diligence').click(function() {
    if ( $('#id_instruction').val() != "" || $('#id_instruction').val() != 'undefined'){
      diligence_get($('#id_dossier').val(),$('#id_instruction').val());
    }
  });

  $(".upClient").attr("readonly", true); 
  
  $("#upClientShow").click(function(){

    $("#upClientShow").addClass("hidden");
    $("#upClientSave").removeClass("hidden");
    $(".upClient").attr("readonly", false); 
  });

  $(".upContre").attr("readonly", true); 
  
  $("#upContreShow").click(function(){

    $("#upContreShow").addClass("hidden");
    $("#upContreSave").removeClass("hidden");
    $(".upContre").attr("readonly", false); 
  });
  
});


/*****************   page functions    **********************/

function autoriser_modif() {
  $('textarea[name=resume]').attr('readonly', false);
  $('input[name=montant]').attr('readonly', false);
  $(".nature").toggleClass("hidden");
  $('select[name=attributaire]').attr('disabled', false);
  $('select[name=litige]').attr('disabled', false);
  $('input[type=text][name=nature]').attr('disabled', true);
  $(".attributaire, .modifier_ou_sauvegarder").toggleClass("hidden"); //, .modifier_ou_sauvegarder

}

function empecher_modif() {
  $('input[type=text][name=nature]').val($('input[type=radio][name=nature]:checked').val());
  $('textarea[name=resume]').attr('readonly', true);
  $('select[name=attributaire]').val()('readonly', true);
  $('select[name=attributaire]').attr('readonly', true);
  $('input[name=nature]').attr('disabled', false);
  $('input[name=montant]').attr('readonly', true);
  $(".nature").toggleClass("hidden");
  $(".attributaire, .modifier_ou_sauvegarder").toggleClass("hidden");
}

function show_notification(shortCutFunction, title, msg) {
  //var shortCutFunction = "success";
  var $timeOut = 5000;
  var $showEasing = "swing";
  var $hideEasing = "linear";
  var $showMethod = "fadeIn";
  var $hideMethod = "fadeOut";


  toastr.options = {
    closeButton: true,
    positionClass: 'toast-top-full-width' || 'toast-top-right',
    onclick: null
  };

  var $toast = toastr[shortCutFunction](msg, title);
}

function update_dossier(id_dossier) {
  var route_update_infos_dossier = '/dossiers/dossier/' + id_dossier + '/update';
  var data = {};
  data.attributaire = $('select[name=attributaire]').val();
  data.litige = $('select[name=litige]').val();
  data.nature = $('input[type=radio][name=nature]:checked').val();
  data.resume = $('textarea[name=resume]').val();
  data.montant = $('input[name=montant]').val();

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: route_update_infos_dossier,
    success: function (data) {
      //empecher_modif();
      location.reload();
      var msg = "Les informations du dossier on été mises à jour!";
      var title = "Sauvegarde du dossier";
      setTimeout(show_notification(JSON.stringify(data.type_of_response), title, msg),1000);
      
      return;
    }
  });
}

var previous;
var old_juridiction ;
$("select[name=juridiction]").focus(function () {
  // Store the current value on focus, before it changes
  previous = this.value;
  old_juridiction = this.options[this.selectedIndex].text;
});



/********************  Instance  **********************/


      /***************Juridiction************/
function confirm_new_juridiction(selectObject, id_dossier, division) {

  var new_juridiction = selectObject.options[selectObject.selectedIndex].text;
  
    if($("select[name=juridiction]").val() != ''){
    swal({
        title: "Êtes-vous sûr(e)?",
        text: "Vous êtes sur le point de changer de juridiction!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Oui, le dossier change de juridiction",
        closeOnConfirm: false
      },
      function (isConfirm) {
        if (isConfirm) {
          create_instance(selectObject.value,id_dossier, division);
        } else {
          $("select[name=juridiction]").val(previous);
        }
      });
    }else{
      $("select[name=juridiction]").val(previous);
    }
};


// instance = instruction
function create_instance(id_juridiction, id_dossier, division) {
  var route_create_instance_dossier = '/dossiers/dossier/'+id_dossier+'/instruction/create';
  var data = {};
  
  data.juridiction = id_juridiction;
  data.dossier = id_dossier;
  data.division = division
  if($('#id_instruction').val() != ''){
    data.instruction = $('#id_instruction').val();
  }
  /* data.resume = $('textarea[name=resume]').val();
  data.montant = $('input[name=montant]').val();  */

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: route_create_instance_dossier,
    success: function (data) {
      //var res = data;
      if(data.type_of_response == 'success'){
        if (data.creation == true){
          swal(data.al_title, data.al_msg, "success");
          setTimeout(location.reload(), 5000);
        }else{
          show_notification('error', data.al_title, data.al_msg)
          setTimeout(location.reload(), 5000);
        }
      }
      
    }
  });
};

      /****************Renvois***************/
function get_renvoi_infos(id_dossier, division) {
  
  var motif = $("#motif_ins_"+division).val();
  var date = $("#date_ins_"+division).val();
  var type = $("#type_ins_"+division).val();
  var juridiction_value = $("#juridiction_"+division).val();
  
  if (motif == "" || date == "" || type == "") {
    swal("La Date saisie ou le Type choisi ou le Motif est invalide!");
  } else if (juridiction_value == null || juridiction_value == "undefined" || juridiction_value == "") {
    swal("Veuillez choisir la juridiction du dossier en cours");
  } else {
    // save infos renvoi
    create_renvoi(date, type, motif, id_dossier, juridiction_value, division);
   
  }

};

function create_renvoi(date_renvoi, type_renvoi, motif_renvoi, id_dossier,juridiction, division) {
  
  var route_create_renvoi_instance_dossier= '/dossiers/dossier/'+id_dossier+'/instruction/renvoi/create';
  var data = {};
  data.date_renvoi = date_renvoi;
  data.type_renvoi = type_renvoi;
  data.motif_renvoi = motif_renvoi;
  data.division = division
  data.juridiction = juridiction
  
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: route_create_renvoi_instance_dossier,
    success: function (data) {
      $("#motif_ins_"+division).val('');
      $("#date_ins_"+division).val('');
      $("#type_ins_"+division).val('');
      
      if($("#bloc_renvoi_ins_"+division).is(":hidden")) {
        $("#bloc_renvoi_ins_"+division).toggleClass('hidden');
      }
      
      $("#liste_renvoi_ins_"+division).html('');
      setTimeout(data.renvois_list.forEach(function(renvoi){
        $("#liste_renvoi_ins_"+division).append('<div class="row"><div class="col-sm-offset-1 col-sm-9"><p>Renvoyé au ' + moment(renvoi.r_date).format("DD-MM-YYYY") + ' ('+ renvoi.r_type + ') pour ' + renvoi.r_motif + '</p></div></div>');
      }), 1000);
      
      var msg = "Le dossier vient d'être renvoyé au "+data.date_last_renvoi+" .";
      var title = "Renvoi du dossier";
      show_notification(data.type_of_response, title, msg)
      setTimeout(location.reload(), 5000)
    }
  });
};

function verifDate(champ) {
  var dateNow = new Date(), 
      strSaisie = champ.value,
      dateJour, 
      dateSaisie;

  dateJour = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());
  strSaisie = strSaisie.replace(/-/g,"");
  dateSaisie = new Date(strSaisie.substr(4,4), strSaisie.substr(2,2)-1, strSaisie.substr(0,2));

  if (dateSaisie < dateJour ) {
    surligne(champ, true);
  }
  else {
    surligne(champ, false);
  }
  }

  function surligne(champ, erreur)
  {
  if(erreur)
  {
    champ.style.backgroundColor = "#fba";
    champ.value = "";
    //document.getElementById("btn_renvoi").style.display = "none";
    document.getElementById("error").innerHTML = "<div class='alert alert-warning text-center col-sm-offset-2 col-sm-8 col-md-offset-2 col-md-8'><a href='' class='close' data-dismiss='alert'>&times;</a><strong>Attention :</strong> Veuillez une date superieure a aujourd'hui.</div>";
  }

  else
  {
    champ.style.backgroundColor = "";
    //document.getElementById("btn_renvoi").style.display = "block";
    document.getElementById("error").innerHTML = "";
  }
}

      /**************** Mise en état ***************/


//Mise à l'état
  
var mee = 0;//counter mise à l'état form
var dil = 0; //counter diligences form
function mise_en_etat(le_form){ // x = le nbre de dfois qu'on appelle le form et le form = le formulaire incrémenté
  var i = 0;
  if (le_form == 'mee'){
    i = mee;
  } else if (le_form == 'dil'){
    i = dil;
  }

  $("#"+le_form).append('<div class="row"><div class="col-md-2"><label class="control-label text-bold">Du</label><input name="du_'+le_form+'_'+i+'" class="form-control date-picker" type="text" data-date-format="dd-mm-yyyy" data-date-viewmode="years" placeholder="Saisir une date" /></div><div class="col-md-2"><label class="control-label">Au</label><input name="au_'+le_form+'_'+i+'" class="form-control date-picker" type="text" data-date-format="dd-mm-yyyy" data-date-viewmode="years" placeholder="Saisir une date" /></div><div class="col-md-2 text-bold"><label class="control-label" for="">À</label><input name="h_'+le_form+'_'+i+'" class="form-control time-picker popovers" type="time" data-original-title="" data-content="Chiffre" data-placement="top" data-trigger="hover" onkeyup="this.value=this.value.replace(/\D/g,\'\')" value="15:00"/></div><div class="col-md-6 "><label class="control-label"></label><textarea name="com_'+le_form+'_'+i+'" class="form-control" placeholder="Texte"></textarea></div></div><br/>');
  
  addDatePicker();

  if (le_form == 'mee'){
    mee++;
  } else if (le_form == 'dil'){
    dil++;
  }

}
  
function mise_en_etat_create_post (id_dossier,id_instruction, juridiction){
    
  //var tribunal_id = $("#juridiction_"+division).val();
  if (mee == 0 || id_instruction == '' || juridiction == ''){
    return;
  }
  var datas = [];
  for (i=0; i<mee; i++){
    var data = {};
    
    var du_name = "du_mee_"+i;
    var au_name = "au_mee_"+i;
    var h_name = "h_mee_"+i;
    var com_name = "com_mee_"+i;
    
    var du = $("input[name='"+du_name+"']").val()
    var au = $("input[name='"+au_name+"']").val()
    var h = $("input[name='"+h_name+"']").val()
    var com_name = $("textarea[name='"+com_name+"']").val();
    
    data.du = du;
    data.au = au;
    data.h = h;
    data.com_name = com_name;
    datas.push(data);
  }
  
  var la_route= '/dossiers/dossier/'+id_dossier+'/instruction/'+id_instruction+'/'+juridiction+'/mise_en_etat/add';
  
  $.ajax({
    type: 'POST',
    data: JSON.stringify(datas),
    contentType: 'application/json',
    url: la_route,
    success: function (data) {
      mee = 0;
      $('#mee').html('');
      data.mee_list.forEach(function (doc) {
        $('#mee').append('<h3> DU    '+ moment(doc.c_debut).format("DD-MM-YYYY") + '    AU    <b>'+ moment(doc.c_fin).format("DD-MM-YYYY")+'</b>    A   <b>'+ doc.c_heure +'</b>    Objet:    ' + doc.c_commentaire+ '</h3>')
      })
      
      return;
    }
  });
}

function mise_etat_get(id_dossier, id_instruction){
  
  var la_route= '/dossiers/dossier/'+id_dossier+'/instruction/'+id_instruction+'/mise_en_etat/get';
  var data = {};
  //data.instruction = id_instruction;
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: la_route,
    success: function (data) {
      $('#mee').html('');
      data.mee_list.forEach(function (doc) {
        $('#mee').append('<h3> DU    '+ moment(doc.c_debut).format("DD-MM-YYYY") + '    AU    <b>'+ moment(doc.c_fin).format("DD-MM-YYYY")+'</b>    A   <b>'+ doc.c_heure +'</b>    Objet:    ' + doc.c_commentaire+ '</h3>')
      })
      
      return;
    }
  });
}

      /**************** Diligences *****************/

function diligence_create_post (id_dossier,id_instruction, juridiction){
  //var tribunal_id = $("select[name=juridiction]").val();
  if (dil == 0 || id_instruction == '' || juridiction == ''){
    //alert('je suis vide');
    return;
  }
  
  var datas = [];
  for (i=0; i<dil; i++){
    var data = {};
    
    var du_name = "du_dil_"+i;
    var au_name = "au_dil_"+i;
    var h_name = "h_dil_"+i;
    var com_name = "com_dil_"+i;
    
    var du = $("input[name='"+du_name+"']").val()
    var au = $("input[name='"+au_name+"']").val()
    var h = $("input[name='"+h_name+"']").val()
    var com_name = $("textarea[name='"+com_name+"']").val();
    
    data.du = du;
    data.au = au;
    data.h = h;
    data.com_name = com_name;
    datas.push(data);
  }
  
  var la_route= '/dossiers/dossier/'+id_dossier+'/instruction/'+id_instruction+'/'+juridiction+'/diligence/add';
  
  $.ajax({
    type: 'POST',
    data: JSON.stringify(datas),
    contentType: 'application/json',
    url: la_route,
    success: function (data) {
      dil=0;
      $('#dil').html('');
      data.dil_list.forEach(function (doc) {
        $('#dil').append('<h3> DU    '+ moment(doc.d_debut).format("DD-MM-YYYY") + '    AU    <b>'+ moment(doc.d_fin).format("DD-MM-YYYY")+'</b>    A   <b>'+ doc.d_heure +'</b>    Objet:    ' + doc.d_commentaire+ '</h3>')
      })
      
      return;
    }
  });
}


function diligence_get(id_dossier, id_instruction){
  var la_route = '/dossiers/dossier/'+id_dossier+'/instruction/'+id_instruction+'/diligence/get'; 
  var data = {};
  //data.instruction = id_instruction;
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: la_route,
    success: function (data) {
      $('#dil').html('');
      data.dil_list.forEach(function (doc) {
        $('#dil').append('<h3> DU    '+ moment(doc.d_debut).format("DD-MM-YYYY") + '    AU    <b>'+ moment(doc.d_fin).format("DD-MM-YYYY")+'</b>    A   <b>'+ doc.d_heure +'</b>    Objet:    ' + doc.d_commentaire+ '</h3>')
      })
      
      return;
    }
  });
}

/**************** Décision ***************/

function save_decision(id_dossier, id_instruction, division){
  
  var la_route = '/dossiers/dossier/'+id_dossier+'/instruction/'+id_instruction+'/decision/save'; 
  var data = {};
  data.decision = $('#decision_'+division).val();
  data.juridiction = $('#juridiction'+division).val();
  data.division = division;
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: la_route,
    success: function (data) {
      $('textarea[name=decision]').val(data.decision)
     
      $('textarea[name=decision]').attr('readonly', true);
      location.reload()
      return;
    }
  });
  
}


function addDatePicker(){
      $(".date-picker").datepicker({
        showOn: "button",
        buttonImage: "/calendar.png",
        buttonImageOnly: true,
        changeMonth: true,
        changeYear: true
      });
};

function uploadfiles(file, user_id) {
  /*console.log(file)
  return;*/
  //document.getElementById('image-preview').src = window.URL.createObjectURL(file);
  var mon_image = new FormData();
  mon_image.append('avatar', file);
  
  $.ajax({
    url: '/administrateur/utilisateur/upload_photo/'+user_id,
    type: 'POST',
    data: mon_image,
    cache:false,
    processData: false, // tell jQuery not to process the data
    contentType: false, // tell jQuery not to set contentType 
    
    
  }).done(function( data ) {

      

      location.reload();

  })
  .fail(console.log)
};

function formatBytes(a,b){
  if(0==a)return"0 Bytes";
  var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));
  return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f];
};