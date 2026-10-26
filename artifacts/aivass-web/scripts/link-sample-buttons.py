"""Add native PDF links to all sample purchase buttons, without altering artwork.

Authoring/verification tool; requires PyMuPDF.
Run: python scripts/link-sample-buttons.py [--check]
Destinations come from the guide catalog, not temporary Stripe Checkout Sessions.
"""
import json
from pathlib import Path
import subprocess
import sys
import tempfile

import pymupdf

APP = Path(__file__).resolve().parents[1]
CHECK_ONLY = "--check" in sys.argv[1:]
catalog = json.loads(subprocess.check_output([
    "node", "--input-type=module", "-e",
    "import { GUIDES } from './src/data/guides.ts'; "
    "console.log(JSON.stringify(GUIDES.filter(g => g.sampleSlug)"
    ".map(g => ({slug:g.slug, sampleSlug:g.sampleSlug}))));",
], cwd=APP, text=True))

for guide in catalog:
    path = APP / "public/samples" / f"{guide['sampleSlug']}-sample.pdf"
    destination = f"https://aivass.com/guides/{guide['slug']}"
    original = pymupdf.open(path)
    page = original[-1]
    labels = page.search_for("Get the full guide")
    assert len(labels) == 1, f"{path.name}: expected exactly one CTA"
    label = labels[0]
    # Discover the existing button rectangle so its entire visible area works.
    buttons = [
        drawing["rect"] for drawing in page.get_drawings()
        if drawing.get("fill") and drawing["rect"].contains(label)
    ]
    assert buttons, f"{path.name}: no button artwork surrounds the label"
    button = min(buttons, key=lambda rect: rect.get_area())

    def validate_links(document):
        links = [
            link for link in document[-1].get_links()
            if link["from"].intersects(label)
        ]
        assert len(links) == 1, f"{path.name}: expected one CTA link"
        assert links[0].get("uri") == destination, f"{path.name}: incorrect destination"
        assert links[0]["from"].contains(button), f"{path.name}: incomplete hit area"

    if CHECK_ONLY:
        validate_links(original)
    else:
        edited = pymupdf.open(path)
        cta = edited[-1]
        for link in cta.get_links():
            if link["from"].intersects(label):
                cta.delete_link(link)
        cta.insert_link({"kind": pymupdf.LINK_URI, "from": button, "uri": destination})
        # Stage and verify the file before replacing the public sample.
        with tempfile.TemporaryDirectory() as temporary:
            target = Path(temporary) / path.name
            edited.save(target, garbage=4, deflate=True)
            edited.close()
            result = pymupdf.open(target)
            validate_links(result)
            assert len(original) == len(result), path.name
            for before, after in zip(original, result):
                assert before.get_text() == after.get_text(), f"{path.name}: changed text"
                assert before.get_pixmap(matrix=pymupdf.Matrix(2, 2)).samples == (
                    after.get_pixmap(matrix=pymupdf.Matrix(2, 2)).samples
                ), f"{path.name}: changed appearance"
            result.close()
            path.write_bytes(target.read_bytes())
    original.close()
    print(f"PASS {path.name}: full button links to {destination}")
