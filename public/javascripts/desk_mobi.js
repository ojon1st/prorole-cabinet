$(document).ready(function () {
  if(isMobile == true){
    $('.dataTables_length').hidden('');
    $('tr > td > a').removeAttr('href');
  }
});