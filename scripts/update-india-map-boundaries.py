"""Apply Natural Earth 5.1.1 India-view outlines to the existing SVG map geometry.

Usage: python3 scripts/update-india-map-boundaries.py /path/to/ne_10m_admin_0_countries_ind.zip
Only India, Pakistan, and China change, keeping their adjoining boundaries consistent.
The input is the public-domain Natural Earth India point-of-view dataset.
"""

import json
import math
from pathlib import Path
import struct
import sys
import zipfile


def dbf_records(data):
    count, header_length, record_length = struct.unpack_from("<IHH", data, 4)
    fields = []
    for offset in range(32, header_length - 1, 32):
        field = data[offset:offset + 32]
        if field[0] == 13:
            break
        fields.append((field[:11].split(b"\0")[0].decode(), field[16]))
    for index in range(count):
        record = data[header_length + index * record_length:header_length + (index + 1) * record_length]
        position, values = 1, {}
        for name, length in fields:
            values[name] = record[position:position + length].decode("utf-8", errors="replace").strip(" \0")
            position += length
        yield values


def shape_rings(data):
    offset = 100
    while offset < len(data):
        _, length = struct.unpack_from(">ii", data, offset)
        record = data[offset + 8:offset + 8 + length * 2]
        if struct.unpack_from("<i", record)[0] != 5:
            raise ValueError("Expected polygon shapefile")
        parts, count = struct.unpack_from("<ii", record, 36)
        starts = list(struct.unpack_from(f"<{parts}i", record, 44)) + [count]
        point_offset = 44 + parts * 4
        points = [struct.unpack_from("<dd", record, point_offset + i * 16) for i in range(count)]
        yield [points[starts[i]:starts[i + 1]] for i in range(parts)]
        offset += 8 + length * 2


def simplify(points, tolerance=.18):
    """Iterative Ramer–Douglas–Peucker in the map's pixel coordinates."""
    keep, pending = {0, len(points) - 1}, [(0, len(points) - 1)]
    while pending:
        first, last = pending.pop()
        ax, ay = points[first]
        bx, by = points[last]
        dx, dy = bx - ax, by - ay
        length = dx * dx + dy * dy
        furthest, distance = None, tolerance * tolerance
        for i in range(first + 1, last):
            x, y = points[i]
            t = max(0, min(1, ((x - ax) * dx + (y - ay) * dy) / length)) if length else 0
            squared = (x - ax - t * dx) ** 2 + (y - ay - t * dy) ** 2
            if squared > distance:
                furthest, distance = i, squared
        if furthest is not None:
            keep.add(furthest)
            pending.extend([(first, furthest), (furthest, last)])
    return [points[i] for i in sorted(keep)]


def svg_path(rings):
    paths = []
    for ring in rings:
        points = [((lon + 180) / 360 * 600, (90 - lat) / 180 * 290) for lon, lat in ring]
        area = abs(sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(points, points[1:]))) / 2
        if area < .03:
            continue
        rounded = [(round(x, 1), round(y, 1)) for x, y in simplify(points)]
        if len(set(rounded)) < 3:
            continue
        if not all(math.isfinite(x) and math.isfinite(y) for x, y in rounded):
            raise ValueError("Invalid projected coordinate")
        paths.append("M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in rounded) + "Z")
    return "".join(paths)


def main():
    names = {"IND": "India", "PAK": "Pakistan", "CHN": "China"}
    with zipfile.ZipFile(sys.argv[1]) as archive:
        prefix = "ne_10m_admin_0_countries_ind"
        records = list(dbf_records(archive.read(prefix + ".dbf")))
        shapes = list(shape_rings(archive.read(prefix + ".shp")))
        if len(records) != len(shapes):
            raise ValueError("Geometry and attribute counts differ")
        replacements = {names[record["ADM0_A3"]]: svg_path(rings) for record, rings in zip(records, shapes) if record["ADM0_A3"] in names}
    if set(replacements) != set(names.values()) or not all(replacements.values()):
        raise ValueError("Missing expected country geometry")
    target = Path(__file__).resolve().parents[1] / "src/content/world-map-paths.json"
    outlines = json.loads(target.read_text())
    for outline in outlines:
        if outline["name"] in replacements:
            outline["path"] = replacements[outline["name"]]
    target.write_text(json.dumps(outlines, separators=(",", ":")) + "\n")
    print("Updated India-view boundaries:", ", ".join(sorted(replacements)))


if __name__ == "__main__":
    main()
