var SVExamples = function() {
  "use strict";
  //set variables	
  var subViewElement, subViewContent, subViewIndex;
  var runSubViews = function() {
    $(".show-calendar").off().on("click", function() {
      subViewElement = $(this);
      subViewContent = subViewElement.attr('href');
      $.subview({
        content: subViewContent,
        startFrom: "right",
        onShow: function() {
          //showCalendar();
        },
        onHide: function() {
          //destroyCalendar();
        }
      });
    });
      
    
    $(".close-subview-button").off().on("click", function(e) {
      $(".close-subviews").trigger("click");
      e.preventDefault();
    });
  };

  return {
    init: function() {
      runSubViews();
    }
  };
}();