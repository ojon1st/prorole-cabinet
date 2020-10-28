window.checkCell = function (cell){
  let cellule = $(cell).val();
  if(cellule.trim() == '' || cellule.trim() == 'null'){
    $(cell).css('backgroundColor', '#ccc').val('');
  }
  else{
    $(cell).css('backgroundColor', '#fff');
  }
}

//Validate
window.creation = function creation(){
  let p_nom = $('#p_nom').val();
  (p_nom.trim() == '' ? $('#p_nom').css('backgroundColor', '#ccc'): '');
  let c_nom = $('#c_nom').val();
  (c_nom.trim() == '' ? $('#c_nom').css('backgroundColor', '#ccc'): '');
  if(p_nom.trim() != "" && c_nom.trim() != ""){
    let data = [];
    let ref_d_p = $('#ref_d_p').val();
    data.push({
      ref_d_p: ref_d_p,
      p_nom: $('#p_nom').val(),
      p_tel: $('#p_tel').val(),
      p_email: $('#p_email').val(),
      c_nom: $('#c_nom').val(),
      c_tel: $('#c_tel').val(),
      c_email: $('#c_email').val()
    });
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/dossiers/dossier/create',
      success: function(doc) {
        if(doc.type_of_response == 'success'){
          window.location.href = "/dossiers";
        }
      }
    });
  }
}