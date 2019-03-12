
function get_profil_list(){
  var la_route = '/administrateur/utilisateurs/profils_list'; 
  var data = {};
  
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: la_route,
    success: function (data) {
      $('#profil').html('');
      $('#profil').append(new Option("", null));
      data.list_profils.forEach( function(profil){
        $('#profil').append(new Option(profil.nom_profil, profil._id));
      });
      
      return;
    }
  });
  
}


function create_new_utilisateur(){
  /*alert('ok');
  return*/
  var la_route = '/administrateur/utilisateurs/utilisateur_create'; 
  var data = {};
  data.u_pseudo= $('input[name=u_pseudo]').val();
  data.u_nom= $('input[name=u_nom]').val();
  data.u_prenom= $('input[name=u_prenom]').val();
  data.u_profil= $('select[name=u_profil]').val();
  data.u_telephone= $('input[name=u_telephone]').val();
  data.u_email= $('input[name=u_email]').val();
  data.u_taux_horaire= $('input[name=u_taux_horaire]').val();
  data.u_retro_commission= $('input[name=u_retro_commission]').val();
  data.u_pwd = $('input[name=u_pwd]').val();
  data.u_pwd2 = $('input[name=u_pwd2]').val();
  
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: la_route,
    success: function (data) {
          location.reload();
      return;
    }
  });
  
}