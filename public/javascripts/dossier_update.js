// INITIALIZE FUNCTIONS
$(document).ready(function () {
  $('#renseigner_mise_en_etat').on('click', function() {
    if ($('#id_instruction').val() != "" || $('#id_instruction').val() != 'undefined'){
      mise_etat_get($('#id_dossier').val(),$('#id_instruction').val());
    }
  });
});


/*****************   page functions    **********************/
function update(){
  $("#hidden").removeClass("hidden");
  $("#visible").addClass("hidden");
  let dossier = $("#id_dossier").val();
  $("#btn-func").attr('onclick', `update_dossier("${dossier}")`).html("Sauvegarder");
}

window.update_dossier = function (id_dossier) {

  var route_update_infos_dossier = '/dossiers/dossier/' + id_dossier + '/update';
  var data = {};
  data.ref_d_p = $('input[name=ref_d_p]').val();
  data.nature = ($('select[name=nature]').val() != 'null' ? $('select[name=nature]').val() : '');
  data.qualite = ($('select[name=qualite]').val() != 'null' ? $('select[name=qualite]').val() : '');
  data.resume = $('textarea[name=resume]').val();
  data.avocat = $('input[name=avocat]').val();
  console.log(data)
  if(data.nature == ''){
    return show_notification('info', 'Mise a jour du dossier', 'Veuillez renseigner au moins un des champs pour effectuer la mise a jour');
  }
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: route_update_infos_dossier,
    success: function (data) {
      if(data.update == true){
        show_notification(data.type_of_response, data.al_title, data.al_msg);
        setTimeout(reload_dossier(id_dossier), 5000);
      }
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



/********************  Instruction  **********************/
function choice_juridiction (division){
  show_notification('info', 'Opération non autorisée', 'Veuillez choisir une juridiction du niveau <strong class="text-uppercase">' + division + '</strong> pour pouvoir effectuer une operation d\'instruction');
}

function delibere_instruction (division){
  show_notification('warning', 'Opération non autorisée', 'L\'intruction en <strong class="text-uppercase">' + division + '</strong> a été cloturée');
}

/***************Juridiction************/
function confirm_new_juridiction(selectObject, id_dossier, new_division) {
  if(selectObject.value != 'null'){
    let division;
    let control = [];
    let degre = ['instance', 'appel', 'cour'];
    for(i in degre){
      if(new_division == degre[i]){
        division = check_division (degre[i]);
      }
      else{
        control.push(check_division (degre[i]));
      }
    }
    if(division == false && control[0] == false && control[1] == false){
      if(
        (new_division == 'instance' && $('#delibere_appel').val() == 'false' && $('#delibere_cour').val() == 'false' && $('#inst_appel').val() == 'false' && $('#inst_cour').val() == 'false') || 
        (new_division == 'appel' &&  $('#delibere_cour').val() != 'true' && $('#inst_cour').val() == 'false') || 
        (new_division == 'cour')){
        if(($('#inst_nature').val() == 'true' && selectObject.options[ selectObject.selectedIndex ].text == 'TC Niamey') || ($('select[name=nature]').val() == 'Commerciale' && selectObject.options[ selectObject.selectedIndex ].text == 'TGIHC Niamey')){
          $(selectObject).val('null').text('Selectionner une juridiction');
          return show_notification('error', 'Changement de juriduction', 'Non respect de la procedure judicaire, la juridiction ne peut pas être changer');
        }
          create_instance(selectObject.value, id_dossier, new_division);
      }
      else{
        $(selectObject).val('null');
        return show_notification('error', 'Changement de juriduction', 'Non respect de la procedure judicaire, la juridiction ne peut pas être changer');
      }
    }
    else{
      $(selectObject).val('null');
      show_notification('error', 'Changement de juriduction', 'Il y\'a déjà une instruction en cours, la juridiction ne peut pas être changer');
    }
  }
};

function check_division (division){
  let test = renvoi = mee = decision = false;
  ($(`#renvoi_${division}`).val() === 'true' ? renvoi = true: '');
  ($(`#mee_${division}`).val() === 'true' ? mee = true: '');
  ($(`#delibere_${division}`).val() === 'true' ? decision = true: '');
  if((renvoi == true && decision == false) || (mee == true && decision == false)){
    test = true;
  }
  return test;
}

function check_delibere(division, old_division){
  let degre = ['', 'appel', 'cour'];
  let delibere_instance = delibere_appel = delibere = false;
  let instance = ($('#delibere_instance').val() != undefined ? $('#delibere_instance').val(): '');
  let appel = ($('#delibere_appel').val() != undefined ? $('#delibere_appel').val(): '');
  if(division == degre[1]){
    delibere_instance = (instance.trim() == 'true'  ? true : false);
    (delibere_instance == true  ? delibere = true : '');
  }
  if(division == degre[2]){
    delibere_instance = (instance.trim() == 'true'  ? true : false);
    delibere_appel = (appel.trim() == 'true'  ? true : false);
    if(delibere_instance == true || delibere_appel == true){
      delibere = true;
    }
  }
  return delibere;
}

// instance = instruction
function create_instance(id_juridiction, id_dossier, division) {
  var route_create_instance_dossier = '/dossiers/dossier/'+id_dossier+'/instruction/create';
  var data = {};
  data.juridiction = id_juridiction;
  data.dossier = id_dossier;
  data.division = division
  if($('#id_instruction').val() != ''){
    data.instruction = $('#id_instruction').val();
    data.decision = check_delibere(division, $('#old_division').val());
  }
  // return console.log(data);
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: route_create_instance_dossier,
    success: function (data) {
      if(data.type_of_response == 'success'){
        show_notification(data.type_of_response, data.al_title, data.al_msg)
        setTimeout(reload_dossier(id_dossier), 5000);
      }
    }
  });
}

      /****************Renvois***************/
function get_renvoi_infos(id_dossier, division) {
  
  var motif = $("#motif_ins_"+division).val();
  var date = $("#date_ins_"+division).val();
  var last = $("#last_renvoi_ins_"+division).val();
  var type = $("#type_ins_"+division).val();
  var control = (type == 'renvoi au role general' || type == 'delibere vide' || type == 'non appele');
  var juridiction_value = $("#juridiction_"+division).val();
  
  if (motif == "" || type == '' || ((date == "" && control == false) || date != "" && control == true)) {
    show_notification('info', 'Renvoi non pris en charge', 'Veuillez remplir les champs <strong>date</strong>, <strong>type</strong> et <strong>motif</strong> afin que le systeme le prend en charge')
  }
  else{
    if (juridiction_value == null || juridiction_value == "undefined" || juridiction_value == "") {
      show_notification('info', 'Opération non autorisée', 'Veuillez choisir une juridiction pour pouvoir effectuer une operation d\'instruction');
    }
    else {
      if(last != undefined && date != ''){
        var control_renvoi =  control_date(last, date);
        if(control_renvoi == false){
          $("#date_ins_"+division).select();
          return show_notification('info', 'Renvoi non pris en charge', 'La date du prochain renvoi doit etre a la date du <strong>' + last + '</strong> supperieure a cette date')
        }
      }
      // save infos renvoi
      create_renvoi(date, type, motif, id_dossier, juridiction_value, division);
     
    }
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
      if(data.type_of_response){
        if(data.type_of_response == 'success'){
          $("#motif_ins_"+division).val('');
          $("#date_ins_"+division).val('');
          $("#type_ins_"+division).val('');
          
          if($("#bloc_renvoi_ins_"+division).is(":hidden")) {
            $("#bloc_renvoi_ins_"+division).toggleClass('hidden');
          }
          var msg = "Le dossier vient d'être renvoyé au "+data.date_last_renvoi+".";
          var title = "Renvoi du dossier";
          show_notification(data.type_of_response, title, msg)
          return setTimeout(reload_dossier(id_dossier), 5000);
        }
        if(data.type_of_response == 'warning'){
          var msg = "La procedure judiciaire est non respectée.";
          var title = "Renvoi du dossier";
          show_notification(data.type_of_response, title, msg);
        }
      }
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

function control_date(last, add){
  last = last.replace(/-/g,"");
  add = add.replace(/-/g,"");
  last = new Date(last.substr(4,4), last.substr(2,2)-1, last.substr(0,2));
  add = new Date(add.substr(4,4), add.substr(2,2)-1, add.substr(0,2));
  // console.log(last < add)
  return (last < add);
}

function surligne(champ, erreur){
  if(erreur){
    champ.style.backgroundColor = "#fba";
    champ.value = "";
    document.getElementById("error").innerHTML = "<div class='alert alert-warning text-center col-sm-offset-2 col-sm-8 col-md-offset-2 col-md-8'><a href='' class='close' data-dismiss='alert'>&times;</a><strong>Attention :</strong> Veuillez une date superieure a aujourd'hui.</div>";
  }
  else{
    champ.style.backgroundColor = "";
    document.getElementById("error").innerHTML = "";
  }
}

      /**************** Mise en état ***************/


//Mise à l'état
  
var mee = 0;//counter mise à l'état form
function mise_en_etat(le_form){ // x = le nbre de dfois qu'on appelle le form et le form = le formulaire incrémenté
  var i = 0;
  (le_form == 'mee'? i = mee:'');
  $("#"+le_form).append('\
    <div class="row">\
      <div class="col-md-2">\
        <label class="control-label text-bold">Conclusions</label>\
        <select name="conclusion_'+le_form+'_'+i+'"class="form-control">\
          <option disabled="" selected="">Selectionner</option>\
          <option value="nous"> Nous </option>\
          <option value="parties adverses"> Parties adverses </option>\
        </select>\
      </div>\
      <div class="col-md-2">\
        <label class="control-label text-bold">Du</label>\
        <input name="du_'+le_form+'_'+i+'" class="form-control date-picker" type="text" data-date-format="dd-mm-yyyy" data-date-viewmode="years" placeholder="Saisir une date" onchange="" />\
      </div>\
      <div class="col-md-2">\
        <label class="control-label">Au</label>\
        <input name="au_'+le_form+'_'+i+'" class="form-control date-picker" type="text" data-date-format="dd-mm-yyyy" data-date-viewmode="years" placeholder="Saisir une date" onchange=""/>\
      </div>\
      <div class="col-md-2 text-bold">\
        <label class="control-label" for="">À</label>\
        <input name="h_'+le_form+'_'+i+'" class="form-control time-picker popovers" type="time" data-original-title="" data-content="Chiffre" data-placement="top" data-trigger="hover" onkeyup="this.value=this.value.replace(/\D/g,\'\')" value="15:00"/>\
      </div>\
      <div class="col-md-4">\
        <label class="control-label"></label>\
        <textarea name="com_'+le_form+'_'+i+'" class="form-control" placeholder="Texte"></textarea>\
      </div>\
    </div>\
    <br/>'
  );
  addDatePicker();
  mee++;
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
      });
      $("#close").attr('onclick', `reload_dossier('${id_dossier}')`)
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


function addDatePicker(){
  $(".date-picker").datepicker({
    showOn: "button",
    buttonImage: "/calendar.png",
    buttonImageOnly: true,
    changeMonth: true,
    changeYear: true
  });
};

function type_complete_motif(check, division){
  var type = $(check).val();
  if(type == 'renvoi au role general' || type == 'delibere vide' || type == 'non appele'){
    $(`#date_ins_${division}`).val('').attr('disabled', true);
    if(type == 'renvoi au role general'){
      $(`#motif_ins_${division}`).val('Renvoyé au rôle général').attr('disabled', true);
    }
    else{
      if(type == 'delibere vide'){
        $(`#motif_ins_${division}`).val('Délibéré OK').attr('disabled', true);
      }
      else{
        $(`#motif_ins_${division}`).val('Non appelé').attr('disabled', true);
      }
    }
  }
  else{
    if(type == 'nos conclusions'){$(`#motif_ins_${division}`).val('Nos conclusions').attr('disabled', true);}
    $(`#date_ins_${division}, #motif_ins_${division}`).attr('disabled', false);
    $(`#motif_ins_${division}`).val('');
  }
}

/**************** Décision ***************/

function save_decision(id_dossier, id_instruction, division){
  var la_route = '/dossiers/dossier/'+id_dossier+'/instruction/'+id_instruction+'/decision/save'; 
  var data = {};
  var decision = $('#decision_'+division).val();
  if(decision.trim() == ''){
    return show_notification('warning', 'Sauvegarde de la decison', 'La sauvegarde de la decison a echoué')
  }
  data.decision = decision;
  data.juridiction = $('#juridiction'+division).val();
  data.division = division;
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: la_route,
    success: function (data) {
      if(data.type_of_response == 'success'){
        show_notification(data.type_of_response, data.al_title, data.al_msg)
        return setTimeout(reload_dossier(id_dossier), 5000);
      }
      if(data.type_of_response == 'warning'){
        show_notification(data.type_of_response, data.al_title, data.al_msg)
        $('#decision_'+division).val('');
      }
    }
  });
  
}

window.reload_dossier = function (dossier){
  window.location.href="/dossiers/dossier/"+dossier;
}