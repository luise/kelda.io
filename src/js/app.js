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
}, 1000);
