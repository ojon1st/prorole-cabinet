exports.pour_update = [
  // Process request after validation and sanitization.
  (req, res, next) => {
    if('client' in req) {
      req.client.updateOne({
        p_nom: req.body.p_nom,
        p_tel:req.body.p_tel,
        p_email: req.body.p_email
      }, function(err) {
        if(err) {
          console.log(err)
        }
        console.log('CLIENT UPDATED');
        return res.redirect('/dossiers/dossier/'+req.body.dossier_id);
      })
      .catch(console.log);
    }
  }

];

exports.contre_update = [
  // Process request after validation and sanitization.
  (req, res, next) => {
    if('contre' in req) {
      req.contre.updateOne({
        c_nom: req.body.c_nom,
        c_tel:req.body.c_tel,
        c_email: req.body.c_email
      }, function(err) {
        if(err) {
          console.log(err)
        }
        console.log('CONTRE UPDATED');
        return res.redirect('/dossiers/dossier/'+req.body.dossier_id);
      })
      .catch(console.log);
    }
  }

];