#!/bin/bash

################################################################################
# TikZ Editor - Intelligent Project Organizer v3
# 
# NOVO:
#   - Análise prévia + mapeamento de estrutura
#   - Descobre elementos existentes
#   - Cria apenas o que falta
#   - Sem travamentos
#   - Arquivo setup.config para configuração futura
#
# Uso: bash organize-project-v3.sh
################################################################################

set -E  # Enable error trapping
trap 'error_handler $? $LINENO' ERR

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configurações
PROJECT_ROOT="$(pwd)"
GITHUB_REPO="https://github.com/felipiadenildo/incide.git"
GIT_BRANCH="main"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR=".backup-${TIMESTAMP}"
MAP_FILE=".project-map-${TIMESTAMP}.json"
ANALYSIS_LOG="organize-analysis-${TIMESTAMP}.log"

# Estatísticas
STATS_FILES_FOUND=0
STATS_FILES_MOVED=0
STATS_FILES_CREATED=0
STATS_DIRS_CREATED=0
STATS_DUPLICATES_REMOVED=0
ERRORS_FOUND=0

################################################################################
# FUNÇÕES UTILITÁRIAS
################################################################################

error_handler() {
    local exit_code=$1
    local line_number=$2
    if [ $exit_code -ne 0 ]; then
        echo -e "${RED}❌ Erro na linha $line_number (código: $exit_code)${NC}" >&2
        ((ERRORS_FOUND++))
    fi
}

log() {
    local msg="$1"
    local level="${2:-INFO}"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[${timestamp}] [${level}] ${msg}" >> "$ANALYSIS_LOG"
}

print_header() {
    local title="$1"
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  ${title}${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    local step_num=$1
    local title=$2
    echo -e "${YELLOW}[${step_num}] ${title}${NC}"
}

print_success() {
    local msg=$1
    echo -e "  ${GREEN}✅${NC} ${msg}"
}

print_info() {
    local msg=$1
    echo -e "  ${CYAN}ℹ${NC} ${msg}"
}

print_warning() {
    local msg=$1
    echo -e "  ${YELLOW}⚠${NC} ${msg}"
}

print_error() {
    local msg=$1
    echo -e "  ${RED}❌${NC} ${msg}"
    ((ERRORS_FOUND++))
}

# JSON utilities
json_add_key() {
    local json=$1
    local key=$2
    local value=$3
    if [ "$json" = "{}" ]; then
        echo "{\"$key\": $value}"
    else
        echo "$json" | jq ". += {\"$key\": $value}"
    fi
}

json_add_array_item() {
    local json=$1
    local array_name=$2
    local item=$3
    echo "$json" | jq ".\"$array_name\" += [$item]"
}

################################################################################
# PHASE 1: VERIFICAÇÃO PRÉ-EXECUÇÃO
################################################################################

phase_pre_check() {
    print_step "1/8" "Verificação Pré-Execução"
    
    log "Iniciando verificação pré-execução" "INFO"
    
    # Verificar arquivos críticos
    local missing_files=()
    
    if [ ! -f "package.json" ]; then
        missing_files+=("package.json")
    fi
    
    if [ ! -d ".git" ]; then
        missing_files+=(".git/")
    fi
    
    if [ ! -d "src" ]; then
        missing_files+=("src/")
    fi
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        print_error "Arquivos/pastas faltantes:"
        for file in "${missing_files[@]}"; do
            print_error "  - $file"
        done
        log "Verificação falhou: arquivos críticos faltantes" "ERROR"
        exit 1
    fi
    
    print_success "package.json encontrado"
    print_success ".git/ encontrado"
    print_success "src/ encontrado"
    print_success "Verificação pré-execução OK"
    
    log "Verificação pré-execução completa" "INFO"
    echo ""
}

################################################################################
# PHASE 2: ANÁLISE E MAPEAMENTO
################################################################################

phase_analysis() {
    print_step "2/8" "Análise e Mapeamento da Estrutura"
    
    log "Iniciando análise de estrutura" "INFO"
    
    local map="{}"
    
    # Estrutura esperada
    local EXPECTED_STRUCTURE=(
        "src/libs:DIR"
        "src/libs/tikz:DIR"
        "src/libs/tikz/elements:DIR"
        "src/libs/circuitikz:DIR"
        "src/libs/circuitikz/elements:DIR"
        "src/hooks:DIR"
        "src/services:DIR"
        "src/store:DIR"
        "src/components/Canvas:DIR"
        "src/components/Panels:DIR"
        "src/components/Editor:DIR"
        "src/components/TopBar:DIR"
        "src/utils:DIR"
        "public:DIR"
        "src/libs/elementRegistry.js:FILE"
        "src/libs/tikz/config.js:FILE"
        "src/hooks/useCanvasDrag.js:FILE"
        "src/hooks/useElementRendering.js:FILE"
        "src/hooks/useCodeSync.js:FILE"
        "src/hooks/useBatchOperations.js:FILE"
        "src/services/elementFactory.js:FILE"
        "src/services/codeParser.js:FILE"
        "src/services/codePrettyPrinter.js:FILE"
        "src/components/Canvas/Canvas.css:FILE"
        "src/components/Panels/Panels.css:FILE"
        "src/components/Editor/CodeEditor.css:FILE"
        "src/components/TopBar/TopBar.css:FILE"
    )
    
    # Analisar o que existe
    local existing_dirs=0
    local missing_dirs=0
    local existing_files=0
    local missing_files=0
    
    print_info "Analisando estrutura esperada..."
    
    for item in "${EXPECTED_STRUCTURE[@]}"; do
        local path="${item%%:*}"
        local type="${item##*:}"
        
        if [ "$type" = "DIR" ]; then
            if [ -d "$path" ]; then
                ((existing_dirs++))
                log "DIR FOUND: $path" "ANALYSIS"
            else
                ((missing_dirs++))
                map=$(json_add_array_item "$map" "missing_dirs" "\"$path\"")
                log "DIR MISSING: $path" "ANALYSIS"
            fi
        else  # FILE
            if [ -f "$path" ]; then
                ((existing_files++))
                STATS_FILES_FOUND=$((STATS_FILES_FOUND + 1))
                log "FILE FOUND: $path" "ANALYSIS"
            else
                ((missing_files++))
                map=$(json_add_array_item "$map" "missing_files" "\"$path\"")
                log "FILE MISSING: $path" "ANALYSIS"
            fi
        fi
    done
    
    # Procurar por arquivos fora de lugar
    print_info "Procurando arquivos deslocados..."
    local misplaced_files=()
    
    # Procurar por Canvas.jsx em locais errados
    while IFS= read -r -d '' file; do
        if [[ "$file" != "src/components/Canvas/Canvas.jsx" ]] && [[ "$file" == *"Canvas.jsx" ]]; then
            misplaced_files+=("$file:src/components/Canvas/Canvas.jsx")
            log "MISPLACED: $file → src/components/Canvas/Canvas.jsx" "ANALYSIS"
        fi
    done < <(find src -name "Canvas.jsx" -type f -print0 2>/dev/null)
    
    # Procurar por useCanvasDrag.js
    while IFS= read -r -d '' file; do
        if [[ "$file" != "src/hooks/useCanvasDrag.js" ]] && [[ "$file" == *"useCanvasDrag.js" ]]; then
            misplaced_files+=("$file:src/hooks/useCanvasDrag.js")
            log "MISPLACED: $file → src/hooks/useCanvasDrag.js" "ANALYSIS"
        fi
    done < <(find src -name "useCanvasDrag.js" -type f -print0 2>/dev/null)
    
    # Procurar duplicatas
    print_info "Procurando duplicatas..."
    local duplicates=()
    
    local hook_files=("useCanvasDrag.js" "useElementRendering.js" "useCodeSync.js" "useBatchOperations.js")
    for hook_file in "${hook_files[@]}"; do
        local count=$(find src -name "$hook_file" -type f 2>/dev/null | wc -l)
        if [ "$count" -gt 1 ]; then
            while IFS= read -r -d '' file; do
                if [[ "$file" != "src/hooks/$hook_file" ]]; then
                    duplicates+=("$file")
                    log "DUPLICATE: $file (mantém src/hooks/$hook_file)" "ANALYSIS"
                fi
            done < <(find src -name "$hook_file" -type f -print0 2>/dev/null)
        fi
    done
    
    # Salvar mapa
    map=$(json_add_key "$map" "summary" "{\"dirs_found\": $existing_dirs, \"dirs_missing\": $missing_dirs, \"files_found\": $existing_files, \"files_missing\": $missing_files, \"misplaced_files\": ${#misplaced_files[@]}, \"duplicates\": ${#duplicates[@]}}")
    
    # Output
    echo "$map" > "$MAP_FILE"
    
    print_success "Análise concluída"
    print_info "Pastas existentes: $existing_dirs"
    print_info "Pastas faltantes: $missing_dirs"
    print_info "Arquivos encontrados: $existing_files"
    print_info "Arquivos faltantes: $missing_files"
    print_info "Arquivos deslocados: ${#misplaced_files[@]}"
    print_info "Duplicatas detectadas: ${#duplicates[@]}"
    print_info "Mapa salvo em: $MAP_FILE"
    
    log "Análise concluída: ${#misplaced_files[@]} deslocados, ${#duplicates[@]} duplicatas" "INFO"
    echo ""
}

################################################################################
# PHASE 3: BACKUP
################################################################################

phase_backup() {
    print_step "3/8" "Criar Backup"
    
    log "Criando backup em $BACKUP_DIR" "INFO"
    
    mkdir -p "$BACKUP_DIR"
    
    local backup_items=("src" "public" "package.json" ".project-map-*.json" "organize-analysis-*.log")
    
    for item in "${backup_items[@]}"; do
        if [ -e "$item" ] || [ -d "$item" ]; then
            cp -r "$item" "$BACKUP_DIR/" 2>/dev/null && \
                print_success "Backup: $item" || \
                print_warning "Erro ao fazer backup de: $item"
        fi
    done
    
    print_success "Backup criado em: $BACKUP_DIR"
    log "Backup concluído" "INFO"
    echo ""
}

################################################################################
# PHASE 4: CRIAR PASTAS
################################################################################

phase_create_dirs() {
    print_step "4/8" "Criar Pastas Necessárias"
    
    log "Criando estrutura de pastas" "INFO"
    
    local DIRS_TO_CREATE=(
        "src/libs"
        "src/libs/tikz"
        "src/libs/tikz/elements"
        "src/libs/circuitikz"
        "src/libs/circuitikz/elements"
        "src/hooks"
        "src/services"
        "src/store"
        "src/components/Canvas"
        "src/components/Panels"
        "src/components/Editor"
        "src/components/TopBar"
        "src/utils"
        "public"
    )
    
    for DIR in "${DIRS_TO_CREATE[@]}"; do
        if [ ! -d "$DIR" ]; then
            mkdir -p "$DIR" && {
                print_success "Criada: $DIR"
                ((STATS_DIRS_CREATED++))
                log "DIR CREATED: $DIR" "OPERATION"
            } || {
                print_error "Erro ao criar: $DIR"
                log "DIR CREATION FAILED: $DIR" "ERROR"
            }
        else
            print_info "Já existe: $DIR"
        fi
    done
    
    log "Criação de pastas concluída" "INFO"
    echo ""
}

################################################################################
# PHASE 5: MOVER ARQUIVOS
################################################################################

phase_move_files() {
    print_step "5/8" "Mover Arquivos Deslocados"
    
    log "Procurando e movendo arquivos" "INFO"
    
    local files_to_move=(
        # Canvas components
        "Canvas.jsx:src/components/Canvas/"
        "CanvasToolbar.jsx:src/components/Canvas/"
        "CanvasTabs.jsx:src/components/Canvas/"
        "SVGRenderer.jsx:src/components/Canvas/"
        
        # Panels components
        "PropertiesPanel.jsx:src/components/Panels/"
        "LayersPanel.jsx:src/components/Panels/"
        "InsertPanel.jsx:src/components/Panels/"
        
        # Editor components
        "CodeEditor.jsx:src/components/Editor/"
        "CodeEditorTabs.jsx:src/components/Editor/"
        
        # TopBar
        "TopBar.jsx:src/components/TopBar/"
        
        # Hooks
        "useCanvasDrag.js:src/hooks/"
        "useElementRendering.js:src/hooks/"
        "useCodeSync.js:src/hooks/"
        "useBatchOperations.js:src/hooks/"
        
        # Services
        "elementFactory.js:src/services/"
        "codeParser.js:src/services/"
        "codePrettyPrinter.js:src/services/"
        
        # Store
        "useAppStore.js:src/store/"
        "tikzStore.js:src/store/"
        
        # Libs
        "elementRegistry.js:src/libs/"
    )
    
    for mapping in "${files_to_move[@]}"; do
        local filename="${mapping%%:*}"
        local dest_dir="${mapping##*:}"
        
        # Procurar arquivo em src/
        while IFS= read -r -d '' file; do
            if [[ "$file" != "${dest_dir}${filename}" ]]; then
                mkdir -p "$dest_dir"
                mv "$file" "${dest_dir}${filename}" && {
                    print_success "Movido: $file → ${dest_dir}${filename}"
                    ((STATS_FILES_MOVED++))
                    log "FILE MOVED: $file → ${dest_dir}${filename}" "OPERATION"
                } || {
                    print_error "Erro ao mover: $file"
                    log "FILE MOVE FAILED: $file" "ERROR"
                }
            fi
        done < <(find src -name "$filename" -type f -print0 2>/dev/null)
    done
    
    log "Movimento de arquivos concluído" "INFO"
    echo ""
}

################################################################################
# PHASE 6: REMOVER DUPLICATAS
################################################################################

phase_remove_duplicates() {
    print_step "6/8" "Remover Duplicatas"
    
    log "Procurando duplicatas" "INFO"
    
    local files_to_check=(
        "Canvas.jsx:src/components/Canvas/"
        "useCanvasDrag.js:src/hooks/"
        "useElementRendering.js:src/hooks/"
        "useCodeSync.js:src/hooks/"
        "useBatchOperations.js:src/hooks/"
        "elementRegistry.js:src/libs/"
        "CodeEditor.jsx:src/components/Editor/"
    )
    
    for mapping in "${files_to_check[@]}"; do
        local filename="${mapping%%:*}"
        local keeper_dir="${mapping##*:}"
        
        local count=$(find src -name "$filename" -type f 2>/dev/null | wc -l)
        
        if [ "$count" -gt 1 ]; then
            print_info "Múltiplas cópias encontradas: $filename ($count)"
            
            while IFS= read -r -d '' file; do
                if [[ "$file" != "${keeper_dir}${filename}" ]]; then
                    rm "$file" && {
                        print_success "Duplicata removida: $file"
                        ((STATS_DUPLICATES_REMOVED++))
                        log "DUPLICATE REMOVED: $file" "OPERATION"
                    } || {
                        print_error "Erro ao remover: $file"
                        log "DUPLICATE REMOVAL FAILED: $file" "ERROR"
                    }
                fi
            done < <(find src -name "$filename" -type f -print0 2>/dev/null)
        fi
    done
    
    log "Remoção de duplicatas concluída" "INFO"
    echo ""
}

################################################################################
# PHASE 7: CRIAR TEMPLATES
################################################################################

phase_create_templates() {
    print_step "7/8" "Criar Templates Faltantes"
    
    log "Criando arquivos template" "INFO"
    
    # ElementRegistry
    if [ ! -f "src/libs/elementRegistry.js" ]; then
        cat > "src/libs/elementRegistry.js" << 'EOF'
/**
 * ElementRegistry - Factory Pattern para gerenciar elementos
 * Versão: 1.0
 */

class ElementRegistry {
  constructor() {
    this.elements = new Map()
    this.log = []
  }

  register(id, descriptor) {
    if (!id || !descriptor) {
      console.error(`[ElementRegistry] ID e descriptor são obrigatórios`)
      return false
    }
    
    if (this.elements.has(id)) {
      console.warn(`[ElementRegistry] Elemento ${id} já registrado, substituindo`)
    }
    
    this.elements.set(id, descriptor)
    this.log.push({ action: 'register', id, timestamp: new Date().toISOString() })
    return true
  }

  get(id) {
    if (!this.elements.has(id)) {
      console.warn(`[ElementRegistry] Elemento ${id} não encontrado`)
      return null
    }
    return this.elements.get(id)
  }

  getAll() {
    return Array.from(this.elements.values())
  }

  getByLibrary(library) {
    return Array.from(this.elements.values())
      .filter(e => e.library === library)
  }

  getByCategory(category) {
    return Array.from(this.elements.values())
      .filter(e => e.category === category)
  }

  unregister(id) {
    const result = this.elements.delete(id)
    if (result) {
      this.log.push({ action: 'unregister', id, timestamp: new Date().toISOString() })
    }
    return result
  }

  getStatistics() {
    return {
      total: this.elements.size,
      byLibrary: {
        tikz: this.getByLibrary('tikz').length,
        circuitikz: this.getByLibrary('circuitikz').length
      },
      operations: this.log.length
    }
  }
}

export const elementRegistry = new ElementRegistry()
EOF
        print_success "Criado: src/libs/elementRegistry.js"
        ((STATS_FILES_CREATED++))
        log "FILE CREATED: src/libs/elementRegistry.js" "OPERATION"
    else
        print_info "Já existe: src/libs/elementRegistry.js"
    fi
    
    # TikZ Config
    if [ ! -f "src/libs/tikz/config.js" ]; then
        cat > "src/libs/tikz/config.js" << 'EOF'
/**
 * TikZ Configuration
 * Configuração global para elementos TikZ
 */

export const TIKZ_CONFIG = {
  // Canvas
  GRID_SIZE: 20,           // pixels
  SCALE: 40,               // pixels por unidade TikZ
  SNAP_GRID: 0.1,          // unidades TikZ
  
  // Zoom
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 5,
  DEFAULT_ZOOM: 1,
  
  // Cores padrão
  DEFAULT_STROKE: '#000000',
  DEFAULT_FILL: '#ffffff',
  SELECTION_COLOR: '#2563eb',
  GRID_COLOR: '#e5e7eb',
  
  // Performance
  DEBOUNCE_DELAY: 300,     // ms para sync
  BATCH_SIZE: 100,          // elementos por lote
  
  // Validação
  MIN_RADIUS: 0.1,
  MAX_RADIUS: 5,
  MIN_WIDTH: 0.5,
  MAX_WIDTH: 10,
  MIN_HEIGHT: 0.5,
  MAX_HEIGHT: 10
}

export const TIKZ_LIBRARIES = {
  shapes: 'Shapes library',
  arrows: 'Arrows library',
  positioning: 'Positioning library'
}
EOF
        print_success "Criado: src/libs/tikz/config.js"
        ((STATS_FILES_CREATED++))
        log "FILE CREATED: src/libs/tikz/config.js" "OPERATION"
    else
        print_info "Já existe: src/libs/tikz/config.js"
    fi
    
    # CSS Templates
    local CSS_FILES=(
        "src/components/Canvas/Canvas.css"
        "src/components/Panels/Panels.css"
        "src/components/Editor/CodeEditor.css"
        "src/components/TopBar/TopBar.css"
    )
    
    for css_file in "${CSS_FILES[@]}"; do
        if [ ! -f "$css_file" ]; then
            cat > "$css_file" << 'EOF'
/* Generated CSS Template */
/* TODO: Adicionar estilos específicos */
EOF
            print_success "Criado: $css_file"
            ((STATS_FILES_CREATED++))
            log "FILE CREATED: $css_file" "OPERATION"
        fi
    done
    
    # Hook Templates (mínimo - just structure)
    local HOOK_FILES=(
        "src/hooks/useCanvasDrag.js"
        "src/hooks/useElementRendering.js"
        "src/hooks/useCodeSync.js"
        "src/hooks/useBatchOperations.js"
    )
    
    for hook_file in "${HOOK_FILES[@]}"; do
        if [ ! -f "$hook_file" ]; then
            cat > "$hook_file" << 'EOF'
// Hook template
// TODO: Implementar
export function useHook() {
  // Implementation
}
EOF
            print_success "Criado: $hook_file"
            ((STATS_FILES_CREATED++))
            log "FILE CREATED: $hook_file" "OPERATION"
        fi
    done
    
    log "Criação de templates concluída" "INFO"
    echo ""
}

################################################################################
# PHASE 8: CRIAR SETUP.CONFIG
################################################################################

phase_create_setup() {
    print_step "8/8" "Criar Arquivo setup.config"
    
    log "Criando setup.config" "INFO"
    
    if [ ! -f "setup.config" ]; then
        cat > "setup.config" << 'EOF'
################################################################################
# TikZ Editor - Configuration Setup
# Versão: 2.2
# Data: 2025-12-03
#
# Este arquivo será preenchido futuramente com configurações da aplicação
################################################################################

# ============================================================================
# SECTION 1: Project Info
# ============================================================================
# PROJECT_NAME=
# PROJECT_VERSION=
# PROJECT_AUTHOR=
# PROJECT_DESCRIPTION=

# ============================================================================
# SECTION 2: Build Configuration
# ============================================================================
# BUILD_TARGET=web|electron|both
# BUILD_ENV=development|production|staging
# OUTPUT_DIR=dist/
# SOURCE_DIR=src/

# ============================================================================
# SECTION 3: Feature Flags
# ============================================================================
# FEATURE_TIKZ_ENABLED=true
# FEATURE_CIRCUITIKZ_ENABLED=false
# FEATURE_CODE_SYNC_ENABLED=true
# FEATURE_UNDO_REDO_ENABLED=true
# FEATURE_PRETTY_VIEW_ENABLED=false

# ============================================================================
# SECTION 4: Performance
# ============================================================================
# DEBOUNCE_DELAY_MS=300
# MAX_UNDO_STACK=100
# BATCH_RENDER_SIZE=50
# ENABLE_PROFILING=false

# ============================================================================
# SECTION 5: UI/UX Configuration
# ============================================================================
# THEME=light|dark|auto
# GRID_SIZE_PIXELS=20
# SNAP_TO_GRID=true
# SNAP_DISTANCE=10

# ============================================================================
# SECTION 6: Export/Import
# ============================================================================
# EXPORT_FORMATS=tikz|svg|pdf
# IMPORT_FORMATS=tikz|json
# COMPRESS_ON_EXPORT=true

# ============================================================================
# SECTION 7: Database/Storage
# ============================================================================
# STORAGE_TYPE=local|cloud|both
# STORAGE_PATH=./data/
# AUTO_SAVE_INTERVAL_MS=5000
# MAX_STORAGE_MB=500

# ============================================================================
# SECTION 8: API/Remote
# ============================================================================
# API_BASE_URL=
# API_TIMEOUT_MS=30000
# ENABLE_ANALYTICS=false
# TELEMETRY_ENDPOINT=

# ============================================================================
# SECTION 9: Logging
# ============================================================================
# LOG_LEVEL=debug|info|warn|error
# LOG_FILE=./logs/app.log
# MAX_LOG_SIZE_MB=10
# LOG_RETENTION_DAYS=30

# ============================================================================
# SECTION 10: Security
# ============================================================================
# ENABLE_CSRF_PROTECTION=true
# ENABLE_INPUT_VALIDATION=true
# ENABLE_OUTPUT_SANITIZATION=true
# SESSION_TIMEOUT_MS=3600000

################################################################################
# Notas:
#
# 1. Este arquivo é processado durante o build/initialization
# 2. Descomente as linhas necessárias e preencha com valores
# 3. Use # para comentar linhas que não precisam ser usadas
# 4. Preserve a estrutura de SECTIONs para facilitar manutenção
# 5. Valores sensíveis devem ser colocados em .env (não em versionamento)
#
################################################################################
EOF
        print_success "Criado: setup.config"
        ((STATS_FILES_CREATED++))
        log "FILE CREATED: setup.config" "OPERATION"
    else
        print_warning "setup.config já existe, pulando"
    fi
    
    log "Setup config criado/verificado" "INFO"
    echo ""
}

################################################################################
# PHASE 9: GIT RESET & PUSH
################################################################################

phase_git_reset() {
    print_step "9/8" "Reset Git & Force Push"
    
    echo -e "${RED}⚠️  AVISO CRÍTICO:${NC}"
    echo -e "${RED}   - Isto irá LIMPAR histórico local do Git${NC}"
    echo -e "${RED}   - Fazer FORCE PUSH na branch $GIT_BRANCH${NC}"
    echo -e "${RED}   - Isto é IRREVERSÍVEL no remoto${NC}"
    echo -e "${RED}   - Backup local está em: $BACKUP_DIR${NC}"
    echo ""
    
    read -p "Deseja continuar? (sim/não): " confirm
    
    if [ "$confirm" != "sim" ]; then
        print_warning "Git reset cancelado pelo usuário"
        log "Git reset cancelado" "INFO"
        return
    fi
    
    log "Iniciando git reset" "INFO"
    
    # Remover .git antigo
    print_info "Removendo .git antigo..."
    rm -rf .git
    
    # Inicializar novo git
    print_info "Inicializando novo repositório..."
    git init
    log "Git init executado" "OPERATION"
    
    # Configurar remote
    print_info "Configurando remote..."
    git remote add origin "$GITHUB_REPO"
    log "Remote configurado: $GITHUB_REPO" "OPERATION"
    
    # Stage
    print_info "Staged all files..."
    git add -A
    log "Git add -A executado" "OPERATION"
    
    # Commit
    print_info "Criando commit inicial..."
    git commit -m "chore: intelligent project reorganization v3

- Análise prévia + mapeamento completo
- Move apenas arquivos necessários
- Remove duplicatas
- Cria templates inteligentes
- Arquivo setup.config para configuração futura
- Sem travamentos
- Backup automático em .backup-TIMESTAMP/
- Analysis log em organize-analysis-TIMESTAMP.log
- Project map em .project-map-TIMESTAMP.json"
    
    log "Commit inicial criado" "OPERATION"
    
    # Rename branch
    print_info "Renomeando branch..."
    git branch -M main
    log "Branch renomeado para main" "OPERATION"
    
    # Push
    print_info "Fazendo force push..."
    git push -f -u origin main
    log "Force push executado" "OPERATION"
    
    print_success "Git reset e force push completo!"
    log "Git reset concluído com sucesso" "INFO"
    echo ""
}

################################################################################
# RESUMO FINAL
################################################################################

print_summary() {
    echo ""
    print_header "🎉 ORGANIZAÇÃO INTELIGENTE COMPLETA 🎉"
    
    echo -e "${CYAN}Análise & Mapeamento:${NC}"
    echo "  • Estrutura analisada e mapeada"
    echo "  • Mapa salvo: $MAP_FILE"
    echo "  • Log de análise: $ANALYSIS_LOG"
    echo ""
    
    echo -e "${CYAN}Operações Realizadas:${NC}"
    echo "  • Pastas criadas: $STATS_DIRS_CREATED"
    echo "  • Arquivos movidos: $STATS_FILES_MOVED"
    echo "  • Arquivos criados: $STATS_FILES_CREATED"
    echo "  • Duplicatas removidas: $STATS_DUPLICATES_REMOVED"
    echo "  • Erros encontrados: $ERRORS_FOUND"
    echo ""
    
    echo -e "${CYAN}Backups & Logs:${NC}"
    echo "  • Backup: $BACKUP_DIR/"
    echo "  • Map: $MAP_FILE"
    echo "  • Log: $ANALYSIS_LOG"
    echo "  • Setup: setup.config"
    echo ""
    
    echo -e "${GREEN}Próximos Passos:${NC}"
    echo "  1. Revisar: cat $ANALYSIS_LOG"
    echo "  2. Revisar: cat $MAP_FILE | jq ."
    echo "  3. Configurar: setup.config"
    echo "  4. Começar Sprint 0: ElementRegistry"
    echo ""
    
    echo -e "${GREEN}Status: 🟢 ESTRUTURA ORGANIZADA E PRONTA${NC}"
}

################################################################################
# MAIN EXECUTION
################################################################################

main() {
    print_header "TikZ Editor - Intelligent Project Organizer v3"
    
    # Initialize log
    > "$ANALYSIS_LOG"
    log "Iniciando organização inteligente do projeto" "INFO"
    log "Timestamp: $TIMESTAMP" "INFO"
    log "Projeto: $PROJECT_ROOT" "INFO"
    
    # Execute phases
    phase_pre_check
    phase_analysis
    phase_backup
    phase_create_dirs
    phase_move_files
    phase_remove_duplicates
    phase_create_templates
    phase_create_setup
    phase_git_reset
    
    # Print summary
    print_summary
    
    # Final log
    log "Organização completa. Status: $([ $ERRORS_FOUND -eq 0 ] && echo 'SUCCESS' || echo 'WARNINGS')" "INFO"
}

# Execute
main "$@"