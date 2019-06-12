var tab_pour = [];
var tab_contre = [];

jQuery(document).ready(function () {
  jQuery.ajax({
    contentType: 'application/json',
    url: '/parties/partie',
    type: 'GET',
    dataType: 'json',
    success: function(doc) {
      tab_pour = doc.tab_client;
      tab_contre = doc.tab_adverse;
    }
  });
  
  $('#number').on('input', function() {
    var value = $(this).val();
    alert($('#browser [value="' + value + '"]').data('customvalue'));
  });
    
  //affichage de donnees client personne physique
  $("#btn_physique_pour").click(function () {
    $("#p_type").val("pp");
    $("#type_pour").addClass("hidden");
    $("#physique_pour").removeClass("hidden");
    $("#tiltle_pour").text("CLIENT - PHYSIQUE");
  });

  //affichage de donnees client personne morale
  $("#btn_morale_pour").click(function () {
    $("#p_type").val("pm");
    $("#type_pour").addClass("hidden");
    $("#morale_pour").removeClass("hidden");
    $("#tiltle_pour").text("CLIENT - MORALE");
  });
  
  //affichage de donnees client personne physique
  $("#btn_physique_contre").click(function () {
    $("#c_type").val("pp");
    $("#type_contre").addClass("hidden");
    $("#physique_contre").removeClass("hidden");
    $("#tiltle_contre").text("PARTIE ADVERSE - PHYSIQUE");
  });

  //affichage de donnees client personne morale
  $("#btn_morale_contre").click(function () {
    $("#c_type").val("pm");
    $("#type_contre").addClass("hidden");
    $("#morale_contre").removeClass("hidden");
    $("#tiltle_contre").text("PARTIE ADVERSE - MORALE");
  });

  //affiche les buttons physique et morale partie client
  $("#retour_pour").click(function () {
    nbre = autreAvocat = nbreMorale = autreAvocatMorale = 1;
    $("#p_type").val("");
    $("#nb_other_client_pour").val(0);
    $("#nb_other_avocat_pour").val(0);
    $("#sec_pour").empty();
    $("#autre_avocat").empty();
    $("#sec_pour_morale").empty();
    $("#autre_avocat_morale").empty();
    $("#type_pour").removeClass("hidden");
    $("#morale_pour").addClass("hidden");
    $("#physique_pour").addClass("hidden");
    $("#tiltle_pour").text("CLIENT(S)");
  });

  //affiche les buttons physique et morale partie adverse
  $("#retour_contre").click(function () {
    nombre=autreAvocatAdverse=nombreContre=autreAvocatAdverseMorale = 1;
    $("#c_type").val("");
    $("#nb_other_client_contre").val(0);
    $("#nb_other_avocat_contre").val(0);
    $("#sec_contre").empty();
    $("#autre_avocatAdverse").empty();
    $("#sec_contre_morale").empty();
    $("#autre_avocatAdverse_morale").empty();
    $("#type_contre").removeClass("hidden");
    $("#morale_contre").addClass("hidden");
    $("#physique_contre").addClass("hidden");
    $("#tiltle_contre").text("PARTIE(S) ADVERSE(S)");
  });

  //ajout de client physique
  var nbre = 1;
  $("#plus_pour").click(function () {

    $("#sec_pour").append('<div class="form-group"><label class="col-sm-3 control-label" for="form-field-1">Autre Client ' + nbre + ' <span class="symbol required"></span> : </label><div class="col-sm-8"><span class="input-icon"><input type="text" placeholder="Nom et prenom client" id="addClient_' + nbre + '" name="autres_pour_' + nbre + '" class="form-control"><i class="fa fa-user"></i></span></div></div>');

    $("#titre_client").html('<div class="form-group"><label class="col-sm-offset-4 col-sm-4 control-label text-center" for="form-field-1"><span class="text-bold">Autres clients</span></label></div>');

    $("#clientLabel").hide();
    $("#clientRow").removeClass("col-sm-8");
    $("#clientInput").removeClass("col-sm-offset-1 col-sm-5 col-xs-4").addClass("col-sm-offset-8 col-sm-2");
    $("#nb_other_client_pour").val(nbre);
    nbre++;
  });

  //function d'ajout autre avocat physique
  var autreAvocat = 1;
  $("#plus_autre").click(function () {
    $("#autre_avocat").append('<div class="form-group"><label class="col-sm-3 control-label">Nom & prenom <span class="symbol required"></span> :</label><div class="col-sm-8"><span class="input-icon"><input type="text" name="autres_avocats_pour_prenom_nom_' + autreAvocat + '" placeholder="Nom & Prenom de l\'avocat" class="form-control"><i class="fa fa-user"></i></span></div></div><div class="form-group"><label class="col-sm-3 control-label">Téléphone <span class="symbol required"></span> :</label><div class="col-sm-8"><span class="input-icon"><input type="text" name="autres_avocats_pour_tel_' + autreAvocat + '" placeholder="Téléphone de l\'avocat" class="form-control input-mask-phone"><i class="fa fa-phone"></i></span></div></div><div class="form-group"><label class="col-sm-3 control-label">Email <span class="symbol required"></span> :</label><div class="col-sm-8"><span class="input-icon"><input type="email" name="autres_avocats_pour_email_' + autreAvocat + '" placeholder="Adresse electronique de l\'avocat" class="form-control"><i class="fa fa-envelope"></i></span></div></div><br>');

    $("#titre_avocat").html('<div class="form-group"><label class="col-sm-offset-4 col-sm-4 control-label text-center" for="form-field-1"><span class="text-bold">Autres avocats</span></label></div>');

    $("#autreLabel").hide();
    $("#autreRow").removeClass("col-sm-8");
    $("#autreInput").removeClass("col-sm-offset-1 col-sm-5 col-xs-4").addClass("col-sm-offset-8 col-sm-2");
    $("#nb_other_avocat_pour").val(autreAvocat);
    autreAvocat++;
  });

  //ajout de client morale
  var nbreMorale = 1;
  $("#plus_pour_morale").click(function () {

    $("#sec_pour_morale").append('<div class="form-group"><label class="col-sm-3 control-label" for="form-field-1">Autre Client ' + nbreMorale + ' <span class="symbol required"></span> : </label><div class="col-sm-8"><span class="input-icon"><input type="text" placeholder="Dénommination sociale du client" id="client_morale' + nbreMorale + '" name="autres_pour_' + nbreMorale + '" class="form-control"><i class="fa fa-home"></i></span></div></div>');

    $("#titre_client_morale").html('<div class="form-group"><label class="col-sm-offset-4 col-sm-4 control-label text-center" for="form-field-1"><span class="text-bold">Autres clients</span></label></div>');

    $("#clientMoraleLabel").hide();
    $("#clientMoraleRow").removeClass("col-sm-8");
    $("#clientMoraleInput").removeClass("col-sm-offset-1 col-sm-5 col-xs-4").addClass("col-sm-offset-8 col-sm-2");
    $("#nb_other_client_pour").val(nbreMorale);
    nbreMorale++;
  });

  //function d'ajout autre avocat morale
  var autreAvocatMorale = 1;
  $("#plus_autre_morale").click(function () {
    $("#autre_avocat_morale").prepend('<div class="form-group"><label class="col-sm-3 control-label">Nom & prenom <span class="symbol required"></span> :</label><div class="col-sm-8"><span class="input-icon"><input type="text" name="autres_avocats_pour_prenom_nom_' + autreAvocatMorale + '" placeholder="Nom & Prenom de l\'avocat" class="form-control"><i class="fa fa-user"></i></span></div></div><div class="form-group"><label class="col-sm-3 control-label">Téléphone <span class="symbol required"></span> :</label><div class="col-sm-8"><span class="input-icon"><input type="text" name="autres_avocats_pour_tel_' + autreAvocatMorale + '" placeholder="Téléphone de l\'avocat" class="form-control input-mask-phone"><i class="fa fa-phone"></i></span></div></div><div class="form-group"><label class="col-sm-3 control-label">Email <span class="symbol required"></span> :</label><div class="col-sm-8"><span class="input-icon"><input type="email" name="autres_avocats_email_' + autreAvocatMorale + '" placeholder="Adresse electronique de l\'avocat" class="form-control"><i class="fa fa-envelope"></i></span></div></div><br>');


    $("#titre_morale").html('<div class="form-group"><label class="col-sm-offset-4 col-sm-4 control-label text-center" for="form-field-1"><span class="text-bold">Autres avocats</span></label></div>');

    $("#autreLabelMorale").hide();
    $("#autreRowMorale").removeClass("col-sm-8");
    $("#autreInputMorale").removeClass("col-sm-offset-1 col-sm-5 col-xs-4").addClass("col-sm-offset-8 col-sm-2");
    $("#nb_other_avocat_pour").val(autreAvocatMorale);
    autreAvocatMorale++;
  });

  //ajout de contre physique
  var nombre = 1;
  $("#plus_contre").click(function () {

    $("#sec_contre").append('<div class="form-group"><label class="col-sm-3 control-label" for="form-field-1">Autre contre ' + nombre + ' <span class="symbol required"></span> : </label><div class="col-sm-8"><span class="input-icon"><input type="text" placeholder="Nom et prenom contre" id="addcontre_' + nombre + '" name="autres_contre_' + nombre + '" class="form-control"><i class="fa fa-user"></i></span></div></div>');

    $("#titre_contre").html('<div class="form-group"><label class="col-sm-offset-4 col-sm-4 control-label text-center" for="form-field-1"><span class="text-bold">Autres clients</span></label></div>');

    $("#contreLabel").hide();
    $("#contreRow").removeClass("col-sm-8");
    $("#contreInput").removeClass("col-sm-offset-1 col-sm-5 col-xs-4").addClass("col-sm-offset-8 col-sm-2");
    $("#nb_other_client_contre").val(nombre);
    nombre++;
  });

  //function d'ajout autre avocatAdverse physique
  var autreAvocatAdverse = 1;
  $("#plus_autreContre").click(function () {
    $("#autre_avocatAdverse").prepend('<div class="form-group"><label class="col-sm-3 control-label">Nom & prenom <span class="symbol required"></span> :</label><div class="col-sm-8"><span class="input-icon"><input type="text" name="autres_avocats_contre_prenom_nom_' + autreAvocatAdverse + '" placeholder="Nom & Prenom de l\'avocat adverse" class="form-control"><i class="fa fa-user"></i></span></div></div><div class="form-group"><label class="col-sm-3 control-label">Téléphone <span class="symbol required"></span> :</label><div class="col-sm-8"><span class="input-icon"><input type="text" name="autres_avocats_contre_tel_' + autreAvocatAdverse + '" placeholder="Téléphone de l\'avocat adverse" class="form-control input-mask-phone"><i class="fa fa-phone"></i></span></div></div><div class="form-group"><label class="col-sm-3 control-label">Email <span class="symbol required"></span> :</label><div class="col-sm-8"><span class="input-icon"><input type="email" name="autres_avocats_contre_email_' + autreAvocatAdverse + '" placeholder="Adresse electronique de l\'avocat adverse" class="form-control"><i class="fa fa-envelope"></i></span></div></div><br>');

    $("#titre_avocatAdverse").html('<div class="form-group"><label class="col-sm-offset-4 col-sm-4 control-label text-center" for="form-field-1"><span class="text-bold">Autres avocatAdverses</span></label></div>');

    $("#autreLabelContre").hide();
    $("#autreRowContre").removeClass("col-sm-8");
    $("#autreInputContre").removeClass("col-sm-offset-1 col-sm-5 col-xs-4").addClass("col-sm-offset-8 col-sm-2");
    $("#nb_other_avocat_contre").val(autreAvocatAdverse);
    autreAvocatAdverse++;
  });

  //ajout de contre morale
  var nombreContre = 1;
  $("#plus_contre_morale").click(function () {

    $("#sec_contre_morale").append('<div class="form-group"><label class="col-sm-3 control-label" for="form-field-1">Autre contre ' + nombreContre + ' <span class="symbol required"></span> : </label><div class="col-sm-8"><span class="input-icon"><input type="text" placeholder="Denommination sociale du contre" id="contre_morale' + nombreContre + '" name="autres_contre_' + nombreContre + '" class="form-control"><i class="fa fa-home"></i></span></div></div>');

    $("#titre_contre_morale").html('<div class="form-group"><label class="col-sm-offset-4 col-sm-4 control-label text-center" for="form-field-1"><span class="text-bold">Autres clients</span></label></div>');

    $("#contreMoraleLabel").hide();
    $("#contreMoraleRow").removeClass("col-sm-8");
    $("#contreMoraleInput").removeClass("col-sm-offset-1 col-sm-5 col-xs-4").addClass("col-sm-offset-8 col-sm-2");
    $("#nb_other_client_contre").val(nombreContre);
    nombreContre++;
  });

  //function d'ajout autre avocatAdverse morale
  var autreAvocatAdverseMorale = 1;
  $("#plus_autreContreMorale").click(function () {
    $("#autre_avocatAdverse_morale").prepend('<div class="form-group"><label class="col-sm-3 control-label">Nom & prenom <span class="symbol required"></span> :</label><div class="col-sm-8"><span class="input-icon"><input type="text" name="autres_avocats_contre_prenom_nom_' + autreAvocatAdverseMorale + '" placeholder="Nom & Prenom de l\'avocat adverse" class="form-control"><i class="fa fa-user"></i></span></div></div><div class="form-group"><label class="col-sm-3 control-label">Téléphone <span class="symbol required"></span> :</label><div class="col-sm-8"><span class="input-icon"><input type="text" name="autres_avocats_contre_tel_' + autreAvocatAdverseMorale + '" placeholder="Téléphone de l\'avocat adverse" class="form-control input-mask-phone"><i class="fa fa-phone"></i></span></div></div><div class="form-group"><label class="col-sm-3 control-label">Email <span class="symbol required"></span> :</label><div class="col-sm-8"><span class="input-icon"><input type="email" name="autres_avocats_contre_email_' + autreAvocatAdverseMorale + '" placeholder="Adresse electronique de l\'avocat adverse" class="form-control"><i class="fa fa-envelope"></i></span></div></div><br>');


    $("#titre_avocatAdverse_morale").html('<div class="form-group"><label class="col-sm-offset-4 col-sm-4 control-label text-center" for="form-field-1"><span class="text-bold">Autres avocat adverses</span></label></div>');

    $("#autreLabelContreMorale").hide();
    $("#autreRowContreMorale").removeClass("col-sm-8");
    $("#autreInputContreMorale").removeClass("col-sm-offset-1 col-sm-5 col-xs-4").addClass("col-sm-offset-8 col-sm-2");
    $("#nb_other_avocat_contre").val(autreAvocatAdverseMorale);
    autreAvocatAdverseMorale++;
  });

  function check_form(id_input,regex,msg_vide,erreur) {
    valid = true;
    if ($("#"+id_input).length === 0)
      return false;
    if($("#"+id_input).val() === "") {
      $("#"+id_input).next(".form_error").css({"color":"#FF4F4F", "display":"inline-block", "padding:":"10px"}).fadeIn().text(msg_vide);
      valid = false;
    }
    else if(!$("#"+id_input).val().match(regex)) {
      valid = false;
      $("#"+id_input).next(".form_error").css({"color":"#FF4F4F", "display":"inline-block", "padding:":"10px"}).fadeIn().text(erreur);
    }
    else
      $("#"+id_input).next(".form_error").fadeOut();
    return valid;
} 
    
 
  $("#formDossier").submit(function(event) {
    //var res = check_form("titulaire", /./ ,"Selectionner un titulaire", "");
    var res = check_form("p_type", /./ ,"Selectionner choisir un type", "");
    //res = check_form("nom_pour", /^[A-Za-z0-9ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]{2,}/,"Champ vide", "au moins 2 caracteres, chiffres et lettres") && res;
    //res = check_form("prenom_pour", /^[A-Za-z0-9ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]{2,}/,"Champ vide", "au moins 2 caracteres, chiffres et lettres") && res;
    //res = check_form("nom_contre", /^[A-Za-z0-9ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]{2,}/,"Champ vide", "au moins 2 caracteres, chiffres et lettres") && res;
    //res = check_form("prenom_contre", /^[A-Za-z0-9ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]{2,}/,"Champ vide", "au moins 2 caracteres, chiffres et lettres") && res;
    //res = check_form("denom_pour", /^[A-Za-z0-9ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]{3,}/,"Champ vide", "au moins 2 caracteres, chiffres et lettres") && res;
    //res = check_form("denom_contre", /^[A-Za-z0-9ÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ]{3,}/,"Champ vide", "au moins 2 caracteres, chiffres et lettres") && res;
    return res;
  });
  
  
    $('#nom_pour').on('input', function() {
    var id = $(this).val();
    res = find_in_tableau(tab_pour, id);

    $('input[name=clientP]').val(id);
    $('input[name=p_nom]').val(res.pp.p_nom);
    $('input[name=p_prenom]').val(res.pp.p_prenom);
    if(res.pp.p_dob != undefined){$('input[name=p_dob]').val(res.pp.p_dob);}
    $('input[name=p_pob]').val(res.pp.p_pob);
    $('input[name=p_nationalite]').val(res.pp.p_nationalite);
    $('input[name=p_profession]').val(res.pp.p_profession);
    $('input[name=pp_tel]').val(res.pp.pp_tel);
    $('input[name=pp_email]').val(res.pp.pp_email);
    $('input[name=p_domicile]').val(res.pp.p_domicile);
    $('input[name=clientM]').empty();
  });

  $('#denom_pour').on('input', function() {
    var id = $(this).val();
    res = find_in_tableau(tab_pour, id);
    
    $('input[name=clientM]').val(id);
    $('input[name=p_denomination]').val(res.pm.p_denomination);
    $('select[name=p_rs]').val(res.pm.p_rs);
    $('input[name=p_capital]').val(res.pm.p_capital);
    $('input[name=p_rccm]').val(res.pm.p_rccm);
    $('input[name=p_nif]').val(res.pm.p_nif);
    $('input[name=p_siege]').val(res.pm.p_siege);
    $('input[name=pm_tel]').val(res.pm.pm_tel);
    $('input[name=pm_email]').val(res.pm.pm_email);
    $('input[name=clientP]').empty();
  });

  $('#nom_contre').on('input', function() {
    var id = $(this).val();
    res = find_in_tableau(tab_client, id);

    $('input[name=adverseP]').val(id);
    $('input[name=c_nom]').val(res.pp.c_nom);
    $('input[name=c_prenom]').val(res.pp.c_prenom);
    if(res.pp.c_dob != undefined){$('input[name=c_dob]').val(res.pp.c_dob);}
    $('input[name=c_pob]').val(res.pp.c_pob);
    $('input[name=c_nationalite]').val(res.pp.c_nationalite);
    $('input[name=c_profession]').val(res.pp.c_profession);
    $('input[name=cp_tel]').val(res.pp.cp_tel);
    $('input[name=cp_email]').val(res.pp.cp_email);
    $('input[name=c_domicile]').val(res.pp.cp_domicile);
    $('input[name=adverseM]').empty();
  });

  $('#denom_contre').on('input', function() {
    var id = $(this).val();
    res = find_in_tableau(tab_contre, id);
    
    $('input[name=adverseM]').val(id);
    $('input[name=c_denomination]').val(res.pm.c_denomination);
    $('select[name=c_rs]').val(res.pm.c_rs);
    $('input[name=c_capital]').val(res.pm.c_capital);
    $('input[name=c_rccm]').val(res.pm.c_rccm);
    $('input[name=c_nif]').val(res.pm.c_nif);
    $('input[name=c_siege]').val(res.pm.c_siege);
    $('input[name=cm_tel]').val(res.pm.cm_tel);
    $('input[name=cm_email]').val(res.pm.cm_email);
    $('input[name=adverseP]').empty();
  });

});

function find_in_tableau(mon_tableau, id_partie){
  for(var i in mon_tableau){
    if(mon_tableau[i]._id == id_partie){
      return mon_tableau[i];
    }
  }
}