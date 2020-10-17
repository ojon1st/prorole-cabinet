$(document).ready(function () {
  if(isMobile == true){
    let params = document.getElementsByClassName('hid-mobile');
    while(params[0]){
      params[0].parentNode.removeChild(params[0]);
    }
  }
});