#!/usr/bin/python
## Generates `font.js` from `font` directory
import glob, json, os
import PIL.Image

label = {'gif': 'anim', 'png': 'traj'}

font = {}

for filename in glob.glob ('font/*.png') + glob.glob ('font/*.gif'):
  char, ext = os.path.splitext (os.path.basename (filename))
  if char not in font: font[char] = {}
  ext = ext.lstrip ('.')
  font[char][ext] = filename

print len (font), 'characters'
print sum (len (x) for x in font.itervalues ()), 'image files'

out = open ('font.js', 'w')
out.write ('var font = {\n')
for char in sorted (font):
  out.write ('  %r: {\n' % char)
  oldbbox = None
  for ext in sorted (font[char]):
    image = PIL.Image.open (font[char][ext])
    bbox = image.getbbox() [2:]
    if oldbbox is not None:
      assert bbox == oldbbox
    out.write ('    %s: %r,\n' % (label[ext], font[char][ext]))
  #out.seek (-2, 1); out.write ('\n')
  out.write ('    width: %s, height: %s\n' % bbox)
  out.write ('  },\n')
#out.seek (-2, 1); out.write ('\n')
out.write ("  ' ': { width: 200, height: 450 }\n")
out.write ('};\n')
out.close ()

print 'Wrote font.js'
