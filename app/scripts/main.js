$(() => {
  console.log('hullo')
  // Hide all glowing
  $('.glow').hide();
  var items = ['tree', 'forest', 'bridge'];
  var $arrow = $('#arrow');
  for(var item of items) {
    // closurize
    (() => {
      var what = item;
      $(`#${what}-area`).mouseenter(() => {
        $('#doramapimg').attr('src', `/images/bg_${what}_glow.png`);
        $(`#${what}-text`).show();
        $arrow.show();
      }).mouseleave(() => {
        $('#doramapimg').attr('src', '/images/bg.png')
        $(`#${what}-text`).hide();
        $arrow.hide();
      });
    })()
  }

  $('#tree-area').click(() => {
    $('#poster-modal').modal();
  }).mouseenter(() => {
    $arrow.css('transform', 'rotate(20deg)');
    $arrow.css('left', '500px');
    $arrow.css('top', '120px');
    $arrow.show();
  });

  $('#bridge-area').click(() => {
    $('#mapview').hide();
    commenceTheMemory();
  }).mouseenter(() => {
    $arrow.css('transform', 'rotate(0deg)');
    $arrow.css('left', '108px');
    $arrow.css('top', '560px');
  });

  $('#forest-area').mouseenter(() => {
    $arrow.css('transform', 'rotate(210deg)');
    $arrow.css('left', '700px');
    $arrow.css('top', '350px');
  });

  // $('#poster-modal').modal();
  $('#skip').click(() => {
    $('#videoview').hide();
    $('#mapview').show();
  });

  $('.quit-memory').click(() => {
    $('#memoryview').hide();
    $('#mapview').show();
  })

  $('#videoview').hide();
  $('#mapview').show();
  // commenceTheMemory();
});
