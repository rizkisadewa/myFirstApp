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

  // //**GET DATA OBJECT OPTION
  //
  // $('.odtw_opt').on('click', function(e){
  //   console.log($(e.target));
  //   $target_odtw_opt = $(e.target).removeClass("btn btn-success btn-xs odtw_opt").addClass("btn btn-danger btn-xs odtw_opt_del").text("Hapus Pilihan");
  //   const odtw_opt_id = $target_odtw_opt.parents("tr");
  //   console.log(odtw_opt_id);
  //
  //   // change the buton
  //
  //
  //   // insert to target chosen
  //   $("#target-chosen").append(odtw_opt_id.clone(true));
  //   // odtw_opt_id.remove();
  //   e.preventDefault();
  //
  // });
  //
  // //**GET DATA OBJECT CHOSEN
  // $('.odtw_opt_del').on('click', function(){
  //
  //   alert("Hello");
  //
  //
  //   $target_odtw_del = $(e.target);
  //   const odtw_odtw_del = $target_odtw_del.parents("tr");
  //
  //   // change the Button
  //   $target_odtw_del.removeClass("btn btn-danger btn-xs odtw_opt_del").addClass("btn btn-success btn-xs odtw_opt").text("Pilih");
  //
  //   // put back to the cart
  //   $("#cart-target").append(odtw_opt_del.clone(true));
  //   odtw_opt_del.remove();
  //   e.preventDefault();
  //
  //
  // });

});
