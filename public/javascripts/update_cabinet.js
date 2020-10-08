function check_char(input){
  let pswd = input.value;
  if(pswd.length < 8){
    input.value = '';
  }
}

function compare(){
  let pswd = $('input[name=password]').val();
  if(pswd.trim() != ''){
    let confirm = $('input[name=confirm]').val();
    if(pswd.trim() != confirm.trim()){
      $('input[name=password]').val('');
      $('input[name=confirm]').val('');
    }
  }
  else{
    $('input[name=confirm]').val('');
  }
}