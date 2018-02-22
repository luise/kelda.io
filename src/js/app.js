new Clipboard('.btn-copy');
new Clipboard('.hero pre');

tippy('.tooltip', {
  animation: 'shift-toward',
  arrow: true,
  followCursor: true
})

setTimeout(function(){
  new Typed('#animated-code', {
    stringsElement: '#top-code',
    contentType: 'html',
    showCursor: false
  });
}, 100);

new Sticky('.sticky');

// turn sticky header white on scroll
function atTop() {
  if ($(window).scrollTop() === 0) {
    return true;
  } else {
    return false;
  }
}

function brightenHeader() {
  if (atTop()) {
    $('#header').removeClass('light');
  } else {
    $('#header').addClass('light');
  }
}

brightenHeader();

$(window).on('scroll', brightenHeader);
