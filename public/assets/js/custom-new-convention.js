jQuery(document).ready(function() {
	//ajout hypothese de litige de creance
	var creance = 4;
	$("#plus_creance").click(function()
	{
		$("#sec_creance").append('<div class="row"><label class="col-sm-2 control-label" for="form-field-24">Hypothèse '+creance+' <span class="symbol required"></span> : </label><div class="col-md-1"><label class="col-sm-2 control-label" for="form-field-24">De</label> </div><div class="col-md-1"><input type="text" name="de_creance_'+creance+'" placeholder="De" class="form-control popovers" data-original-title="" data-content="Nombre" data-placement="top" data-trigger="hover" onkeyup="this.value=this.value.replace(/\D/g,\'\')"></div><div class="col-md-1"><label class="col-sm-2 control-label" for="form-field-24">à</label> </div><div class="col-md-2"><input type="text" name="a_creance_'+creance+'" placeholder="A" class="form-control popovers" data-original-title="" data-content="Nombre" data-placement="top" data-trigger="hover" onkeyup="this.value=this.value.replace(/\D/g,\'\')"></div><div class="col-md-1 text-bold"><label class="col-sm-2 control-label" for="form-field-24">Montant</label> </div><div class="col-md-offset-1 col-md-2"><div class="input-group"><input type="text" name="pcent_creance_'+creance+'" placeholder="%" class="form-control popovers" data-original-title="" data-content="Nombre" data-placement="top" data-trigger="hover" onkeyup="this.value=this.value.replace(/\D/g,\'\')"><span class="input-group-addon">%</span></div></div></div><br>');
		creance++;
	});

	//ajout hypothese de litige de condamnation
	var condamnation = 4;
	$("#plus_condamnation").click(function()
	{
		$("#sec_condamnation").append('<div class="row"><label class="col-sm-2 control-label" for="form-field-24">Hypothèse '+condamnation+' <span class="symbol required"></span> : </label><div class="col-md-1"><label class="col-sm-2 control-label" for="form-field-24">De</label> </div><div class="col-md-1"><input type="text" name="de_condamne_'+condamnation+'" placeholder="De" class="form-control popovers" data-original-title="" data-content="Nombre" data-placement="top" data-trigger="hover" onkeyup="this.value=this.value.replace(/\D/g,\'\')"></div><div class="col-md-1"><label class="col-sm-2 control-label" for="form-field-24">à</label> </div><div class="col-md-2"><input type="text" name="a_condamne_'+condamnation+'" placeholder="A" class="form-control popovers" data-original-title="" data-content="Nombre" data-placement="top" data-trigger="hover" onkeyup="this.value=this.value.replace(/\D/g,\'\')"></div><div class="col-md-1 text-bold"><label class="col-sm-2 control-label" for="form-field-24">Montant</label> </div><div class="col-md-offset-1 col-md-2"><div class="input-group"><input type="text" name="pcent_condamne_'+condamnation+'" placeholder="%" class="form-control popovers" data-original-title="" data-content="Nombre" data-placement="top" data-trigger="hover" onkeyup="this.value=this.value.replace(/\D/g,\'\')"><span class="input-group-addon">%</span></div></div></div><br>');
		condamnation++;
	});
});