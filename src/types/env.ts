interface ImportMetaEnv {
  readonly VITE_API_URL_DEVELOPMENT: string
  readonly VITE_API_URL_PRODUCTION: string
  readonly VITE_APP_ENV: 'development' | 'production'
  readonly VITE_API_TIMEOUT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export function validateEnv(): void {
  const requiredEnvVars = [
    'VITE_API_URL_DEVELOPMENT',
    'VITE_API_URL_PRODUCTION',
    'VITE_APP_ENV',
    'VITE_API_TIMEOUT'
  ]

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !import.meta.env[envVar as keyof ImportMetaEnv]
  )

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    )
  }
}
