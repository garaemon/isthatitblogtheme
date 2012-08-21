// kicksontheroad.js
// title

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
      arrangeSnapbox($snapbox, true, "#container");
    });
  });

  function arrangeSnapbox($snapbox, no_masonry, container) {
    $snapbox.find("img").imagesLoaded(function() {
      var name = "";
      $snapbox.find(".tag").each(function() { //parse names
        var $a = $(this).find("a");
        var tag = $a.html();
        if (startsWith(tag, "name:")) {
          name = tag.slice(5);
          // change the link
          $snapbox.find(".imglink")
            .attr("href", $snapbox.find(".imglink").attr("href") + "?name="+ name);
        }
      });
      if (location.pathname.indexOf("/tagged/featured:") === 0) {
        var tagname = location.pathname.slice("/tagged/".length);
        var $imglink = $snapbox.find(".imglink");
        var href = $imglink.attr("href");
        var split_char = "&";
        if (href.indexOf("?") == -1)
          split_char = "?";
        $imglink.attr("href", href + split_char  + "tag="+ tagname);
      }
      else if (location.pathname.indexOf("/post") === 0) {
        var params = getParameters();
        if (params.tag) {
          var $imglink = $snapbox.find(".imglink");
          var href = $imglink.attr("href");
          var split_char = "&";
          if (href.indexOf("?") == -1)
          split_char = "?";
          $imglink.attr("href", href + split_char  + "tag="+ params.tag);
        }
      }
      var $contenthover = $('<div class="contenthover center">'
                            + name.toUpperCase() + '</div>');
      $contenthover.css("height", $(this).height());
      $contenthover.css("line-height", $(this).height() + "px");
      $(this).after($contenthover);
      $(this).contenthover({
        effect: "show"
      });
      if (!no_masonry)
        $(container).masonry("appended", $snapbox);
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
        console.log("network does not work, sorry");
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
              arrangeSnapbox($snapbox, false, "#container");
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
      url: "/tagged/" + tag + "/page/" + index,
      //url: "/page/" + index,
      success: function(data) {
        var $html = $(data);
        console.log("success to fetch the next page");
        var $snapboxes = $html.find(".snapbox");
        if ($snapboxes.length > 0) {
          $("#side-snaps-box").append($snapboxes);
          if (index == 1) {
            $snapboxes.imagesLoaded(function() {
              $("#side-snaps-box").masonry({
                columnwidth: 140,
                isAnimated: false,
                itemSelector: ".snapbox"
              });
              loadSideSnaps(tag, index + 1);
            });
            $snapboxes.each(function() {
              var $snapbox = $(this);
              arrangeSnapbox($snapbox, true, "#side-snaps-box");
            });
          }
          else {
            $snapboxes.each(function() {
              var $snapbox = $(this);
              arrangeSnapbox($snapbox, false, "#side-snaps-box");
            });
            $snapboxes.imagesLoaded(function() {
              loadSideSnaps(tag, index + 1);
            });
          }
        }
      },
      error: function() {
        console.log("sorry, network does not work");
      }
    });
  };
  
  function snapMain() {
    $(".custompage").remove();
    var params = getParameters();
    var name = decodeURI(params.name);
    if (name && name != "undefined") {
      if (!$("#snap-wrapper .captionbox h1").html()) // only if it does not have title
        $("#snap-wrapper .captionbox h1").html(name.toUpperCase());
    }
    // load side images
    var tag = null;
    if (params.tag)
      tag = params.tag;
    else if (name && name != "undefined")
      tag = "name:" + name;
    if (tag) {
      console.log("using " + tag);
      loadSideSnaps(tag, 1);
    }
  };
  
  if (location.pathname.indexOf("/post") === 0) {
    snapMain();
  }
  else if (location.pathname.indexOf("/store") === 0) {
    location.href = "http://store.kicksontheroad.com";
  }
});
