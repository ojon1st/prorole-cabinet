$(document).ready(function () {
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  $('#calendar').fullCalendar({
    
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'basicDay, basicWeek, month'
    },
    defaultView: 'basicWeek',
    weekends: false,
    //defaultDate: '2018-03-12',
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
                var events = [];
                events =doc.events_doc;
                callback(events);
                return;
              }
          });
        },
    dayClick: function(date, allDay, jsEvent, view) {

        if (allDay) {
            // Clicked on the entire day 
            
            //if ($(jsEvent.target).is('div.fc-day-number')) {      
                // Clicked on the day number 

                $('#calendar') 
                    .fullCalendar('changeView', 'basicDay',date) 
  
           // }
        }
    },
    contentHeight: 320,
    
    eventRender: function (event, element, view) {
      /*var toolTipContent = 'This event is viewable in <b>' + event.viewableIn.join("</b> and <b>") + "</b>";*/
      var count = 0;

      if ($.inArray(view.type, event.viewableIn) == -1) {

        element.length = 0; // This is the trick to "remove" the element.
        
      }
    }
  });

});
