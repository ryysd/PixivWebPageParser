// Generated by CoffeeScript 1.6.3
var Debug, PixivAPI, PixivBookmarklet, PixivParser, PixivURL, test;

Debug = (function() {
  function Debug() {}

  Debug.print = function(html) {
    return ($('html')).html(html);
  };

  return Debug;

})();

PixivURL = (function() {
  function PixivURL() {}

  PixivURL.host = 'http://www.pixiv.net';

  PixivURL.actions = {
    login: 'login.php',
    bookmark: 'bookmark.php',
    memberIllust: 'member_illust.php'
  };

  PixivURL.makeURL = function(action) {
    return "" + this.host + "/" + this.actions[action];
  };

  return PixivURL;

})();

/*
class PixivReader
  constructor: (@id, @pass) ->

  get: (action, data, callback) ->
    jqxhr = $.get (PixivURL.makeURL action), data, () -> (callback jqxhr)

  post: (action, data, callback) ->
    jqxhr = $.post (PixivURL.makeURL action), data, () -> (callback jqxhr)

  login: (callback) ->
    @post 'login', {pixiv_id: @id, pass: @pass, mode: 'login', 'skip': '0'}, callback

  getBookmarkPage: (callback, options) ->
    data = {}

    if options?
      data.rest = if options.hidden? then 'hide' else 'show'
      data.p = options.page if options.page?

    @post 'bookmark', data, callback

  getIllustPage: (id, callback) ->
    $.ajax({
      type : 'GET'
      url : PixivURL.makeURL 'memberIllust'
      data : {mode: 'big', illust_id: id}
      beforeSend : (jqxhr)  -> jqxhr.setRequestHeader 'Referer', PixivURL.host
      complete : callback 
    })
*/


PixivParser = (function() {
  function PixivParser() {}

  PixivParser.parseBookmarkPage = function(html) {
    var $count, $illusts, $next, $page, $prev, count, illust, illusts;
    $page = $(html);
    $count = ($page.find('.column-label')).find('.count-badge');
    $illusts = ($page.find('.display_works')).find('li');
    $next = $page.find('.sprites-next-linked');
    $prev = $page.find('.sprites-prev-linked');
    count = parseInt($count.text());
    illusts = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = $illusts.length; _i < _len; _i++) {
        illust = $illusts[_i];
        if ((($(illust)).find('img')).length) {
          _results.push({
            id: (($(illust)).attr('id')).replace('li_', ''),
            title: (($(illust)).find('.work')).text(),
            tags: (($(illust)).find('img')).attr('data-tags')
          });
        }
      }
      return _results;
    })();
    return {
      count: count,
      illusts: illusts,
      hasNext: $next.length !== 0,
      hasPrev: $prev.length !== 0
    };
  };

  return PixivParser;

})();

PixivAPI = (function() {
  function PixivAPI(id, pass) {
    this.reader = new PixivReader(id, pass);
  }

  PixivAPI.prototype.login = function(callback) {
    return this.reader.login(callback);
  };

  PixivAPI.prototype.getBookmarkIllusts = function(hidden, callback) {};

  return PixivAPI;

})();

PixivBookmarklet = (function() {
  function PixivBookmarklet() {}

  PixivBookmarklet.isBookmarkPage = function() {
    return location.href.indexOf(PixivURL.makeURL('bookmark')) !== -1;
  };

  PixivBookmarklet.isMemberIllustPage = function() {
    return location.href.indexOf(PixivURL.makeURL('bookmark')) !== -1;
  };

  return PixivBookmarklet;

})();

$(function() {
  var illusts;
  if (PixivBookmarklet.isBookmarkPage()) {
    illusts = PixivParser.parseBookmarkPage(document);
    return console.log(illusts);
  }
});

test = function(id, pass) {
  var reader;
  reader = new PixivReader(id, pass);
  return reader.login(function(jq) {
    var bookmark;
    return bookmark = reader.getIllustPage('39909714', function(jqxhr) {
      return Debug.print(jqxhr.responseText);
    });
  });
};