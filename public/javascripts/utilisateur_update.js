$(document).ready(function () {
  /*var img_url = "#{user.userprofileimage}";
  if (img_url != "") {
    $("#image-preview").attr("src", img_url);
    $("#user-img-cg").attr("src", img_url);
    $(".myavatar").attr("src", img_url);
  }*/
});

function uploadavatar(file, user_id) {
  /*console.log(file)
  return;*/
  //document.getElementById('image-preview').src = window.URL.createObjectURL(file);
  var mon_image = new FormData();
  mon_image.append('avatar', file);
  
  $.ajax({
    url: '/administrateur/utilisateur/upload_photo/'+user_id,
    type: 'POST',
    data: mon_image,
    cache:false,
    processData: false, // tell jQuery not to process the data
    contentType: false, // tell jQuery not to set contentType 
  }).done(function( data ) {
      location.reload();
  })
  .fail(console.log)
};


function update_user_infos(user_infos){
  
  var route_update_utilisateur = '/administrateur/utilisateur/utilisateur_update/'+user_infos._id;
  
  var m_email = document.getElementById('m_email').value;
  var m_password = document.getElementById('m_password').value;
  var m_phone = document.getElementById('m_phone').value;
  var m_password_again = document.getElementById('m_password_again').value;
  
  var data = {};
  
  if (m_email != user_infos.email && validateEmail(m_email)){
    data.email = m_email;
  };
  
  if (m_phone != user_infos.telephone){
    data.telephone = m_phone;
  };
  
  if (m_password == m_password_again && m_password_again != "" && m_password != ""){

    if (m_password.length > 7){
      data.pswd = m_password;
    }
  };

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: route_update_utilisateur,
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

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}