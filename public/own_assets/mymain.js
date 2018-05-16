$(document).ready(function(){

  $(window).scroll(function(){
		if($(this).scrollTop() > 200){
			  $('#to-top').fadeIn();
		}else{
		  $('#to-top').fadeOut();
		}
	});

  $('#to-top').click(function(){
	   $('html, body').animate({scrollTop:0},600);
	    return false;
	});

  // Modal for Front Ent
  $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  });

  // get the data from selection
  $('#mapStarted').on('click', function(e){
    var map_id = $('#map-destination').val();

    // alert(map_id); // debug to get data
    window.location.href='/TravelTo/'+map_id;

  });


  // Setup the "Move Me" links
  $(".rowLink").click(function () {

    // CHANGE BUTTON
    if ($(this).hasClass('btn-success')) {
      $(this).removeClass("btn btn-success btn-xs odtw_opt").addClass("btn btn-danger btn-xs odtw_opt_del").text("Hapus Pilihan");
    } else {
      $(this).removeClass("btn btn-danger btn-xs odtw_opt_del").addClass("btn btn-success btn-xs odtw_opt").text("Pilih");
    }


      // get the row containing this link

      var row = $(this).closest("tr");

      // find out in which table it resides
      var table = $(this).closest("table");
      console.log(table);

      // move it
      row.detach();
      console.log(table.is("#cart-target"));
      console.log(table.is("#target-chosen"));

      if ($(this).hasClass('btn-danger')) {
        $("#target-chosen").append(row);
      } else {
        $("#cart-target").append(row);

      }
      // draw the user's attention to it
      row.fadeOut();
      row.fadeIn();

    });


    // GET POINTER
    $(".odtw_opt").click(function () {
      // alert("Test");
    });

});
