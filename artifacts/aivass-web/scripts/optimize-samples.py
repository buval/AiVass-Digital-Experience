"""Lossless sample cleanup, with text and rendered-page equivalence checks.

One-off authoring tool; requires PyMuPDF, not part of the website runtime.
Usage: python scripts/optimize-samples.py INPUT_DIRECTORY OUTPUT_DIRECTORY
Output must be a separate directory. Inspect results before replacing public PDFs.
"""
from pathlib import Path
import sys
import pymupdf

source, destination = map(Path, sys.argv[1:])
if source.resolve() == destination.resolve():
    raise ValueError("Use a separate output directory to preserve originals")
destination.mkdir(parents=True, exist_ok=True)
for path in sorted(source.glob("*-sample.pdf")):
    original = pymupdf.open(path)
    cleaned = pymupdf.open(path)
    # Sample extracts retain image/font resources from pages not in the sample.
    # Remove unused references, then collect unreachable objects; never downsample.
    for page in cleaned:
        page.clean_contents()
    target = destination / path.name
    cleaned.save(target, garbage=4, deflate=True)
    result = pymupdf.open(target)
    assert len(original) == len(result), path.name
    for before, after in zip(original, result):
        assert before.get_text() == after.get_text(), path.name
        assert before.get_pixmap(matrix=pymupdf.Matrix(2, 2)).samples == after.get_pixmap(matrix=pymupdf.Matrix(2, 2)).samples, path.name
    assert target.stat().st_size <= path.stat().st_size, path.name
    print(path.name, path.stat().st_size, "->", target.stat().st_size, "identical text and 144dpi rendering")
