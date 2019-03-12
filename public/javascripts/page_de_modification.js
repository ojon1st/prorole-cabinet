function update_config(id_cabinet){
  var url = '/administrateur/configuration_du_cabinet/page_de_modification/'+id_cabinet
  var data = '';
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: url,
    success: function (data) {
      //empecher_modif();
      location.reload();
      var msg = "Vos informations personnelles on été mises à jour!";
      var title = "Mise à jour des informations personnelles";
      setTimeout(show_notification(JSON.stringify(data.type_of_response), title, msg),1000);

      return;
    }
  });
  
}