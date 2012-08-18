// kicksontheroad.js
// title
$(function() {
  $("#title-wrapper .fb-like")
    .css("left", screen.width / 2 + 285)
    .css("top", 60);
});

$(function() {
  // util
  function startsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
  };
  function endsWith(str, suffix) {
    return str.match(suffix+"$") == suffix;
  };
  
  $(".snapbox").each(function() {
    var $snapbox = $(this);
    $(this).find("img").imagesLoaded(function() {
      var name = "";
      $snapbox.find(".tag").each(function() { //parse names
        var $a = $(this).find("a");
        var tag = $a.html();
        if (startsWith(tag, "name:")) {
          name = tag.slice(5);
        }
      });
      var $contenthover = $('<div class="contenthover center">'
                            + name.toUpperCase() + '</div>');
      $contenthover.css("height", $(this).height());
      $contenthover.css("line-height", $(this).height() + "px");
      $(this).after($contenthover);
      $(this).contenthover({
        effect: "show"
      });
    });
  });
});
