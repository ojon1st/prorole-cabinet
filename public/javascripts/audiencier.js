$(document).ready(function () {
  
  if(isMobile == true){
    // calendar for mobile
    $('#calendar-xs').fullCalendar({
      
      header: {
        left: 'prev today next',
        center: 'title',
        right: ''
      },
      defaultView: 'basicDay',
      weekends: false,
      editable: false,
      eventLimit: true, // allow "more" link when too many events
      locale: 'fr',
      eventOrder: 'tribunalId,procedureId',
      events: function(start, end, timezone, callback) {
        jQuery.ajax({
          contentType: 'application/json',
          url: '/agenda/audiencier/get_events',
          type: 'GET',
          dataType: 'json',
          success: function(doc) {
            for(var event of doc.events_doc){
              (event.url ? event.url = '': '');
              let title = (event.title.includes('pour') == true ? event.title.split('pour'): '');
              (event.title.includes('pour') == true ? event.title = title[0]: '');
            }
            callback(doc.events_doc);
            return;
          }
        });
      },
      contentHeight: 300
    });
  }
  else{
    // calendar for desktop
    $('#calendar').fullCalendar({
      header: {
        left: 'prev today next',
        center: 'title',
        right: 'basicDay, basicWeek, month'
      },
      defaultView: 'basicWeek',
      weekends: false,
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      eventLimit: true, // allow "more" link when too many events
      locale: 'fr',
      eventOrder: 'tribunalId,procedureId',
      events: function(start, end, timezone, callback) {
        jQuery.ajax({
          contentType: 'application/json',
          url: '/agenda/audiencier/get_events',
          type: 'GET',
          dataType: 'json',
          success: function(doc) {
            callback(doc.events_doc);
            return;
          }
        });
      },
      dayClick: function(date, allDay, jsEvent, view) {
        if (allDay) { $('#calendar').fullCalendar('changeView', 'basicDay', date) }
      },
      contentHeight: 520,
      
      eventRender: function (event, element, view) {
        var count = 0;

        if ($.inArray(view.type, event.viewableIn) == -1) {
          element.length = 0; // This is the trick to "remove" the element.
        }
      }
    });
  } 
});