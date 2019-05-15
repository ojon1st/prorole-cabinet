jQuery(document).ready(function() {
  
});

function serach_autorized(champ) {
  var select_value = champ.value;
  var route_tableau_sypnoptique = '/dossiers/dossier/' + select_value + '/found';
  if(select_value != null && select_value != 'null')
  {
    $('#valide_btn').empty();
    $('#valide_btn').html('<a href=\' '+ route_tableau_sypnoptique +'\' class=\' btn btn-light-azure btn-block\'><i class=\'fa fa-search fa-lg\'></i></a>');
  }
  else
  {
    $('#valide_btn').empty();
  }
}