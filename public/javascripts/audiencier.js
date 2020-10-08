$(document).on('ready', function () {
  var events = [];
  jQuery.ajax({
    contentType: 'application/json',
    url: '/agenda/audiencier/get_events',
    type: 'GET',
    dataType: 'json',
    success: function(doc) {
      events = doc.events_doc;
    }
  });
  
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
      callback(events);
      return;
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
      for(var event of events){
        (event.url ? event.url = '': '');
      }
      callback(events);
      return;
    },
    contentHeight: 300
  });
});


