jQuery(document).ready(function () {
  
  
  //Instance
/*  var instance = 3;
  $("#plus_instance").click(function () {
    $("#sec_instance").append('<div class="row"><div class="col-md-1"><label class="col-sm-2 control-label text-bold">Du</label> </div><div class="col-md-2"><span class="input-icon"><input name="du_instance_' + instance + '" type="text" data-date-format="dd-mm-yyyy" data-date-viewmode="years" class="form-control date-picker" placeholder="Saisir une date"><i class="fa fa-calendar"></i></span> </div><div class="col-md-1"><label class="col-sm-2 control-label">au</label> </div><div class="col-md-2"><span class="input-icon"><input name="au_instance_' + instance + '" type="text"data-date-format="dd-mm-yyyy" data-date-viewmode="years" class="form-control date-picker" placeholder="Saisir une date"><i class="fa fa-calendar"></i></span> </div><div class="col-md-1 text-bold"><label class="col-sm-2 control-label" for="form-field-24">à</label> </div><div class="col-md-1"><span class="input-icon"><input maxlength="2" name="heure_instance_' + instance + '" type="text" class="form-control popovers" data-original-title="" data-content="Heure" data-placement="top" data-trigger="hover" onkeyup="this.value=this.value.replace(/\D/g,\'\')"><i class="fa fa-clock-o"></i></span></div><div class="col-md-4"><textarea name="texte_instance_' + instance + '" placeholder="Texte" class=" form-control"></textarea></div></div><br>');
    instance++;
  });*/

  

  $("#renvoi_instance").click(function () {
    motif = $("#motif_instance").val();
    date = $("#date_instance").val();
    if (motif == "" && date == "") {
      alert("Les champs date et motif sont importants");
    } else {
      $("#bloc_renvoi").removeClass("hidden");
      $("#liste_renvoi_instance").prepend('<div class="row"><div class="col-sm-offset-2 col-sm-9"><p>Renvoi du ' + date + ' ' + motif + '</p></div></div>');

      //vider les champs
      motif = $("#motif_instance").val("");
      date = $("#date_instance").val("");
    }
    /*$.get("EnregistrerReport.php",{motif:motif,date:date,id_dossier:id_dossier,type_hidden:type_hidden},function(dat){
    	
    });*/

  });

  $("#gestion").click(function () {
    var attrib = $("#attrib").val();
    var enjeu = $("#enjeu").val();
    var gain_perte = $('input[type=radio][name=gain_perte]:checked').attr('value');
    var resume = $("#resume").val();

    if (attrib != "" || enjeu != "" || gain_perte != "" || resume != "") {
      $("#attrib").prop('readonly', true);
      $("#enjeu").prop('readonly', true);
      $("#resume").prop('readonly', true);

      if (gain_perte != "") {
        if (gain_perte == "gain") {
          $("#gain_perte").addClass("hidden");
          $("#label_gain_perte").html(gain_perte);
          $("#gain_perte_value").removeClass("hidden");
        } else {
          $("#gain_perte").addClass("hidden");
          $("#label_gain_perte").html(gain_perte);
          $("#gain_perte_value").removeClass("hidden");
        }
      }


      $("#gestion").addClass("hidden");
      $("#gestionUpdateShow").removeClass("hidden");
    } else {
      alert("Veuillez remplir au moins un champs");
    }
  });

  $("#gestionUpdateShow").click(function () {
    $("#attrib").prop('readonly', false);
    $("#enjeu").prop('readonly', false);
    $("#gain").prop('readonly', false);
    $("#perte").prop('readonly', false);
    $("#resume").prop('readonly', false);

    $("#gain_perte").removeClass("hidden");
    $("#label_gain_perte").html();
    $("#gain_perte_value").addClass("hidden");

    $("#gestionUpdateShow").addClass("hidden");
    $("#gestionUpdate").removeClass("hidden");

  });

  $("#gestionUpdate").click(function () {
    var attrib = $("#attrib").val();
    var enjeu = $("#enjeu").val();
    var gain_perte = $('input[type=radio][name=gain_perte]:checked').attr('value');
    var resume = $("#resume").val();

    if (attrib != "" || enjeu != "" || gain_perte != "" || resume != "") {
      $("#attrib").prop('readonly', true);
      $("#enjeu").prop('readonly', true);
      $("#resume").prop('readonly', true);

      if (gain_perte != "") {
        if (gain_perte == "gain") {
          $("#gain_perte").addClass("hidden");
          $("#label_gain_perte").html(gain_perte);
          $("#gain_perte_value").removeClass("hidden");
        } else {
          $("#gain_perte").addClass("hidden");
          $("#label_gain_perte").html(gain_perte);
          $("#gain_perte_value").removeClass("hidden");
        }
      }

      $("#gestion").addClass("hidden");
      $("#gestionUpdate").addClass("hidden");
      $("#gestionUpdateShow").removeClass("hidden");
    } else {
      alert("Veuillez remplir au moins un champs");
    }
  });
  
  
  
});

