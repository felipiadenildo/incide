#!/usr/bin/env python3
"""
🔧 FIX EXATO linha 21 do ElementPalette.jsx
Remove código duplicado/corrompido
"""

import re
from pathlib import Path
import os

def fix_element_palette_exact():
    filepath = 'src/components/Shared/ElementPalette.jsx'
    
    if not Path(filepath).exists():
        print("❌ Arquivo não encontrado!")
        return False
    
    print(f"🔧 Corrigindo {filepath}...")
    
    content = Path(filepath).read_text('utf-8')
    
    # 🔓 REMOVE o código corrompido/duplicado
    content = re.sub(
        r'\.sort\s*\([^)]*\)\s*=>?\s*a\.label\.localeCompare\s*\([^)]*\)\s*;?\s*',
        '',  # Remove completamente
        content,
        flags=re.MULTILINE
    )
    
    # 🔧 ADICIONA código LIMPO e correto
    safe_sort = '''
  // 🔒 Proteção contra label undefined
  const safeElements = elements.map(el => ({
    ...el,
    label: el?.label || el?.type || el?.id || 'Sem nome',
    category: el?.category || 'outros'
  })).sort((a, b) => 
    (a.label || '').localeCompare(b.label || '')
  );
'''
    
    # Insere ANTES do return (ou próximo JSX)
    content = re.sub(
        r'(const elements =.*?;)\s*\n\s*(return|<\w)',
        r'\1' + safe_sort + '\n\n  ',
        content,
        flags=re.MULTILINE | re.DOTALL
    )
    
    Path(filepath).write_text(content, 'utf-8')
    print("✅ ElementPalette.jsx corrigido!")
    
    # Mostra preview das linhas críticas
    print("\n📄 LINHAS 15-35:")
    lines = Path(filepath).read_text().split('\n')[14:35]
    for i, line in enumerate(lines, 15):
        print(f"{i:2d} | {line}")
    
    return True

if __name__ == "__main__":
    if fix_element_palette_exact():
        print("\n🎉 PRONTO! Execute: npm run dev")
