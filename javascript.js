$('.filter').click(function(e) {
    e.preventDefault();
    var filter = $(this).attr('data-filter');
    $('#import').removeClass('active');
    $(this).addClass('active').removeClass('active');
    $('.filter-value').hide();
    $('div[data-filter-value*=' + filter + ']').show();
});