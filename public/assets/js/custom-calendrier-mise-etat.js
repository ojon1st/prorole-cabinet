jQuery(document).ready(function () {
  
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
  
  $(".cacher").hide();
  
});

