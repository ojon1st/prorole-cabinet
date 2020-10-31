function isMobile() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

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