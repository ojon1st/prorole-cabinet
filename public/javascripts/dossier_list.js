jQuery(document).ready(function() {
  $('#valide_btn').click(function(){
    var data = $('select[name=client]').val();
    //var route_tableau_sypnoptique = '/dossiers/dossier/' + data + '/found';
    window.location.href='/dossiers/dossier/' + data + '/found';
    /*$.ajax({
      type: 'GET',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: route_tableau_sypnoptique,
      success: function (data) {
        var client = 0;
        $('#client').html('');
        var parties
        data.list_dossiers.forEach(function (doc) {
          console.log(ref_d);
          /*if(dossiers.pour.p_type == 'pp' && dossiers.contre.c_type == 'pp')
          {
            parties = dossiers.pour.pp.p_prenom + ' '  + dossiers.pour.pp.p_nom + ' c/ ' + dossiers.contre.pp.c_prenom + ' ' + dossiers.contre.pp.c_nom;
          }
          if(dossiers.pour.p_type == 'pp' && dossiers.contre.c_type == 'pm')
          {
            parties = dossiers.pour.pp.p_prenom + ' '  + dossiers.pour.pp.p_nom + ' c/ ' + dossiers.contre.pm.c_denomination;
          }
          if(dossiers.pour.p_type == 'pm' && dossiers.contre.c_type == 'pp')
          {
            parties = dossiers.pour.pm.p_denomination + ' c/ ' + dossiers.contre.pp.c_prenom + ' ' + dossiers.contre.pp.c_nom;
          }
          if(dossiers.pour.p_type == 'pm' && dossiers.contre.c_type == 'pn')
          {
            parties = dossiers.pour.pm.p_denomination + ' c/ ' + dossiers.contre.pm.c_denomination;
          }
          $('#client').append('<tr> <td>' + client + '</td><td> ' + dossiers.ref_d + ' </td><td><a class=\'button\' href=\'/dossiers/dossier/' +dossiers._id + '\'> ' + parties + ' </a></td></tr>');
          client++;
        });
      }
    });*/
  });
});

function serach_autorized(champ) {
  var select_value = champ.value;
  if(select_value != null && select_value != 'null')
  {
    $('#valide_select').removeClass('hidden');
  }
  else
  {
    $('#valide_select').addClass('hidden');
  }
}