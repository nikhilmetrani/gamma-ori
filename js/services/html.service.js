module.exports.alerts = {
  Info: 'alert-info',
  Success: 'alert-success',
  Warning: 'alert-warning',
  Error: 'alert-danger'
}

module.exports.getBootstrapAlert = function (alertType, message) {
  return '<div class="alert ' + alertType + '">' + message + '</div>'
}

module.exports.getBootstrapDismisableAlert = function (alertType, message) {
  return '<div class="alert ' + alertType + ' alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>' + message + '</div>'
}
