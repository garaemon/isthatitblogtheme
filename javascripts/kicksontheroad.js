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
  
  $("#container").imagesLoaded(function() {
    $(this).masonry({
      columnwidth: 320,
      isAnimated: false,
      itemSelector: ".snapbox"
    });
    $(".snapbox").each(function() {
      var $snapbox = $(this);
      arrangeSnapbox($snapbox, true);
    });
  });

  function arrangeSnapbox($snapbox, no_masonry) {
    $snapbox.find("img").imagesLoaded(function() {
      var name = "";
      $snapbox.find(".tag").each(function() { //parse names
        var $a = $(this).find("a");
        var tag = $a.html();
        if (startsWith(tag, "name:")) {
          name = tag.slice(5);
          // change the link
          $snapbox.find(".imglink").attr("href", "/tagged/" + tag);
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
      if (no_masonry)
        $("#container").masonry("appended", $snapbox);
    });
 };
  
  if($("#loading").length > 0) { //only support in index page
    if ($.isMobile()) {
      $(window).bottom({
        proximity: 0.3
      });
    }
    else {
      $(window).bottom();
    }
  }

  function loadNextPage(id) {
    console.log("access to /page/" + (id + 1));
    $.ajax({
      type: "GET",
      url: "/page/" + (id + 1),
      error: function() {
        alert("network does not work, sorry");
      },
      success: function(data) {
        console.log("success to fetch the next page");
        var $html = $(data);
        var $snapboxes = $html.find(".snapbox");
        if ($snapboxes.length > 0) {
          $("#container").append($snapboxes);
          loaded_index = loaded_index + 1;
          $snapboxes.imagesLoaded(function() {
            console.log("images are loaded at " + loaded_index);
            bottom_lock = false;
          });
          $snapboxes.each(function() {
            var $snapbox = $(this);
            $snapbox.imagesLoaded(function() {
              console.log("loaded");
              arrangeSnapbox($snapbox);
            });
          });
        }
        else {
          console.log("done");
          $("#loading").remove();
        }
      }
    });
  };
  
  var bottom_lock = false;
  var loaded_index = 0;
  $(window).bind("bottom", function() {
    if (!bottom_lock) {
      console.log("bottom event fired");
      bottom_lock = true;
      loadNextPage(loaded_index + 1);
    }
  });
});
