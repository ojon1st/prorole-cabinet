jQuery(document).ready(function() {
  $('#client').on('input', function() {
    var id = $(this).val();
    var denom = $('#client_convention [value="' + id + '"]').data('customvalue');
    $('#valide_btn').empty();
    if(denom != undefined)
    {
      $('#client').val(denom);
      var route_tableau_sypnoptique = '/dossiers/dossier/' + id + '/found';
      $('#valide_btn').html('<a href=\' '+ route_tableau_sypnoptique +'\' class=\' btn btn-dark-beige btn-block\'><i class=\'fa fa-check fa-lg\'></i></a>');
    }
  });
});