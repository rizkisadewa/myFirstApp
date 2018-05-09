// File Input
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#preview').attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}

$("#odtwImg").change(function(){
  readURL(this);
});

// RATING

var $star_rating_visit = $('.star-rating-visit .fa');
var $star_rating_clean = $('.star-rating-clean .fa');
var $star_rating_money = $('.star-rating-money .fa');

var SetRatingStar = function(e) {
  return e.each(function() {
    if (parseInt(e.siblings('input.rating-value').val()) >= parseInt($(this).data('rating'))) {
      return $(this).removeClass('fa-star-o').addClass('fa-star');
    } else {
      return $(this).removeClass('fa-star').addClass('fa-star-o');
    }
  });
};

// Wort Visit Rating
$star_rating_visit.on('click', function() {
  $star_rating_visit.siblings('input.rating-value').val($(this).data('rating'));
  return SetRatingStar($star_rating_visit);
});

// Cleanliness Rating
$star_rating_clean.on('click', function() {
  $star_rating_clean.siblings('input.rating-value').val($(this).data('rating'));
  return SetRatingStar($star_rating_clean);
});

// Money Value Rating
$star_rating_money.on('click', function() {
  $star_rating_money.siblings('input.rating-value').val($(this).data('rating'));
  return SetRatingStar($star_rating_money);
});
