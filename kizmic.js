var kizmic_focus;

var kizmic = function(selector) {
  this.elem = $(selector);
  this.specCache = {};
  this.currentSpec = undefined;
  this.buffer = '';
  this.highlight_tag = $('<u>');
  this.highlight_tag.addClass('selection');
  kizmic_focus = this;
};

var kizmic_startsWith = function(characters) {
  /* return function that yeilds true for all characters beginning with 'characters' */
  var check = characters;
  function checkLeadingChars(string) {
    if (check.length == 0 || string.substring(0, check.length) == check) {
      return true;
    }
    return false;
  }
  return checkLeadingChars;
};

var kizmic_highlight = function(string, selector, wrap) {
  /* Transform "string" into "st<wrap>rin</wrap>g" */
  var pos = string.indexOf(selector);
  var head = string.substring(0, pos);
  var body = string.substring(pos, selector.length+pos);
  var tail = string.substring(selector.length+pos, string.length);
  return head + wrap.text(body)[0].outerHTML + tail;
};

kizmic.prototype.load = function(spec, alias) {
  /* store json kizmic page */
  var specObj = {keysort:[], jsonmap:{}, keyorig:[], keynow:[]};
  for ( i in spec ) {
    specObj.keyorig.push(spec[i].name);
    specObj.jsonmap[spec[i].name] = spec[i];
  }
  specObj.keysort = specObj.keyorig.slice();
  specObj.keynow = specObj.keyorig.slice();
  specObj.keysort.sort();
  this.specCache[alias] = specObj;
  this.currentSpec = alias;
};

kizmic.prototype.jump = function(alias) {
  /* switch to spec 'alias' */
  this.buffer = '';
  this.specCache[alias].keynow = this.specCache[alias].keyorig;
  this.show(alias);
};

kizmic.prototype.show = function(alias) {
  /* display keynow list for spec 'alias' */
  var spec = this.specCache[alias];
  var items = this.specCache[alias].jsonmap;
  this.currentSpec = alias;
  this.elem.empty();
  for ( var i in spec.keynow ) {
    var keyname = spec.keynow[i];
    var item = this.specCache[alias].jsonmap[keyname];
    console.log(keyname);
    var lItem = $('<div>');
    lItem.html(kizmic_highlight(item.name, this.buffer, this.highlight_tag));
    lItem.addClass(item.type);
    this.elem.append(lItem);
  }
};

kizmic.prototype.select = function() {
  /* when return key is pressed */
  var currentKey = this.specCache[this.currentSpec].keynow[0];
  var item = this.specCache[this.currentSpec].jsonmap[currentKey];
  if (item.link) {
    this.jump(item.link);
  }
};

kizmic.prototype.narrow = function(characters) {
  /* narrow original item list to just items that begin with 'characters' */
  var selection = this.specCache[this.currentSpec].keyorig.filter(kizmic_startsWith(characters));
  this.specCache[this.currentSpec].keynow = selection;
  console.log(selection);
  this.show(this.currentSpec);
};

kizmic.prototype.key = function(e) {
  /* Process keypresses */
  var keycode = e.which;
  console.log('k', e.which, e);
  if (keycode >= 32 && keycode <= 126) {
    // valid printable character
    var character = String.fromCharCode(keycode);
    this.buffer += character;
    console.log('Buffer:', this.buffer);
    this.narrow(this.buffer);
  } else if ( keycode == 3 ) {
    // CTRL-C
    this.buffer = '';
    this.narrow(this.buffer);
  } else if ( keycode == 8 ) {
    // backspace
    this.buffer = this.buffer.substring(0, this.buffer.length-1);
    this.narrow(this.buffer);
  } else if ( keycode == 13 ) {
    // return
    this.select();
  }
};

$(document).keypress(function(e) {
  kizmic_focus.key(e);
});

$(function(){
  /*
  * this swallows backspace keys on any non-input element.
  * stops backspace -> back
  */
  console.log('Blocking backspace key');
  var rx = /INPUT|SELECT|TEXTAREA/i;

  $(document).bind("keydown keypress", function(e){
    if( e.which == 8 ) { // 8 == backspace
      if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ) {
        kizmic_focus.key(e);
        e.preventDefault();
      }
    }
  });
});
