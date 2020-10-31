function oui_operate(instruction, renvois){
  show_notification('info', 'Oui operation', 'Operation a titre d\'information')
}

function del_conclusion(instruction, conclusion){
  let del_url = `/dossiers/instruction/${instruction}/conclusion/${conclusion}`;
  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: del_url,
    success: function (data) {
      if(data.type_of_response == 'success'){
        show_notification(data.type_of_response, data.al_title + 'conclusion à prendre', data.al_msg);
        setTimeout(location.reload(), 5000);
      }
    }
  });
}

function del_decision(instruction){
  let del_url = `/dossiers/instruction/${instruction}/decision`;
  $.ajax({
    type: 'POST',
    contentType: 'application/json',
    url: del_url,
    success: function (data) {
      if(data.type_of_response == 'success'){
        show_notification(data.type_of_response, data.al_title + 'decision à lever', data.al_msg);
        return setTimeout(location.reload(), 5000);
      }
      if(data.type_of_response == 'warning'){
        show_notification(data.type_of_response, data.al_title + 'decision à lever', data.al_msg);
      }
    }
  });
}