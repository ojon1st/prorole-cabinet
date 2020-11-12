$(document).ready(function (){
  $('#sample-table-2').dataTable({
    "aoColumnDefs" : [{
      "aTargets" : [3]
    }],
    "order": [[3, "desc"]],
    "oLanguage" : {
      "sLengthMenu" : "Voir _MENU_ lignes",
      "sSearch" : "",
      "oPaginate" : {
        "sPrevious" : "",
        "sNext" : ""
      }
    },
    //"aaSorting" : [[1, 'desc']],
    "aLengthMenu" : [[100, -1], [100, "All"] // change per page values here
    ],
    // set the initial value
    "iDisplayLength" : 100,
  });
  
  $('#sample-table-2_wrapper .dataTables_filter input').addClass("form-control input-sm").attr("placeholder", "Rechercher");
  // modify table search input
  
  // initialzie select2 dropdown
  $('#sample-table-2_column_toggler input[type="checkbox"]').on('change',function() {
    /* Get the DataTables object again - this is not a recreation, just a get of the object */
    var iCol = parseInt($(this).attr("data-column"));
    var bVis = oTable.fnSettings().aoColumns[iCol].bVisible;
    oTable.fnSetColumnVis(iCol, ( bVis ? false : true));
  });
});