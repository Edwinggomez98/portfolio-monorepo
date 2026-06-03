"""
Convierte gsmarena_full.csv → devices.json optimizado para el cotizador Angular.
Campos conservados: brand, model, ram, storage, price_usd, display, os, chipset, camera, battery, year, type
"""
import csv
import json
import re
import sys
from pathlib import Path

INPUT  = Path(r"C:\Users\edwin\AppData\Local\Temp\gsmarena_full.csv")
OUTPUT = Path(r"C:\Users\edwin\OneDrive\Escritorio\dev\portfolio\frontend\src\assets\data\devices.json")

def clean(val) -> str:
    if not val:
        return ""
    val = val.strip()
    # quitar prefijo b'...' que tiene el CSV
    if val.startswith("b'") and val.endswith("'"):
        val = val[2:-1]
    elif val.startswith('b"') and val.endswith('"'):
        val = val[2:-1]
    # limpiar escapes unicode literales tipo \xc2\xb5
    val = val.replace("\\xc2\\xb5", "µ").replace("\\xc2\\xb0", "°")
    val = val.replace("\\xcb\\x9a", "°")
    return val.strip()

def extract_year(announced: str) -> str:
    m = re.search(r'\b(20\d{2}|19\d{2})\b', announced)
    return m.group(1) if m else ""

def extract_ram(internal: str) -> str:
    """Extrae el primer valor de RAM del campo Internal. Ej: '64GB 4GB RAM, 128GB 4GB RAM' → '4GB'"""
    m = re.search(r'(\d+GB)\s+RAM', internal, re.IGNORECASE)
    if m:
        return m.group(1)
    m = re.search(r'(\d+MB)\s+RAM', internal, re.IGNORECASE)
    return m.group(1) if m else ""

def extract_storage(internal: str) -> str:
    """Extrae el primer valor de almacenamiento. Ej: '64GB 4GB RAM' → '64GB'"""
    m = re.search(r'^(\d+[GT]B)', internal.strip(), re.IGNORECASE)
    return m.group(1) if m else ""

def extract_price(price_raw: str) -> str:
    """Extrae número del precio. 'About 130 EUR' → '130 EUR'"""
    if not price_raw:
        return ""
    price_raw = price_raw.replace("About", "").strip()
    return price_raw

def infer_type(brand: str, model: str, os: str) -> str:
    name_lower = (model + " " + brand).lower()
    if any(k in name_lower for k in ["tab", "pad", "ipad", "tablet"]):
        return "tablet"
    if any(k in name_lower for k in ["watch", "band", "gear", "fit"]):
        return "smartwatch"
    if any(k in name_lower for k in ["book", "laptop", "notebook", "chromebook"]):
        return "laptop"
    return "smartphone"

def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    devices = []
    seen = set()

    with open(INPUT, encoding="utf-8", errors="replace") as f:
        reader = csv.DictReader(f)
        for row in reader:
            brand     = clean(row.get("Brand", ""))
            model     = clean(row.get("Model Name", ""))
            if not brand or not model:
                continue

            key = f"{brand.lower()}|{model.lower()}"
            if key in seen:
                continue
            seen.add(key)

            internal  = clean(row.get("Internal", ""))
            announced = clean(row.get("Announced", ""))
            price_raw = clean(row.get("Price", ""))
            os_raw    = clean(row.get("OS", ""))
            chipset   = clean(row.get("Chipset", ""))
            display_t = clean(row.get("Type", ""))
            display_s = clean(row.get("Size", ""))
            camera    = clean(row.get("Quad", "") or row.get("Single", "") or row.get("Triple", ""))
            battery   = clean(row.get("Type_1", ""))

            year     = extract_year(announced)
            ram      = extract_ram(internal)
            storage  = extract_storage(internal)
            price    = extract_price(price_raw)
            dev_type = infer_type(brand, model, os_raw)

            # filtrar entradas sin datos mínimos útiles
            if not year or not ram or not storage:
                continue
            # solo a partir de 2015
            if year and int(year) < 2015:
                continue

            devices.append({
                "b":  brand,       # brand
                "m":  model,       # model
                "t":  dev_type[0], # type: s/t/l/w (smartphone/tablet/laptop/smartwatch)
                "y":  year,        # year
                "r":  ram,         # ram
                "s":  storage,     # storage
                "o":  os_raw[:30] if os_raw else "",        # os
                "c":  chipset[:40] if chipset else "",      # chipset
                "p":  price[:20] if price else "",          # price
            })

    # Ordenar: más recientes primero, luego alphabéticamente
    devices.sort(key=lambda d: (d["y"] or "0", d["b"], d["m"]), reverse=True)

    print(f"Total dispositivos limpios: {len(devices)}")

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(devices, f, ensure_ascii=False, separators=(",", ":"))

    size_kb = OUTPUT.stat().st_size / 1024
    print(f"Guardado en: {OUTPUT}")
    print(f"Tamaño: {size_kb:.1f} KB")

if __name__ == "__main__":
    main()
