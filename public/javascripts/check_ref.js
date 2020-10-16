function check_ref (ref){
  let ref_d_p = $(ref).val();
  if(ref_d_p.trim() != ''){
    $.ajax({
      type: 'GET',
      contentType: 'application/json',
      url: '/dossiers/dossier/is_ref_d_p/' + ref_d_p,
      success: function (data) {
        if(data.type_of_response == 'warning'){
          show_notification(data.type_of_response, data.al_title, data.al_msg);
          $(ref).val('');
        }
      }
    });
  }
}