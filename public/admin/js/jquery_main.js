$(document).ready(function(){

  // ** VALIDASI MSG BOX
  $('.msg').hide();

  function isEmail(email){
    return /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/.test(email);
  }

  $('#form').submit(function(){
    var kirim = true;
    $('input').each(function(){
      var aktif = $(this);
      var min = parseInt(aktif.attr('min'));
      var max = parseInt(aktif.attr('max'));
      var nama = aktif.attr('name');

      aktif.keyup(function(){
        $(this).removeClass('error');
        kirim = true;
      });
        var isi= aktif.val();
      // Cek kekosongan
        if(aktif.hasClass('required') && isi == ""){
          if(kirim == true) alert("Field "+nama+" harus diisi");
          aktif.addClass('error');
          kirim = false;
        }else
      // Cek angka
        if(aktif.hasClass('angka') && /^[0-9- ]*$/.test(isi) == false){
          if(kirim == true) alert("Field  "+nama+" harus diisi angka");
          aktif.addClass('error');
          kirim = false;
        }else
      // Cek huruf
        if(aktif.hasClass('huruf') && /^[a-zA-Z- ]*$/.test(isi) == false){
          if(kirim == true) alert("Field  "+nama+"  harus diisi huruf");
          aktif.addClass('error');
          kirim = false;
        }else
      // Cek text a-z atau 0-9
        if(aktif.hasClass('text') && /^[a-zA-Z0-9-]*$/.test(isi) == false){
          if(kirim == true) alert("Field  "+nama+"  hanya bisa berisi karakter a-z atau 0-9");
          aktif.addClass('error');
          kirim = false;
        }else
      // Cek email
        if(aktif.hasClass('email') && isEmail(isi) == false && isi !== ""){
          if(kirim == true) alert("Email tidak valid");
          aktif.addClass('error');
          kirim = false;
        }else
      // Cek panjang huruf
        if((aktif.hasClass('range')) && (isi.length < min || isi.length > max)){
          if(kirim == true) alert("Panjang  "+nama+" harus antara 5-10 huruf");
          aktif.addClass('error');
          kirim = false;
        }
    });
    if(kirim){
      return true;
    }else{
      $('.error:first').focus();
      return false;
    }
  });

  $('.delete-odtw').on('click', function(e){

    $target_odtw = $(e.target);
    const odtw_id = $target_odtw.attr('data-id');

    let r = confirm('Are sure would like to delete this?');

    if(r == true){
      $.ajax({
        type: 'DELETE',
        url: '/admin/odtw/data/'+odtw_id,
        success: function(response){
          alert('Spot has been deleted');
          window.location.href='/admin/odtw/data/page-1';
        },
        error: function(err){
          console.log(err);
        }
      });
    }

  });

  // delete administrator
  $('.delete-admin').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');

    $.ajax({
      type: 'DELETE',
      url: '/admin/data/'+id,
      success: function(response){
        alert('Deleting Admin');
        window.location.href='/admin/data';
      },
      error: function(err){
        console.log(err);
      }
    });
  });

});

// DELETE COUNTRY
$(document).ready(function(){
  // ** DELETE COUNTRY
  $('.delete-destination').on('click', function(e){
    $target_destination = $(e.target);
    const dest_id = $target_destination.attr('data-id');

    let r = confirm('Are sure would like to delete this one?');

    if (r == true) {
      $.ajax({
        type: 'DELETE',
        url: '/admin/destination/add/'+dest_id,
        success: function(response){
          alert('Country has been deleted');
          window.location.href='/admin/destination/add';
        },
        error: function(err){
        console.log(err);
        }
      });
    }

  });

  // delete province
  $('.delete-province').on('click', function(e){
    $target_province = $(e.target);
    const id_province = $target_province.attr('data-id');

    let r = confirm('Are sure would like to delete this?');

    if (r == true) {
      $.ajax({
        type: 'DELETE',
        url: '/admin/destination/add/province/'+id_province,
        success: function(response){
          alert('Province has been deleted');
          window.location.href='/admin/destination/add/';
        },
        error: function(err){
          console.log(err);
        }
      });
    }
  });

});


// VALIDATOR FOR ALL
$('document').ready(function(){
    $('.msg').hide();
    $('.msg-validator').hide();

    $('input').each(function(){
      var aktif = $(this);
      var min = parseInt(aktif.attr('min'));
      var max = parseInt(aktif.attr('max'));
      var submit = true;

      aktif.keyup(function(){
        $(this).removeClass('error').next().fadeOut();
        submit = true;
      });

      function isEmail(email){
        return /^([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/.test(email);
      }
      function cekValid1(isi){
      //Cek kekosongan
        if(aktif.hasClass('required') && isi == ""){
          aktif.addClass('error').next().text("Field ini harus diisi").fadeIn();
          submit = false;
        }else
      // Cek email
        if(aktif.hasClass('email') && isEmail(isi) == false && isi !== ""){
          aktif.addClass('error').next().text("Email tidak valid").fadeIn();
          submit = false;
        }else
      // Cek panjang huruf
        if((aktif.hasClass('range')) && (isi.length < min || isi.length > max)){
          aktif.addClass('error').next().text("Panjang harus antara 5-10 huruf").fadeIn();
          submit = false;
        }
      }

      function cekValid2(isi){
      // Cek angka
        if(aktif.hasClass('angka') && /^[0-9- ]*$/.test(isi) == false){
          aktif.addClass('error').next().text("Field ini harus diisi angka").fadeIn();
          submit = false;
        }else
      // Cek huruf
        if(aktif.hasClass('huruf') && /^[a-zA-Z- ]*$/.test(isi) == false){
          aktif.addClass('error').next().text("Field ini harus diisi huruf").fadeIn();
          submit = false;
        }else
      // Cek text a-z atau 0-9
        if(aktif.hasClass('text') && /^[a-zA-Z0-9-]*$/.test(isi) == false){
          aktif.addClass('error').next()
             .text("Field ini hanya bisa berisi karakter a-z atau 0-9").fadeIn();
          submit = false;
        }
        if(aktif.hasClass('check_password2').value != aktif.hasClass('check_password1').value){
          aktif.addClass('error').next()
             .text("Password tidak valid!").fadeIn();
          submit = false;
        }
      }

      aktif.focusout(function(){
        cekValid1($(this).val());
        $('.error:first').focus();
      });

      aktif.keyup(function(){
        cekValid2($(this).val());
        $('.error:first').focus();
      });

      $('#form-input').submit(function(){
        cekValid1(aktif.val());
        cekValid2(aktif.val());
        $('.error:first').focus();
        if(submit){
          return true;
        }else{
          return false;
        }
      });
    });
});
