function show_notification(shortCutFunction, title, msg) {
  var $timeOut = 5000;
  var $showEasing = "swing";
  var $hideEasing = "linear";
  var $showMethod = "fadeIn";
  var $hideMethod = "fadeOut";

  toastr.options = {
    closeButton: true,
    positionClass: 'toast-top-right',
    onclick: null
  };
  var $toast = toastr[shortCutFunction](msg, title);
}

function login_error (){
  if(window.location.search){
    show_notification('warning', 'Connexion à votre compte', 'La combinaison identifiant & mot de passe est incorrect, veuillez revoir vos identifiants');
  }
}