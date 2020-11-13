$(document).ready(function () {
  if(isMobile == true){
    $('tr > td > a').removeAttr('href');
    $('.dataTables_length').hide();
  }
});