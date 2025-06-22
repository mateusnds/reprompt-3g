
const config = {
  database: {
    maxPrompts: 1000,
    cacheTTL: 300, // 5 minutos
  },
  ui: {
    promptsPerPage: 12,
    maxTagsDisplay: 5,
  },
  features: {
    enableReviews: true,
    enablePurchases: true,
    enableAdmin: true,
  }
}

export function getConfig() {
  return config
}

export { getConfig as default }
export default config
