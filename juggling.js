/*
 * TODO:
 */

dojo.require ('dojo.window');
dojo.require ('dojox.gfx');

dojo.addOnLoad (function () {
  if (dojox.gfx.renderer == "vml") {
    dojo.byId('warnings').innerHTML = '<i>You are using Internet Explorer ' +
      'without Silverlight installed, which forces poor rendering via VML.  ' +
      'This web application will therefore run very slow, and lines will be ' +
      'rendered imprecisely and ugly.  Please install ' +
      '<A HREF="http://www.microsoft.com/getsilverlight/">Silverlight</A>, ' +
      'or use another browser like Chrome, Firefox, or Safari.</i>';
    dojo.byId('warnings').style.display = 'block';
  }
  if (navigator.userAgent.toLowerCase().indexOf('android') >= 0) {
    dojo.byId('warnings').innerHTML = '<i>You seem to be using Android, ' +
      'which currently seems unable to animate the animated font.  ' +
      'Try a desktop browser for the full experience.</i>';
    dojo.byId('warnings').style.display = 'block';
  }

  function update_text_soon (event) {
    setTimeout (update_text, 0);
    return true;
  }
  dojo.forEach (['oninput', 'onpropertychange', 'keyup'], function (event) {
    dojo.connect (dojo.byId ('text'), event, update_text_soon);
  });
  dojo.connect (dojo.byId ('traj'), 'onclick', update_text_soon);
  dojo.connect (dojo.byId ('anim'), 'onclick', update_text_soon);

  dojo.connect (window, 'onresize', resize);
  surface = dojox.gfx.createSurface (dojo.byId ('surface'), 800, 600);

  // Parse query part of URL (based on http://bugs.dojotoolkit.org/ticket/7384)
  var q = dojo.queryToObject ((new dojo._Url (document.location)).query || ''); 
  if ('text' in q)
    dojo.byId ('text').value = q.text;
  if ('traj' in q)
    dojo.byId ('traj').checked = parseInt (q.traj);
  if ('anim' in q)
    dojo.byId ('anim').checked = parseInt (q.anim);

  update_text ();
});

var oldText, oldTraj, oldAnim;
var surface, group, xsize, ysize, linesize;
var char_space = 3;
var line_space = 10;
var margin = 2 * 1;  // 1 = stroke width
var target_height = 96;  // 4 circles

function update_text (force) {
  var traj = dojo.byId ('traj').checked;
  var anim = dojo.byId ('anim').checked;
  var text = dojo.byId ('text').value;
  playing = 0;

  // Formulate link to self.
  var query = {text: text};
  if (traj)
    query.traj = 1;
  else
    query.traj = 0;
  if (anim)
    query.anim = 1;
  else
    query.anim = 0;
  dojo.byId ('textlink').innerHTML = '[<A HREF="?' +
    dojo.objectToQuery (query) + '">link</A>]';

  if (!force && text == oldText && traj == oldTraj && anim == oldAnim) return;
  oldTraj = traj;
  oldAnim = anim;

  surface.clear ();

  group = surface.createGroup ();
  xsize = 0;
  var y = 0;
  linesize = 0;
  dojo.forEach (text.split ('\n'), function (line) {
    var x = 0, line_height = target_height; //0;
    dojo.forEach (line, function (char) {
      /*
      if (char == '/') {
        after = !after;
        return;
      }
      */
      var fontchar = font[char.toUpperCase ()];
      if (!fontchar) return;
      var charwidth = fontchar.width;
      var charheight = 0;
      if (traj) charheight += fontchar.height;
      if (anim) charheight += fontchar.height;
      var g = group.createGroup ();
      var charscale = target_height / charheight;
      g.setTransform ([
        dojox.gfx.matrix.translate (x, y),
        dojox.gfx.matrix.scale (charscale, charscale)
      ]);
      if (traj && fontchar.traj)
        g.createImage ({src: fontchar.traj, x: 0, y: 0, width: fontchar.width, height: fontchar.height});
      if (anim && fontchar.anim)
        g.createImage ({src: fontchar.anim, x: 0, y: charheight - fontchar.height, width: fontchar.width, height: fontchar.height});
      x += charwidth * charscale + char_space;
      //line_height = Math.max (line_height, char.height);
    });
    x -= char_space;
    xsize = Math.max (x, xsize);
    y += line_height;
    if (linesize == 0) linesize = y;
    y += line_space;
  });
  ysize = y - line_space;

  resize ();
}

function resize () {
  var coords = dojo.coords (dojo.byId ('surface'));
  var width = Math.max (100, coords.w);
  var height = Math.max (100, dojo.window.getBox ().h - coords.y - 5);
  //scale = Math.min (width / (xsize+margin), height / (ysize+margin));
  scale = Math.min (width / (xsize+margin), height / (linesize+margin));
  height = (ysize+margin) * scale;
  surface.setDimensions (width, height);
  //scale = Math.min (width / (xsize+margin), height / (ysize+margin));
  xoff = (width - scale * xsize) / 2;
  yoff = (height - scale * ysize) / 2;
  //console.log (scale, xoff, yoff, xsize, ysize);
  group.setTransform ([
    dojox.gfx.matrix.translate (xoff, yoff),
    dojox.gfx.matrix.scale (scale, scale)
  ]);
}
