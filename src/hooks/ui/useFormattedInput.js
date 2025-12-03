/**
 * Hook para formatar valores com casas decimais
 */

export function useFormattedInput(value, decimals = 2) {
  if (!Number.isFinite(value)) return '0'
  return parseFloat(value).toFixed(decimals)
}

/**
 * Hook para obter width proporcional de input
 * Baseado no range de valores possíveis
 */
export function useProportionalInputWidth(min, max) {
  const range = max - min
  
  if (range <= 1) return 'w-16' // 4rem
  if (range <= 10) return 'w-24' // 6rem
  if (range <= 100) return 'w-32' // 8rem
  return 'w-40' // 10rem
}

/**
 * Hook para obter cor formatada em hex
 */
export function useFormattedColor(hex) {
  if (!hex) return '#000000'
  if (hex.startsWith('#')) return hex
  return `#${hex}`
}
