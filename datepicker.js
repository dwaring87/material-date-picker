// ================================================== //
//     DATE PICKER
// ================================================== //

let DatePicker = function(PRIMARY_COLOR="#00897b") {

  /* Lookup array for days of week */
  let weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  /* Lookup array for months */
  let month = new Array(12);
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";

  /* Flag set to true when date picker buttons are hidden */
  let DP_NO_BUTTONS = false;


  /**
   * Display the Date Picker
   * @param {Date} date Initial Date
   * @param {function} callback Selected Date callback
   * @param {Date} callback.date Selected Date
   */
  function show(date, callback) {
    _setupDatePicker(date, callback);
    $("#date-picker").animate({
      bottom: "20px",
    }, 500);
  }

  /**
   * Hide the Date Picker
   */
  function hide() {
    $("#date-picker").animate({
      bottom: "-900px",
    }, 500);
  }

  /**
   * Set Up and Display the Date Picker
   * @param {Date} selected Selected Date
   * @param {function} callback Selected Date callback(date)
   * @private
   */
  function _setupDatePicker(selected, callback) {

    // Set Header Color
    $("#date-picker-dow").css("background-color", PRIMARY_COLOR);
    $("#date-picker-month").css("background-color", PRIMARY_COLOR);
    $("#date-picker-day").css("background-color", PRIMARY_COLOR);
    $("#date-picker-year").css("background-color", PRIMARY_COLOR);

    // Set Header Values
    $("#date-picker-dow").html("<p>" + weekday[selected.getDay()] + "</p>");
    $("#date-picker-month").html("<p>" + month[selected.getMonth()].substring(0, 3) + "</p>");
    $("#date-picker-day").html("<p>" + selected.getDate() + "</p>");
    $("#date-picker-year").html("<p>" + selected.getFullYear() + "</p>");

    // Hide Header on small screens
    if ( $(window).height() < 600 ) {
      $("#date-picker-header").hide();
    }
    else {
      $("#date-picker-header").show();
    }

    // Hide Button row on even smaller screens
    if ( $(window).height() < 400 ) {
      DP_NO_BUTTONS = true;
      $("#date-picker-buttons").hide();
    }
    else {
      DP_NO_BUTTONS = false;
      $("#date-picker-buttons").show();
    }


    // Set Calendar Month
    $("#date-picker-cal-month-label").html(month[selected.getMonth()] + " " + selected.getFullYear());

    // Get the first and last days of the current month
    let firstDay = new Date(selected.getFullYear(), selected.getMonth(), 1);
    let lastDay = new Date(selected.getFullYear(), selected.getMonth() + 1, 0);

    // Get the first day of the week and the max number of days
    let firstDOW = firstDay.getDay();
    let maxDays = lastDay.getDate();


    // BUILD CALENDAR HTML
    let html = "";
    let selectedDate = selected.getDate();


    // Generate First Week
    html += "<tr>";
    for ( let i = 0; i < firstDOW; i++ ) {
      html += "<td></td>";
    }
    for ( let i = 1; i <= (7 - firstDOW); i++ ) {
      let selected = "";
      if ( i === selectedDate ) {
        selected = "selected";
      }
      html += "<td class='enabled-date " + selected + "'>" + i + "</td>";
    }
    html += "</tr>";

    // Generate the remaining weeks
    let next = 7 - firstDOW + 1;
    let counter = 0;
    for ( let i = next; i <= maxDays; i++ ) {
      if ( counter % 7 === 0 ) {
        html += "<tr>";
      }

      let selected = "";
      if ( i === selectedDate ) {
        selected = "selected";
      }
      html += "<td class='enabled-date " + selected + "'>" + i + "</td>";

      if ( counter % 7 === 6 ) {
        html += "</tr>";
      }

      counter++;
    }

    // Add empty cells in last week
    let x = counter % 7;
    if ( x > 0 ) {
      for ( let i = x; i < 7; i++ ) {
        html += "<td></td>";
        if ( i === 6 ) {
          html += "</tr>";
        }
      }
    }


    // Add HTML to tbody
    $("#date-picker-cal tbody").html(html);


    // Add td css
    $("td.enabled-date").mouseover(function() {
      $(this).not("td.selected").css("color", PRIMARY_COLOR);
      $(this).not("td.selected").css("font-weight", "bold");
    });
    $("td.enabled-date").mouseout(function() {
      $(this).not("td.selected").css("color", "#000000");
      $(this).not("td.selected").css("font-weight", "normal");
    });
    $("td.selected").css("background-color", PRIMARY_COLOR).css("color", "#ffffff");

    // Set Button Text Color
    $("#date-picker-reset-button").css("color", PRIMARY_COLOR);
    $("#date-picker-cancel-button").css("color", PRIMARY_COLOR);
    $("#date-picker-ok-button").css("color", PRIMARY_COLOR);


    // ADD CLICK LISTENERS
    $("#date-picker-cal-month-prev").off('click').on('click', function () {
      let expected = new Date(selected);
      expected.setDate(1);
      expected.setMonth(expected.getMonth() - 1);

      selected.setMonth(selected.getMonth() - 1);
      if ( selected.getMonth() > expected.getMonth() ) {
        selected.setDate(0);
      }

      _setupDatePicker(selected, callback);
    });
    $("#date-picker-cal-month-next").off('click').on('click', function () {
      let expected = new Date(selected);
      expected.setDate(1);
      expected.setMonth(expected.getMonth() + 1);

      selected.setMonth(selected.getMonth() + 1);
      if ( selected.getMonth() > expected.getMonth() ) {
        selected.setDate(0);
      }

      _setupDatePicker(selected, callback);
    });
    $("#date-picker-reset-button").off('click').on('click', function () {
      _setupDatePicker(new Date(), callback);
    });
    $("#date-picker-cancel-button").off('click').on('click', function () {
      hide();
    });
    $("#date-picker-ok-button").off('click').on('click', function () {
      hide();
      return callback(selected);
    });

    // Add td click listener
    $("td.enabled-date").click(function () {
      let date = $(this).html();
      selected.setDate(date);

      if ( DP_NO_BUTTONS === true ) {
        hide();
        return callback(selected);
      }
      else {
        _setupDatePicker(selected, callback);
      }
    });
  }


  // DatePicker return show and hide functions
  return {
    show: show,
    hide: hide
  }

};