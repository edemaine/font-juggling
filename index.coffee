window?.onload = ->
  app = new FontWebappSVG
    root: '#output'
    margin: 20
    charKern: 30
    lineKern: 100
    renderChar: (char, state) ->
      char = char.toUpperCase()
      return unless char of window.font
      glyph = window.font[char]
      g = @renderGroup.group()
      height = 0
      if state.traj and glyph.traj
        g.image glyph.traj
        .size glyph.width, glyph.height
        height += glyph.height if state.traj
      if state.anim and glyph.anim
        g.image glyph.anim
        .y glyph.height
        .size glyph.width, glyph.height
        height += glyph.height if state.anim
      element: g
      width: glyph.width
      height: height

  document.getElementById 'downloadSVG'
  ?.addEventListener 'click', -> app.downloadSVG 'juggling.svg'
