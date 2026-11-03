"""Crops the evidence screenshots used in the deck. Usage: python crop.py <repoRoot> <outDir>
Then: PPTX_SKILL=<pptx skill dir> NODE_PATH=<dir with pptxgenjs> node build.js <repoRoot> <outDir>
Needs Pillow, pptxgenjs, and the Wix Madefor fonts installed for a true-to-design render."""
import sys
from PIL import Image

repo, out = sys.argv[1], sys.argv[2]
CROPS = [  # (source evidence file, crop box in px, output name)
    ("evidence/SF-01/free-name-result.jpg", (225, 70, 715, 215), "sf01.jpg"),
    ("evidence/WH-03/invalid-input-from-landing-page.jpg", (230, 95, 710, 235), "wh03.jpg"),
    ("evidence/I18N-02/hebrew-idn-punycode-in-main-card.jpg", (170, 95, 770, 400), "i18n02.jpg"),
    ("evidence/automation/UI-04/70-chars-length-message.png", (140, 160, 1140, 270), "ui04.jpg"),
    ("evidence/BNG-02/rise-unrelated-domains.jpg", (170, 55, 760, 425), "bng02.jpg"),
    ("evidence/BNG-02/rise-unrelated-domains.jpg", (365, 115, 760, 425), "bng02b.jpg"),
    ("evidence/SF-01/free-name-result.jpg", (240, 115, 695, 205), "sf01b.jpg"),
    ("evidence/WH-01/registered-wikipedia-via-url-input.jpg", (137, 183, 495, 425), "wh01.jpg"),
]
for src, box, name in CROPS:
    Image.open(f"{repo}/{src}").convert("RGB").crop(box).save(f"{out}/{name}", quality=92)
