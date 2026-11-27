import gzip
import hashlib
import json
import re
import sys
from pathlib import Path
from tempfile import TemporaryDirectory
from xml.etree import ElementTree
from zipfile import ZipFile


NAMESPACE = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
HEADERS = {
    "LONG NAME OF FUND": "name",
    "ISIN": "isin",
    "FUND HOUSE NAME": "fundHouse",
    "FAMILY CURRENCY": "familyCurrency",
    "INCOME/ACCUMULATION INDICATOR": "incomeTreatment",
    "IIC DOMICILE": "domicile",
    "LEI OF THE COLLECTIVE INVESTMENT SCHEME (CIS)": "lei",
    "NUMBER OF DECIMALS IN SHARES": "unitDecimals",
}
ISIN_PATTERN = re.compile(r"[A-Z]{2}[A-Z0-9]{9}[0-9]")


def element_text(element):
    return "".join(node.text or "" for node in element.iter(f"{NAMESPACE}t"))


def sheet_rows(file):
    sheet = None
    for event, element in ElementTree.iterparse(file, events=("start", "end")):
        if event == "start" and element.tag == f"{NAMESPACE}sheetData":
            sheet = element
        elif event == "end" and element.tag == f"{NAMESPACE}row":
            yield element
            sheet.remove(element)


def cell_text(cell, shared_strings):
    if cell.get("t") == "inlineStr":
        return element_text(cell).strip()
    value = cell.findtext(f"{NAMESPACE}v", "")
    if cell.get("t") == "s" and value:
        return shared_strings[int(value)].strip()
    return value.strip()


def workbook_rows(path):
    with ZipFile(path) as book:
        entries = book.namelist()
        shared_strings = []
        if "xl/sharedStrings.xml" in entries:
            with book.open("xl/sharedStrings.xml") as file:
                shared_strings = [element_text(item) for item in ElementTree.parse(file).getroot()]

        sheets = sorted(name for name in entries if re.fullmatch(r"xl/worksheets/sheet\d+\.xml", name))
        if not sheets:
            raise ValueError(f"{path.name} has no worksheets")

        for name in sheets:
            with book.open(name) as file:
                rows = sheet_rows(file)
                header = next(rows, None)
                if header is None:
                    continue
                columns = {}
                for cell in header:
                    label = " ".join(cell_text(cell, shared_strings).upper().split())
                    if label in HEADERS:
                        column = cell.attrib["r"].rstrip("0123456789")
                        columns[column] = HEADERS[label]
                if set(columns.values()) != set(HEADERS.values()):
                    raise ValueError(f"{path.name}: {name} is missing expected fund columns")

                for row in rows:
                    values = {}
                    for cell in row:
                        key = columns.get(cell.attrib["r"].rstrip("0123456789"))
                        if key:
                            value = cell_text(cell, shared_strings)
                            if value:
                                values[key] = value
                    if values.get("name"):
                        yield values


def valid_isin(value):
    if not ISIN_PATTERN.fullmatch(value):
        return False
    digits = "".join(str(ord(char) - ord("A") + 10) if char.isalpha() else char for char in value)
    expanded = [int(digit) * (1 + index % 2) for index, digit in enumerate(reversed(digits))]
    return sum(digit // 10 + digit % 10 for digit in expanded) % 10 == 0


def public_record(values):
    isin = values.pop("isin", "").upper()
    if valid_isin(isin):
        values["isin"] = isin
    if not re.fullmatch(r"[A-Z]{3}", values.get("familyCurrency", "")):
        values.pop("familyCurrency", None)
    if values.get("incomeTreatment") not in ("ACC", "INC"):
        values.pop("incomeTreatment", None)
    if not re.fullmatch(r"[A-Z0-9]{18}[0-9]{2}", values.get("lei", "")):
        values.pop("lei", None)
    if not re.fullmatch(r"[0-9]+", values.get("unitDecimals", "")):
        values.pop("unitDecimals", None)
    if "isin" not in values:
        fingerprint = hashlib.sha256(json.dumps(values, sort_keys=True).encode()).hexdigest()[:24]
        isin = f"name:{fingerprint}"
    return {"id": isin, **values}


def main(sources):
    destination = Path(__file__).resolve().parents[1] / "src/content/data/fund-universe.json.gz"
    records = {}
    source_rows = 0

    for source in sources:
        for values in workbook_rows(source):
            source_rows += 1
            record = public_record(values)
            original = records.setdefault(record["id"], record)
            for key, value in record.items():
                original.setdefault(key, value)

    if not records:
        raise ValueError("No named funds found in the supplied workbooks")

    ordered = sorted(records.values(), key=lambda fund: (fund["name"].casefold(), fund["id"]))
    payload = json.dumps(ordered, ensure_ascii=False, separators=(",", ":")).encode()
    destination.parent.mkdir(parents=True, exist_ok=True)
    with TemporaryDirectory(dir=destination.parent) as folder:
        temporary_path = Path(folder) / destination.name
        with temporary_path.open("wb") as file, gzip.GzipFile(filename="", fileobj=file, mode="wb", mtime=0) as snapshot:
            snapshot.write(payload)
        temporary_path.replace(destination)

    names_only = sum("isin" not in record for record in ordered)
    print(f"Imported {source_rows:,} rows from {len(sources)} workbooks into {len(ordered):,} entries")
    print(f"{names_only:,} entries are searchable by name only")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit('Usage: python3 scripts/import-fund-universe.py Fund/*.xlsx')
    main([Path(filename) for filename in sys.argv[1:]])
