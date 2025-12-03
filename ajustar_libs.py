#!/usr/bin/env python3
"""
Organização SIMPLIFICADA - PASTA PLANA
- src/libs/tikz/*.js e src/libs/circuittikz/*.js
- category configurada NO ARQUIVO (não em pastas)
"""

import os
import shutil
import re
from pathlib import Path


def organize_libs_flat():
    """Organização PLANA - todos arquivos em tikz/ e circuittikz/"""
    src_libs = Path("src/libs")

    # Deleta arquivos/pastas desnecessários
    trash = [
        "tikz/elements",
        "tikz/elements/elementFactory.js",
        "tikz/elements/shapes.js",
        "tikz/tikzParser.js",
        "tikz/index.js",
        "circuittikz/index.js",
    ]

    for item in trash:
        p = src_libs / item
        if p.exists():
            if p.is_dir():
                shutil.rmtree(p)
            else:
                p.unlink()
            print(f"Deletado: {item}")

    # Garante estrutura plana
    libs = ["tikz", "circuittikz"]
    for lib in libs:
        lib_path = src_libs / lib
        lib_path.mkdir(exist_ok=True, parents=True)
        print(f"Pasta plana garantida: src/libs/{lib}/")

    # Arquivos esperados em cada lib
    files = {
        "tikz": ["circle.js", "ellipse.js", "line.js", "node.js", "rectangle.js"],
        "circuittikz": [
            "ammeter.js",
            "capacitor.js",
            "capacitor_polar.js",
            "diode.js",
            "euroresistor.js",
            "fuse.js",
            "ground.js",
            "inductor.js",
            "isource.js",
            "npn.js",
            "ohmmeter.js",
            "opamp.js",
            "pnj.js",
            "potentiometer.js",
            "relay_spdt.js",
            "resistor.js",
            "switch_closed.js",
            "switch_open.js",
            "thermistor.js",
            "usresistor.js",
            "voltmeter.js",
            "vsource.js",
            "zener.js",
        ],
    }

    moves = []

    # Move arquivos para src/libs/{tikz|circuittikz}/
    for lib, filenames in files.items():
        lib_path = src_libs / lib

        for filename in filenames:
            src_file = None
            for root, dirs, fs in os.walk("src/libs"):
                if filename in fs:
                    src_file = Path(root) / filename
                    break

            if src_file and src_file.exists():
                dst_file = lib_path / filename
                if src_file.resolve() != dst_file.resolve():
                    dst_file.parent.mkdir(parents=True, exist_ok=True)
                    shutil.move(str(src_file), str(dst_file))
                    moves.append(f"{src_file.relative_to('src')} -> {lib}/{filename}")

    # Converte para padrão descriptor
    convert_files_flat(src_libs, files)

    print("\n" + "=" * 60)
    print("ORGANIZAÇÃO PLANA CONCLUÍDA!")
    print(f"{len(moves)} arquivos movidos")
    print(
        """
Estrutura esperada:

src/libs/
├── elementRegistry.js
├── tikz/
│   ├── circle.js         // category: 'shapes'
│   ├── rectangle.js      // category: 'shapes'
│   └── ...
└── circuittikz/
    ├── resistor.js       // category: 'bipoles'
    ├── capacitor.js      // category: 'bipoles'
    └── ...
"""
    )
    print("Agora rode: npm run dev")


def convert_files_flat(libs_path: Path, files: dict):
    """Converte arquivos JS para o padrão:
    export const descriptor = { type, library, category, label, ...props }
    """
    count = 0

    category_map = {
        # TikZ
        "circle.js": "shapes",
        "rectangle.js": "shapes",
        "ellipse.js": "shapes",
        "line.js": "shapes",
        "node.js": "shapes",
        # CircuitiTikZ - bipoles
        "resistor.js": "bipoles",
        "capacitor.js": "bipoles",
        "capacitor_polar.js": "bipoles",
        "diode.js": "bipoles",
        "inductor.js": "bipoles",
        "fuse.js": "bipoles",
        "switch_open.js": "bipoles",
        "switch_closed.js": "bipoles",
        "relay_spdt.js": "bipoles",
        "potentiometer.js": "bipoles",
        "usresistor.js": "bipoles",
        "euroresistor.js": "bipoles",
        "zener.js": "bipoles",
        "pnj.js": "bipoles",
        "npn.js": "bipoles",
        "thermistor.js": "bipoles",
        # Sources/Meters
        "vsource.js": "sources",
        "isource.js": "sources",
        "ammeter.js": "sources",
        "voltmeter.js": "sources",
        "ohmmeter.js": "sources",
        # Outros
        "ground.js": "symbols",
        "opamp.js": "symbols",
    }

    all_names = sum(files.values(), [])

    for lib_path in libs_path.glob("**/*.js"):
        if lib_path.name not in all_names:
            continue

        content = lib_path.read_text(encoding="utf-8")

        # Pega primeira const X = { ... }
        var_match = re.search(r"const\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*\{", content)
        if not var_match:
            # Se já tem "export const descriptor", pula
            if "export const descriptor" in content:
                continue
            print(f"Aviso: não encontrado 'const X = {{' em {lib_path}")
            continue

        var_name = var_match.group(1)
        category = category_map.get(lib_path.name, "outros")
        library = lib_path.parent.name

        # Label legível a partir de var_name (Ex: euroResistor -> Euro Resistor)
        label = re.sub(r"(?<!^)([A-Z])", r" \1", var_name).title()

        body = snippet_existing_object(content)
        if not body:
            body = "// TODO: adicionar propriedades (svgRender, tikzCode, etc.)"

        new_js = (
            f"// src/libs/{library}/{lib_path.name}\n"
            "/**\n"
            f" * {label}\n"
            f" * Library: {library} | Category: {category}\n"
            " */\n\n"
            "export const descriptor = {\n"
            f"  type: '{var_name}',\n"
            f"  library: '{library}',\n"
            f"  category: '{category}',\n"
            f"  label: '{label}',\n"
            f"{indent_body(body)}\n"
            "};\n\n"
            f"console.log('✔ [{library}] {category}/{var_name}');\n"
        )

        lib_path.write_text(new_js, encoding="utf-8")
        count += 1
        print(f"Convertido: {lib_path.relative_to('src')} -> category: '{category}'")

    print(f"{count} arquivos convertidos para o padrão descriptor")


def snippet_existing_object(content: str) -> str:
    """Extrai o objeto JS original depois de 'const X = ' até o próximo export/console ou fim."""
    obj_match = re.search(
        r"const\s+\w+\s*=\s*(\{.*\})(?=\s*(?:export|console|$))",
        content,
        re.DOTALL,
    )
    if not obj_match:
        return ""

    obj = obj_match.group(1).strip()
    return obj


def indent_body(body: str, spaces: int = 2) -> str:
    """Indenta corpo do objeto em N espaços (para encaixar dentro do descriptor)."""
    pad = " " * spaces
    return "\n".join(pad + line if line.strip() else line for line in body.splitlines())


if __name__ == "__main__":
    print("Organizando src/libs em estrutura PLANA...")
    print("=" * 60)
    organize_libs_flat()
