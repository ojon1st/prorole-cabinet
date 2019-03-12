jQuery(document).ready(function () {

  //contenu du pour masque
  $("#physique_pour").hide();
  $("#morale_pour").hide();

  //affichage de donnees client personne physique
  $("#btn_physique_pour").click(function () {
    $("#p_type").val("pp");
    $("#type_pour").hide();
    $("#physique_pour").show();
    $("#tiltle_pour").text("CLIENT - PHYSIQUE");
  });

  //affichage de donnees client personne morale
  $("#btn_morale_pour").click(function () {
    $("#p_type").val("pm");
    $("#type_pour").hide();
    $("#morale_pour").show();
    $("#tiltle_pour").text("CLIENT - MORALE");
  });

  //contenu du pour masque
  $("#physique_contre").hide();
  $("#morale_contre").hide();

  //affichage de donnees client personne physique
  $("#btn_physique_contre").click(function () {
    $("#c_type").val("pp");
    $("#type_contre").hide();
    $("#physique_contre").show();
    $("#tiltle_contre").text("PARTIE ADVERSE - PHYSIQUE");
  });

  //affichage de donnees client personne morale
  $("#btn_morale_contre").click(function () {
    $("#c_type").val("pm");
    $("#type_contre").hide();
    $("#morale_contre").show();
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
    $("#type_pour").show();
    $("#morale_pour").hide();
    $("#physique_pour").hide();
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
    $("#type_contre").show();
    $("#morale_contre").hide();
    $("#physique_contre").hide();
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



});
