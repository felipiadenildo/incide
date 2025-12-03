#!/usr/bin/env python3
"""
Organiza src/services/ para uma arquitetura de linguagens (TikZ/CircuitTikZ)
- Reorganiza pastas: code/parsers, code/generators, code/pretty
- Move/renomeia arquivos existentes de forma segura
- Cria stubs para parsers por linguagem se não existirem
"""

import shutil
from pathlib import Path


ROOT = Path("src/services")


def ensure_dirs():
    (ROOT / "code").mkdir(parents=True, exist_ok=True)
    (ROOT / "code" / "parsers").mkdir(parents=True, exist_ok=True)
    (ROOT / "code" / "generators").mkdir(parents=True, exist_ok=True)
    (ROOT / "code" / "pretty").mkdir(parents=True, exist_ok=True)
    (ROOT / "elements").mkdir(parents=True, exist_ok=True)
    print("✔ Pastas base garantidas em src/services/")


def move_existing_files():
    """Move arquivos atuais para a estrutura alvo, sem sobrescrever conteúdo existente."""
    # 1) codeParser.js → code/codeParser.legacy.js (mantido como legado)
    src_code_parser = ROOT / "code" / "codeParser.js"
    if src_code_parser.exists():
        dst_legacy = ROOT / "code" / "codeParser.legacy.js"
        if not dst_legacy.exists():
            shutil.move(str(src_code_parser), str(dst_legacy))
            print("→ codeParser.js movido para code/codeParser.legacy.js (legado)")
        else:
            print("ℹ codeParser.legacy.js já existe, mantendo os dois (verificar manualmente)")

    # 2) codePrettyPrinter.js → code/pretty/codePrettyPrinter.js
    src_pretty = ROOT / "code" / "codePrettyPrinter.js"
    if src_pretty.exists():
        dst_pretty = ROOT / "code" / "pretty" / "codePrettyPrinter.js"
        if not dst_pretty.exists():
            shutil.move(str(src_pretty), str(dst_pretty))
            print("→ codePrettyPrinter.js movido para code/pretty/codePrettyPrinter.js")
        else:
            print("ℹ code/pretty/codePrettyPrinter.js já existe, verifique duplicação")

    # 3) generateProjectCode.js → code/generators/generateProjectCode.js
    src_gen = ROOT / "code" / "generateProjectCode.js"
    if src_gen.exists():
        dst_gen = ROOT / "code" / "generators" / "generateProjectCode.js"
        if not dst_gen.exists():
            shutil.move(str(src_gen), str(dst_gen))
            print("→ generateProjectCode.js movido para code/generators/generateProjectCode.js")
        else:
            print("ℹ code/generators/generateProjectCode.js já existe, verifique duplicação")


def create_parser_stubs():
    """Cria stubs para parsers por linguagem se ainda não existirem."""
    parse_project = ROOT / "code" / "parsers" / "parseProjectCode.js"
    parse_tikz = ROOT / "code" / "parsers" / "parseTikz.js"
    parse_circuit = ROOT / "code" / "parsers" / "parseCircuitikz.js"

    if not parse_project.exists():
        parse_project.write_text(
            """// Orquestrador de parsing por linguagem
// Usa parsers específicos (TikZ, CircuitTikZ, futuras libs)

import { parseTikz } from './parseTikz'
import { parseCircuitikz } from './parseCircuitikz'

/**
 * Faz o roteamento para o parser correto com base em projectType.
 * Retorna uma lista de elementos prontos para a store.
 */
export function parseProjectCode(projectType, code) {
  if (projectType === 'circuitikz') {
    return parseCircuitikz(code)
  }
  // padrão: TikZ puro
  return parseTikz(code)
}
""",
            encoding="utf-8",
        )
        print("✔ Criado stub: code/parsers/parseProjectCode.js")

    if not parse_tikz.exists():
        parse_tikz.write_text(
            """// Parser específico para TikZ
// TODO: implementar parsing real; por enquanto, stub seguro.

export function parseTikz(code) {
  // Retorna array de elementos no formato esperado pela store:
  // [{ type, x, y, ... }]
  // Implementação inicial pode ser bem simples ou mesmo retornar [].
  return []
}
""",
            encoding="utf-8",
        )
        print("✔ Criado stub: code/parsers/parseTikz.js")

    if not parse_circuit.exists():
        parse_circuit.write_text(
            """// Parser específico para CircuiTikZ
// TODO: implementar parsing real; por enquanto, stub seguro.

export function parseCircuitikz(code) {
  // Retorna array de elementos CircuitTikZ no formato da store.
  return []
}
""",
            encoding="utf-8",
        )
        print("✔ Criado stub: code/parsers/parseCircuitikz.js")


def main():
    if not ROOT.exists():
        print("❌ Pasta src/services não encontrada (rode a partir da raiz do projeto).")
        return

    print("Organizando src/services/…")
    ensure_dirs()
    move_existing_files()
    create_parser_stubs()
    print("\n✅ Organização de src/services concluída.")
    print("Estrutura alvo:")
    print(
        """
src/services/
├── code/
│   ├── parsers/
│   │   ├── parseProjectCode.js
│   │   ├── parseTikz.js
│   │   └── parseCircuitikz.js
│   ├── generators/
│   │   └── generateProjectCode.js
│   ├── pretty/
│   │   └── codePrettyPrinter.js
│   └── codeParser.legacy.js   (antigo, para migração gradual)
├── elements/
│   └── elementFactory.js
└── languageRegistry.js
"""
    )


if __name__ == "__main__":
    main()
