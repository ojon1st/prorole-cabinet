// INITIALIZE FUNCTIONS

var liste_des_pieces = [];

jQuery(document).ready(function () {
  $('#renseigner_mise_en_etat').on('click', function() {
    if ( $('#id_instruction').val() != "" || $('#id_instruction').val() != 'undefined'){
      mise_etat_get($('#id_dossier').val(),$('#id_instruction').val());
    }
  });
});


/*****************   page functions    **********************/

function autoriser_modif() {
  $('select[name=qualite]').attr('disabled', false);
  $('select[name=nature]').attr('disabled', false);
  $(".modifier_ou_sauvegarder").toggleClass("hidden"); // .modifier_ou_sauvegarder

}

function empecher_modif() {
  $('select[name=nature]').attr('disabled', true);
  $('select[name=qualite]').val()('readonly', true);
  $(".modifier_ou_sauvegarder").toggleClass("hidden");
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
  data.ref_d_p = $('input[name=ref_d_p]').val();
  data.qualite = $('select[name=qualite]').val();
  data.nature = $('select[name=nature]').val();
  

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: route_update_infos_dossier,
    success: function (data) {
      window.location.href = "/dossiers/dossier/" + id_dossier;
      return;
    }
  });
}

var previous;
var old_juridiction ;
$("select[name=juridiction]").on('focus',function () {
  // Store the current value on focus, before it changes
  previous = this.value;
  old_juridiction = this.options[this.selectedIndex].text;
});



/********************  Instance  **********************/


      /***************Juridiction************/
function confirm_new_juridiction(selectObject, id_dossier, division) {

  if($("select[name=juridiction]").val() != ''){
    create_instance(selectObject.value,id_dossier, division);
  }
};


// instance = instruction
function create_instance(id_juridiction, id_dossier, division) {
  var route_create_instance_dossier = '/dossiers/dossier/'+id_dossier+'/instruction/create';
  var data = {};
  
  data.juridiction = id_juridiction;
  data.dossier = id_dossier;
  data.division = division
  let _id = $('#id_instruction').val();
  if(_id.trim() != ''){
    data.instruction = $('#id_instruction').val();
  }

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: route_create_instance_dossier,
    success: function (data) {
      var res = data;
      if(data.type_of_response == 'success'){
        if (data.creation == true){
          // swal(data.al_title, data.al_msg, "success");
          // setTimeout(location.reload(), 5000);
          window.location.href="/dossiers/dossier/"+id_dossier;
        }else{
          // show_notification('error', data.al_title, data.al_msg)
          //setTimeout(location.reload(), 5000);
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
    $("#"+le_form).append('<div class="row"><div class="col-md-2"><label class="control-label text-bold">Conclusions</label><select name="conclusion_'+le_form+'_'+i+'"class="form-control"><option disabled="" selected="">Selectionner</option><option value="nous"> Nous </option><option value="parties adverses"> Parties adverses </option></select></div><div class="col-md-2"><label class="control-label text-bold">Du</label><input name="du_'+le_form+'_'+i+'" class="form-control date-picker" type="text" data-date-format="dd-mm-yyyy" data-date-viewmode="years" placeholder="Saisir une date" onchange="verifDate(this)" /></div><div class="col-md-2"><label class="control-label">Au</label><input name="au_'+le_form+'_'+i+'" class="form-control date-picker" type="text" data-date-format="dd-mm-yyyy" data-date-viewmode="years" placeholder="Saisir une date" onchange="verifDate(this)"/></div><div class="col-md-2 text-bold"><label class="control-label" for="">À</label><input name="h_'+le_form+'_'+i+'" class="form-control time-picker popovers" type="time" data-original-title="" data-content="Chiffre" data-placement="top" data-trigger="hover" onkeyup="this.value=this.value.replace(/\D/g,\'\')" value="15:00"/></div><div class="col-md-4"><label class="control-label"></label><textarea name="com_'+le_form+'_'+i+'" class="form-control" placeholder="Texte"></textarea></div></div><br/>');
  } else if (le_form == 'dil'){
    i = dil;
    $("#"+le_form).append('<div class="row"><div class="col-md-2"><label class="control-label text-bold">Du</label><input name="du_'+le_form+'_'+i+'" class="form-control date-picker" type="text" data-date-format="dd-mm-yyyy" data-date-viewmode="years" placeholder="Saisir une date" onchange="verifDate(this)" /></div><div class="col-md-2"><label class="control-label">Au</label><input name="au_'+le_form+'_'+i+'" class="form-control date-picker" type="text" data-date-format="dd-mm-yyyy" data-date-viewmode="years" placeholder="Saisir une date" onchange="verifDate(this)" /></div><div class="col-md-2 text-bold"><label class="control-label" for="">À</label><input name="h_'+le_form+'_'+i+'" class="form-control time-picker popovers" type="time" data-original-title="" data-content="Chiffre" data-placement="top" data-trigger="hover" onkeyup="this.value=this.value.replace(/\D/g,\'\')" value="15:00"/></div><div class="col-md-6"><label class="control-label"></label><textarea name="com_'+le_form+'_'+i+'" class="form-control" placeholder="Texte"></textarea></div></div><br/>');
  }

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
    
    var conclusion_name = "conclusion_mee_"+i;
    var du_name = "du_mee_"+i;
    var au_name = "au_mee_"+i;
    var h_name = "h_mee_"+i;
    var com_name = "com_mee_"+i;
    
    var con = $("select[name='"+conclusion_name+"']").val()
    var du = $("input[name='"+du_name+"']").val()
    var au = $("input[name='"+au_name+"']").val()
    var h = $("input[name='"+h_name+"']").val()
    var com_name = $("textarea[name='"+com_name+"']").val(); 
    
    data.con = con;
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

function upload_decision_file(instruction_id) {
  
  var file = $('#udf').prop('files')[0];
  
  var mon_pdf = new FormData();
  mon_pdf.append('decision_file', file);
  
  var ma_route = '/dossiers/dossier/instruction/' + instruction_id + '/save_delibere_file';
  
  $.ajax({
    url: ma_route,
    type: 'POST',
    data: mon_pdf,
    cache:false,
    processData: false, // tell jQuery not to process the data
    contentType: false, // tell jQuery not to set contentType 
  }).done(function( data ) {
    
      
      location.reload();
  })
  .fail(console.log)
};


function save_pieces_du_dossier(dossier_id) {
  
  
  
  var file = $('#pieces_du_dossier').prop('files')[0];
  var piece_type = $('#type_pieces_du_dossier').val();
  
  if(file != undefined && piece_type != null && dossier_id != ''){
    var my_file = new FormData();
    my_file.append(piece_type, file);

    var ma_route = '/dossiers/dossier/'+dossier_id+'/save_pieces/'+piece_type;

    $.ajax({
      url: ma_route,
      type: 'POST',
      data: my_file,
      cache:false,
      processData: false, // tell jQuery not to process the data
      contentType: false, // tell jQuery not to set contentType 
    }).done(function( data ) {


        location.reload();
    })
    .fail(console.log)
} else{
  if(piece_type == null){
           alert('Veuillez renseigner le type de pièce');
  }else if(file == undefined){
    alert('Veuillez sélectionner une pièce');
           }else if(dossier_id == ''){
                    alert('Aucun numéro de dossier en cours') ;
                    }
}
};


function afficher_pieces_du_dossier(dossier_id){
  
  var type_piece = $('#type_pieces_visualisation').val();
  
  
    $.ajax({
    type: 'GET',
    //data: ,
    contentType: 'application/json',
    url: '/dossiers/dossier/'+dossier_id+'/type_piece/'+type_piece+'/get_liste_des_pieces',
    success: function (data) {
      console.log(typeof(data))
      
      var tableRef = document.getElementById('table_des_pieces').getElementsByTagName('tbody')[0];
      while(tableRef.hasChildNodes())
      {
         tableRef.removeChild(tableRef.firstChild);
      }
      
      data.forEach(function(piece){
        console.log(piece)
        

        // Insert a row in the table at the last row
        var newRow   = tableRef.insertRow(tableRef.rows.length);

        // Insert a cell in the row at index 0
        var Cell1  = newRow.insertCell(0);
        var Cell2  = newRow.insertCell(1);
        var Cell3  = newRow.insertCell(2);
        var Cell4  = newRow.insertCell(3);
        
        if (piece.piece_url && checkURL(piece.piece_url) == false){
          Cell1.innerHTML = '<td><span class="preview"></span><a href="'+piece.piece_url+'" download="'+piece.originalname+'"  title="'+piece.name+'" data-gallery=""><iframe src="'+piece.piece_url+'" width="80" height="80" scrolling="no"></iframe></a></td>'
        }else{
          Cell1.innerHTML = '<td><span class="preview"></span><a href="'+piece.piece_url+'" download="'+piece.originalname+'"  title="'+piece.name+'" data-gallery=""><img src="'+piece.piece_url+'" width="80" height="80" scrolling="no"></a></td>'
        }
        
        if (piece.error){
          Cell2.innerHTML = '<td><span class="label label-danger"> Error </span> '+piece.error+' </td>';
        }else{
          if(piece.piece_url){
            Cell2.innerHTML = '<td><a href="'+piece.piece_url+'" title="'+piece.originalname+'" download="'+piece.originalname+'">'+piece.originalname+'</a></td>'
          }else{
            Cell2.innerHTML = '<td><span class=""> '+piece.originalname+' </span> </td>';
          }
        }
                
        Cell3.innerHTML = '<td><span class="size"> '+ formatBytes(piece.size,2) +' </span> </td>';
        
        Cell4.innerHTML = '<td><span > '+ piece.classeur +' </span> </td>';
        
      })
      
    }
  });
  
}


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

function checkURL(url) { return(url.match(/\.(jpeg|jpg|gif|png)$/) != null); };

function type_complete_motif(type){
  var motif = type.value;
  var role_general = 'Renvoyé au rôle général';
  var deliberer = 'Mise en délibéré';
  if(motif == 'renvoi au role general' || motif == 'mise en delibere'){
    if(motif == 'renvoi au role general'){ $('.motif').val(role_general).attr('disabled', true);}
    else { $('.motif').val(deliberer).attr('disabled', true);}
  }
  else{$('.motif').val('').attr('disabled', false);}
}

function nature2instruction(nature){
  var nature = nature.value;
  if(nature == 'Consultation' || nature == 'Simple police' || nature == 'Information judiciaire' || nature == 'Correctionnelle Citation Directe' || nature == 'Correctionnelle flagrant délit' || nature == 'Criminelle' || nature == 'Assises' || nature == 'Infractions à caractère économique' || nature == 'Terrorisme'){
    if(nature == 'Consultation') { $('.actions').append('<li><a href="#consultation" data-toggle="tab" class="active">Consutation</a></li>');}
    else { $('.actions').append('<li><a href="#enquete" data-toggle="tab" class="active">Enquête préliminaire</a></li> <li><a href="#chambre" data-toggle="tab">Chambre d\'instruction</a></li> <li><a href="#jugement" data-toggle="tab">Jugement</a></li>');}
  }
  else { $('.actions').append('<li><a href="#jugement" data-toggle="tab" class="active">Jugement</a></li>');}
}