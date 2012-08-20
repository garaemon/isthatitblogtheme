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
          $snapbox.find(".imglink")
            .attr("href", $snapbox.find(".imglink").attr("href") + "&name="+ name);
        }
        if (startsWith(tag, "tag:")) {
          var tag_feature = tag.slice(5);
          // change the link
          $snapbox.find(".imglink")
            .attr("href", $snapbox.find(".imglink").attr("href") + "&tag="+ tag_feature);
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
      if (!no_masonry)
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
      $(window).bottom({
        proximity: 0.1
      });
    }
  }

  function loadNextPage(id) {
    console.log("access to /page/" + (id + 1));
    var url = "/page/" + (id + 1);
    if (location.pathname != "/")
      url = location.pathname + url;
    $.ajax({
      type: "GET",
      url: url,
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

  function getParameters() {
    var splitted_row_params = [];
    var splitted_params = {};
    var q_splitted_params = location.search.split("?");
    if (q_splitted_params.length > 1) {
      splitted_row_params = q_splitted_params[1].split("&");
    }
    for (var i = 0; i < splitted_row_params.length; i++) {
      var params = splitted_row_params[i];
      splitted_params[params.split("=")[0]] = params.split("=")[1];
    }
    return splitted_params;
  };

  function loadSideSnaps(tag, index) {
    console.log("try to fetch /tagged/" + tag);
    $.ajax({
      type: "GET",
      url: "/tagged/" + tag,
      success: function(data) {
        var $html = $(data);
        console.log("success to fetch the next page");
        var $snapboxes = $html.find(".snapbox");
        if ($snapboxes.length > 0) {
          $("#side-snaps").append($snapboxes);
          $snapboxes.each(function() {
            var $snapbox = $(this);
            $snapbox.imagesLoaded(function() {
              $("#side-snaps").masonry("appended", $snapbox);
            });
          });
                          
        }
      },
      error: function() {
        alert("sorry, network does not work");
      }
    });
  };
  
  function snapMain() {
    var params = getParameters();
    var photoURL = params.photoURL;
    var name = decodeURI(params.name);
    var $img = $('<img src="' + photoURL + '"/>');
    if (name) {
      var $caption = $('<h1>' + name + '</h1>'
                       + '<a href="/store" target="_blank"><h2>SHOP NOW></h2></a>');
      $("#snap-wrapper .captionbox").prepend($caption);
    }
    $img.addClass("snapimage");
    $("#snap-wrapper #contentbox").prepend($img);
    // load side images
    var tag = null;
    if (params.tag)
      tag = "tag:" + params.tag;
    else if (name)
      tag = "name:" + name;
    if (tag) {
      console.log("using " + tag);
      $("#side-snaps").masonry({
        columnwidth: 140,
        isAnimated: false,
        itemSelector: ".snapbox"
      });
      loadSideSnaps(tag, 1);
    }
  };
  
  // /snap?photoURL=...
  if (location.pathname.indexOf("/snap") === 0) {
    snapMain();
  }
  
});
