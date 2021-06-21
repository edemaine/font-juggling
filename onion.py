#!/usr/bin/python
## Use `python onion.py font/*.gif` to generates `font/*.png`.
import os, sys
import PIL.Image

def frames (image):
  frame = 0
  try:
    while True:
      image.seek (frame)
      yield image
      frame += 1
  except EOFError:
    return

def composite (gif, out, onion = 0.1, highlight = 0.25):
  gif = PIL.Image.open (gif)

  ## Solid stick figure, plus one solid ball:
  #composite = gif.convert ('RGBA')
  ## No stick figure, no solid ball:
  composite = PIL.Image.new ('RGBA', gif.size, 'white')
  ## Hybrid:
  #composite = gif.convert ('RGBA')
  #composite.putalpha (int (highlight * 255))

  for frame in frames (gif):
    #print frame
    palette = frame.getpalette ()
    def keep (x):
      r, g, b = palette[3*x], palette[3*x+1], palette[3*x+2]
      if r == 255 and g < 255 and b < 255:
        return int (255 * onion)
      else:
        return 0
    alpha = frame.point (keep, 'L')
    frame = frame.convert ('RGBA')
    frame.putalpha (alpha)
    composite = PIL.Image.alpha_composite (composite, frame)

  composite = composite.convert ('RGB') #.convert ('L', (1.0, 0.0, 0.0, 0.0))
  composite.save (out)

def main ():
  if len (sys.argv) <= 1:
    print 'usage: %s filename.gif ...' % sys.argv[0]
  for gif in sys.argv[1:]:
    png = os.path.splitext (gif) [0] + '.png'
    print gif, '->', png
    assert gif != png
    composite (gif, png)

if __name__ == '__main__': main ()
