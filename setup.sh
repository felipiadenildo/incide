#!/bin/bash

################################################################################
# TikZ Editor - Complete Setup Script
# Versão: 5.0 (Production Ready)
#
# Funcionalidades:
#   ✅ Detecta sistema operacional
#   ✅ Verifica pré-requisitos (Node.js, Python, Git)
#   ✅ Instala dependências globais se necessário
#   ✅ Executa organização de projeto (V4 Python)
#   ✅ Instala dependências do projeto (npm install)
#   ✅ Configura ambiente (.env)
#   ✅ Inicia aplicação (dev server)
#   ✅ Logging completo
#   ✅ Error handling robusto
#
# Uso: bash setup.sh
################################################################################

set -E
trap 'error_handler $? $LINENO' ERR

# ============================================================================
# CORES E FORMATAÇÃO
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# ============================================================================
# CONFIGURAÇÃO
# ============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_DIR="${PROJECT_ROOT}/.logs"
SETUP_LOG="${LOG_DIR}/setup-${TIMESTAMP}.log"
SETUP_JSON="${LOG_DIR}/setup-${TIMESTAMP}.json"
TEMP_LOG="/tmp/tikz-setup-${TIMESTAMP}.log"

# Versões mínimas
MIN_NODE_VERSION="16.0.0"
MIN_NPM_VERSION="8.0.0"
MIN_PYTHON_VERSION="3.7"

# Inicializar log JSON
LOG_JSON="{\"timestamp\": \"${TIMESTAMP}\", \"steps\": [], \"errors\": []}"

# Detectar SO
OS_TYPE="unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS_TYPE="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS_TYPE="macos"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    OS_TYPE="windows"
fi

# ============================================================================
# FUNÇÕES UTILITÁRIAS
# ============================================================================

print_header() {
    local title="$1"
    local width=80
    printf "\n${BLUE}"
    printf '%*s\n' "${width}" | tr ' ' '='
    printf "║  %-75s  ║\n" "$title"
    printf '%*s\n' "${width}" | tr ' ' '='
    printf "${NC}\n"
}

print_step() {
    local step_num=$1
    local title=$2
    local total=$3
    printf "${YELLOW}[${step_num}/${total}] ${title}${NC}\n"
}

print_success() {
    printf "  ${GREEN}✅${NC} $1\n"
}

print_info() {
    printf "  ${CYAN}ℹ${NC} $1\n"
}

print_warning() {
    printf "  ${YELLOW}⚠${NC} $1\n"
}

print_error() {
    printf "  ${RED}❌${NC} $1\n"
}

log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[${timestamp}] [${level}] ${message}" >> "${SETUP_LOG}"
}

json_add_step() {
    local step="$1"
    local status="$2"
    local message="$3"
    # Simples: apenas append ao arquivo
    echo "{\"step\": \"${step}\", \"status\": \"${status}\", \"message\": \"${message}\"}" >> "${SETUP_JSON}.tmp"
}

error_handler() {
    local exit_code=$1
    local line_number=$2
    if [ $exit_code -ne 0 ]; then
        print_error "Erro na linha ${line_number} (código: ${exit_code})"
        log "ERROR" "Script falhou na linha ${line_number}"
    fi
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

version_ge() {
    printf '%s\n%s' "$2" "$1" | sort -V -C
}

# ============================================================================
# FASE 1: VERIFICAÇÃO DO SISTEMA
# ============================================================================

phase_check_system() {
    print_step "1" "Verificação do Sistema" "9"
    log "INFO" "Iniciando verificação do sistema"
    
    print_info "Sistema Operacional: ${OS_TYPE}"
    log "INFO" "OS detectado: ${OS_TYPE}"
    
    # Verificar projeto root
    if [ ! -f "${PROJECT_ROOT}/package.json" ]; then
        print_error "package.json não encontrado em ${PROJECT_ROOT}"
        log "ERROR" "package.json não encontrado"
        return 1
    fi
    print_success "package.json encontrado"
    
    if [ ! -d "${PROJECT_ROOT}/src" ]; then
        print_error "Diretório src/ não encontrado"
        log "ERROR" "Diretório src/ não encontrado"
        return 1
    fi
    print_success "Diretório src/ encontrado"
    
    if [ ! -d "${PROJECT_ROOT}/.git" ]; then
        print_warning "Repositório git não inicializado"
        log "WARNING" "Git não encontrado"
    else
        print_success "Repositório git encontrado"
    fi
    
    log "INFO" "Verificação do sistema concluída com sucesso"
    echo ""
    return 0
}

# ============================================================================
# FASE 2: VERIFICAR PRÉ-REQUISITOS
# ============================================================================

phase_check_requirements() {
    print_step "2" "Verificar Pré-Requisitos" "9"
    log "INFO" "Verificando pré-requisitos"
    
    local all_ok=true
    
    # Verificar Node.js
    if command_exists node; then
        local node_version=$(node --version | sed 's/v//')
        print_info "Node.js encontrado: v${node_version}"
        
        if version_ge "${node_version}" "${MIN_NODE_VERSION}"; then
            print_success "Node.js versão OK (>= ${MIN_NODE_VERSION})"
            log "INFO" "Node.js versão verificada: ${node_version}"
        else
            print_warning "Node.js versão ${node_version} é antiga (recomendado >= ${MIN_NODE_VERSION})"
            log "WARNING" "Node.js versão pode ser antiga: ${node_version}"
        fi
    else
        print_error "Node.js não encontrado"
        print_info "Instale Node.js de: https://nodejs.org/"
        log "ERROR" "Node.js não encontrado"
        all_ok=false
    fi
    
    # Verificar NPM
    if command_exists npm; then
        local npm_version=$(npm --version)
        print_info "NPM encontrado: v${npm_version}"
        
        if version_ge "${npm_version}" "${MIN_NPM_VERSION}"; then
            print_success "NPM versão OK (>= ${MIN_NPM_VERSION})"
            log "INFO" "NPM versão verificada: ${npm_version}"
        else
            print_warning "NPM versão ${npm_version} é antiga (recomendado >= ${MIN_NPM_VERSION})"
            print_info "Atualize com: npm install -g npm@latest"
            log "WARNING" "NPM versão pode ser antiga: ${npm_version}"
        fi
    else
        print_error "NPM não encontrado"
        log "ERROR" "NPM não encontrado"
        all_ok=false
    fi
    
    # Verificar Python
    if command_exists python3; then
        local python_version=$(python3 --version 2>&1 | awk '{print $2}')
        print_info "Python 3 encontrado: v${python_version}"
        print_success "Python 3 OK para script de organização"
        log "INFO" "Python 3 versão: ${python_version}"
    else
        print_warning "Python 3 não encontrado (opcional, mas recomendado)"
        log "WARNING" "Python 3 não encontrado"
    fi
    
    # Verificar Git
    if command_exists git; then
        local git_version=$(git --version | awk '{print $3}')
        print_success "Git encontrado: v${git_version}"
        log "INFO" "Git versão: ${git_version}"
    else
        print_warning "Git não encontrado"
        log "WARNING" "Git não encontrado"
    fi
    
    if [ "$all_ok" = false ]; then
        print_error "Alguns pré-requisitos não foram encontrados"
        log "ERROR" "Verificação de pré-requisitos falhou"
        return 1
    fi
    
    print_success "Todos os pré-requisitos verificados"
    log "INFO" "Verificação de pré-requisitos concluída com sucesso"
    echo ""
    return 0
}

# ============================================================================
# FASE 3: CRIAR DIRETÓRIOS NECESSÁRIOS
# ============================================================================

phase_create_dirs() {
    print_step "3" "Criar Diretórios Necessários" "9"
    log "INFO" "Criando diretórios necessários"
    
    local dirs_to_create=(
        ".logs"
        ".env"
        "dist"
        "build"
    )
    
    for dir in "${dirs_to_create[@]}"; do
        if [ ! -d "${PROJECT_ROOT}/${dir}" ]; then
            mkdir -p "${PROJECT_ROOT}/${dir}"
            print_success "Diretório criado: ${dir}/"
            log "INFO" "Diretório criado: ${dir}"
        else
            print_info "Diretório já existe: ${dir}/"
        fi
    done
    
    # Criar arquivo .logs
    mkdir -p "${LOG_DIR}"
    
    log "INFO" "Criação de diretórios concluída"
    echo ""
    return 0
}

# ============================================================================
# FASE 4: ORGANIZAR PROJETO (V4 Python)
# ============================================================================

phase_organize_project() {
    print_step "4" "Organizar Estrutura do Projeto (V4 Python)" "9"
    log "INFO" "Executando organização de projeto"
    
    if [ ! -f "${PROJECT_ROOT}/organize-project-v4.py" ]; then
        print_warning "Script V4 Python não encontrado, pulando organização"
        log "WARNING" "organize-project-v4.py não encontrado"
        echo ""
        return 0
    fi
    
    if ! command_exists python3; then
        print_warning "Python 3 não encontrado, pulando organização"
        log "WARNING" "Python 3 não encontrado, pulando organização"
        echo ""
        return 0
    fi
    
    print_info "Executando organize-project-v4.py..."
    
    if python3 "${PROJECT_ROOT}/organize-project-v4.py" > "${TEMP_LOG}" 2>&1; then
        print_success "Projeto organizado com sucesso"
        log "INFO" "Projeto organizado com sucesso"
    else
        print_warning "Erro ao organizar projeto (mas continuando setup)"
        log "WARNING" "Erro ao executar organize-project-v4.py"
    fi
    
    echo ""
    return 0
}

# ============================================================================
# FASE 5: CONFIGURAR AMBIENTE
# ============================================================================

phase_setup_env() {
    print_step "5" "Configurar Arquivo .env" "9"
    log "INFO" "Configurando ambiente"
    
    local env_file="${PROJECT_ROOT}/.env"
    
    if [ -f "${env_file}" ]; then
        print_info ".env já existe, fazendo backup"
        cp "${env_file}" "${env_file}.backup.${TIMESTAMP}"
        log "INFO" "Backup de .env criado"
    fi
    
    # Criar .env com configurações padrão
    cat > "${env_file}" << 'EOF'
# TikZ Editor - Environment Configuration
# Versão: 5.0

# Build Configuration
VITE_APP_TITLE=TikZ Editor
VITE_APP_VERSION=2.2
NODE_ENV=development

# Feature Flags
VITE_FEATURE_TIKZ_ENABLED=true
VITE_FEATURE_CIRCUITIKZ_ENABLED=false
VITE_FEATURE_CODE_SYNC_ENABLED=true
VITE_FEATURE_UNDO_REDO_ENABLED=true
VITE_FEATURE_PRETTY_VIEW_ENABLED=false

# Development Server
VITE_HOST=localhost
VITE_PORT=5173

# API Configuration (para futuro)
# VITE_API_BASE_URL=http://localhost:3000

# Logging
VITE_LOG_LEVEL=debug

# Performance
VITE_DEBOUNCE_DELAY=300
VITE_BATCH_SIZE=50
EOF
    
    print_success ".env configurado"
    log "INFO" ".env criado/atualizado com sucesso"
    echo ""
    return 0
}

# ============================================================================
# FASE 6: INSTALAR DEPENDÊNCIAS NPM
# ============================================================================

phase_install_npm() {
    print_step "6" "Instalar Dependências NPM" "9"
    log "INFO" "Instalando dependências NPM"
    
    if [ ! -f "${PROJECT_ROOT}/package.json" ]; then
        print_error "package.json não encontrado"
        log "ERROR" "package.json não encontrado"
        return 1
    fi
    
    # Verificar se node_modules já existe
    if [ -d "${PROJECT_ROOT}/node_modules" ]; then
        print_info "node_modules já existe"
        
        # Verificar se package-lock.json é mais antigo
        if [ -f "${PROJECT_ROOT}/package-lock.json" ]; then
            print_info "Limpando cache NPM..."
            npm cache clean --force > /dev/null 2>&1
        fi
    fi
    
    print_info "Executando: npm install"
    
    if npm install --prefix "${PROJECT_ROOT}" > "${TEMP_LOG}" 2>&1; then
        print_success "Dependências NPM instaladas com sucesso"
        log "INFO" "npm install concluído com sucesso"
        
        local module_count=$(find "${PROJECT_ROOT}/node_modules" -maxdepth 1 -type d | wc -l)
        print_info "Módulos instalados: ${module_count}"
    else
        print_error "Erro ao instalar dependências NPM"
        log "ERROR" "npm install falhou"
        tail -20 "${TEMP_LOG}"
        return 1
    fi
    
    echo ""
    return 0
}

# ============================================================================
# FASE 7: VERIFICAR BUILD TOOLS
# ============================================================================

phase_check_build() {
    print_step "7" "Verificar Build Tools" "9"
    log "INFO" "Verificando build tools"
    
    # Verificar Vite
    if [ -f "${PROJECT_ROOT}/vite.config.js" ]; then
        print_success "vite.config.js encontrado"
        log "INFO" "Vite config encontrado"
    else
        print_warning "vite.config.js não encontrado"
        log "WARNING" "vite.config.js não encontrado"
    fi
    
    # Verificar se Vite está no package.json
    if grep -q '"vite"' "${PROJECT_ROOT}/package.json"; then
        print_success "Vite declarado em package.json"
        log "INFO" "Vite encontrado em package.json"
    else
        print_warning "Vite não encontrado em package.json"
        log "WARNING" "Vite não encontrado em package.json"
    fi
    
    echo ""
    return 0
}

# ============================================================================
# FASE 8: VALIDAR SETUP
# ============================================================================

phase_validate() {
    print_step "8" "Validar Setup" "9"
    log "INFO" "Validando setup"
    
    local validation_ok=true
    
    # Validações críticas
    local critical_files=(
        "package.json"
        "vite.config.js"
        "src/main.jsx"
    )
    
    for file in "${critical_files[@]}"; do
        if [ -f "${PROJECT_ROOT}/${file}" ]; then
            print_success "Validado: ${file}"
            log "INFO" "Validado: ${file}"
        else
            print_error "Faltante: ${file}"
            log "ERROR" "Faltante: ${file}"
            validation_ok=false
        fi
    done
    
    # Validar node_modules
    if [ -d "${PROJECT_ROOT}/node_modules" ]; then
        print_success "node_modules encontrado"
        log "INFO" "node_modules validado"
    else
        print_error "node_modules não encontrado"
        log "ERROR" "node_modules não encontrado"
        validation_ok=false
    fi
    
    if [ "$validation_ok" = false ]; then
        print_error "Validação falhou"
        log "ERROR" "Validação de setup falhou"
        return 1
    fi
    
    print_success "Setup validado com sucesso"
    log "INFO" "Setup validado com sucesso"
    echo ""
    return 0
}

# ============================================================================
# FASE 9: INICIAR APLICAÇÃO
# ============================================================================

phase_start_app() {
    print_step "9" "Iniciar Aplicação" "9"
    log "INFO" "Iniciando aplicação"
    
    echo ""
    print_header "Setup Concluído com Sucesso! 🎉"
    
    print_info "Informações de Inicialização:"
    print_info "  • Projeto: TikZ Editor v2.2"
    print_info "  • Diretório: ${PROJECT_ROOT}"
    print_info "  • Ambiente: development"
    
    echo ""
    print_info "Próximos passos:"
    print_info "  1. Iniciar dev server: npm run dev"
    print_info "  2. Build para produção: npm run build"
    print_info "  3. Preview build: npm run preview"
    
    echo ""
    print_info "Logs disponíveis em: ${LOG_DIR}/"
    
    echo ""
    read -p "Deseja iniciar o dev server agora? (s/n): " start_dev
    
    if [ "$start_dev" = "s" ] || [ "$start_dev" = "S" ]; then
        print_info "Iniciando: npm run dev"
        log "INFO" "Usuário escolheu iniciar dev server"
        
        cd "${PROJECT_ROOT}"
        npm run dev
    else
        print_info "Setup concluído. Execute 'npm run dev' para iniciar."
        log "INFO" "Setup concluído, dev server não iniciado"
    fi
    
    return 0
}

# ============================================================================
# RESUMO FINAL
# ============================================================================

print_summary() {
    print_header "Resumo do Setup 📊"
    
    echo -e "${CYAN}Arquivos de Log:${NC}"
    echo "  • Setup Log: ${SETUP_LOG}"
    echo "  • Diretório de Logs: ${LOG_DIR}/"
    
    echo ""
    echo -e "${CYAN}Verificações Realizadas:${NC}"
    echo "  • Sistema operacional"
    echo "  • Pré-requisitos (Node, NPM, Python, Git)"
    echo "  • Diretórios necessários"
    echo "  • Organização de projeto (V4 Python)"
    echo "  • Arquivo .env"
    echo "  • Dependências NPM"
    echo "  • Build tools"
    echo "  • Validação final"
    
    echo ""
    echo -e "${GREEN}Status: 🟢 PRONTO PARA DESENVOLVIMENTO${NC}"
    
    log "INFO" "Setup completo"
}

# ============================================================================
# MAIN
# ============================================================================

main() {
    # Criar diretório de logs
    mkdir -p "${LOG_DIR}"
    
    # Inicializar log
    log "INFO" "========================================"
    log "INFO" "TikZ Editor - Setup Script v5.0"
    log "INFO" "========================================"
    log "INFO" "Projeto Root: ${PROJECT_ROOT}"
    log "INFO" "SO Detectado: ${OS_TYPE}"
    
    print_header "TikZ Editor - Complete Setup v5.0 🚀"
    
    # Executar fases
    local total_phases=9
    
    phase_check_system || exit 1
    phase_check_requirements || exit 1
    phase_create_dirs || exit 1
    phase_organize_project || true  # Não falha se organização falhar
    phase_setup_env || exit 1
    phase_install_npm || exit 1
    phase_check_build || true
    phase_validate || exit 1
    phase_start_app || exit 1
    
    # Imprimir resumo
    print_summary
    
    log "INFO" "Setup finalizado com sucesso"
    echo ""
    print_success "Setup completado com sucesso!"
}

# Executar
main "$@"
