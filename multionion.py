#!/usr/bin/python
## Generates a sequence of onioned frames illustrating the animation.
from __future__ import division
import math, os, sys
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

def composite (gif, out, onion = 0.1, multi = 6):
  gif = PIL.Image.open (gif)

  n = len (list (frames (gif)))
  allframes = frames (gif)
  for batch in range (multi):
    start = int (math.ceil (n * batch / multi))
    finish = int (math.ceil (n * (batch + 1) / multi))

    ## Solid stick figure, plus one solid ball:
    composite = allframes.next ().convert ('RGBA')
    ## No stick figure, no solid ball:
    #composite = PIL.Image.new ('RGBA', allframes[start].size, 'white')
    ## Hybrid:
    #composite = allframes[start].convert ('RGBA')
    #composite.putalpha (int (highlight * 255))

    for i in range (start+1, finish):
      frame = allframes.next ()
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
    composite.save (out % (multi - batch))

def main ():
  if len (sys.argv) <= 1:
    print 'usage: %s n filename.gif ...' % sys.argv[0]
  n = int (sys.argv[1])
  if n >= 10:
    spec = '%02d'
  else:
    spec = '%d'
  for gif in sys.argv[2:]:
    png = os.path.splitext (gif) [0] + '-' + str (n) + '-' + spec + '.png'
    print gif, '->', png
    assert gif != png
    composite (gif, png, multi = n)

if __name__ == '__main__': main ()
