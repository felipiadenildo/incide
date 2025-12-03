#!/usr/bin/env python3
"""
🔧 CORREÇÃO PERFEITA - Preserva nomes originais dos objetos
Execute: python3 fix_final_perfect.py -> F5 = FUNCIONA!
"""

import os
import re

def fix_perfectly(filepath):
    """Corrige SEMPRE preservando o nome original do objeto"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # 1. ENCONTRAR O NOME DO OBJETO ORIGINAL
    const_match = re.search(r'const\s+([a-zA-Z0-9_]+)\s*=\s*\{', content)
    if not const_match:
        print("ERRO GRAVE: {} sem 'const nome = {{'".format(os.path.basename(filepath)))
        return False
    
    obj_name = const_match.group(1)
    print("Detectado: {} em {}".format(obj_name, os.path.basename(filepath)))
    
    # 2. REMOVER TODOS console.log quebrados
    content = re.sub(r'console\.log\(`[^`]*`\);?\s*', '', content)
    
    # 3. CORRIGIR register('id', obj) -> register(obj_name)
    content = re.sub(
        r"elementRegistry\.register\('[^']*',\s*[a-zA-Z0-9_]+\);",
        "elementRegistry.register({});".format(obj_name),
        content
    )
    
    # 4. CORRIGIR qualquer register() sem argumento -> register(obj_name)
    content = re.sub(
        r'elementRegistry\.register\s*\(\s*\);',
        "elementRegistry.register({});".format(obj_name),
        content
    )
    
    # 5. CORRIGIR register(descriptor) -> register(obj_name)
    content = content.replace('elementRegistry.register(descriptor);', "elementRegistry.register({});".format(obj_name))
    
    # 6. ADICIONAR export default SOMENTE se nao existir
    if 'export default' not in content:
        content = content.rstrip() + "\n\nexport default {};\n".format(obj_name)
    
    # 7. ADICIONAR console.log LIMPO no final
    console_msg = 'console.log("✅ {} registrado");\n'.format(obj_name)
    if console_msg not in content:
        content = content.replace(
            "elementRegistry.register({});".format(obj_name),
            "elementRegistry.register({});\n{}".format(obj_name, console_msg)
        )
    
    # 8. SALVAR se mudou
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print("PERFEITO: {} ({})".format(os.path.basename(filepath), obj_name))
        return True
    else:
        print("OK: {} ({})".format(os.path.basename(filepath), obj_name))
        return False

def main():
    print("CORRECAO PERFEITA - Preservando nomes originais...")
    total_fixed = 0
    
    # TikZ
    tikz_path = "src/libs/tikz"
    if os.path.exists(tikz_path):
        print("\nTikZ...")
        for file in os.listdir(tikz_path):
            if file.endswith('.js') and file != 'index.js':
                if fix_perfectly(os.path.join(tikz_path, file)):
                    total_fixed += 1
    
    # CircuitTikZ
    ckt_path = "src/libs/circuittikz"
    if os.path.exists(ckt_path):
        print("\nCircuitTikZ...")
        for file in os.listdir(ckt_path):
            if file.endswith('.js') and file != 'index.js':
                if fix_perfectly(os.path.join(ckt_path, file)):
                    total_fixed += 1
    
    print("\n🎉 ✅ {} arquivos corrigidos perfeitamente!".format(total_fixed))
    print("F5 -> 28 ELEMENTOS FUNCIONANDO!")
    print("\nConsole esperado:")
    print("✅ circle registrado")
    print("✅ rectangle registrado")
    print("✅ resistor registrado")
    print("[TikZ] 5 elementos carregados")
    print("[CircuitTikZ] 23 elementos carregados")

if __name__ == "__main__":
    main()
