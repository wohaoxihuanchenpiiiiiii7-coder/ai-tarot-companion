import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import serverApp from './server/src/index'
import type { AiProviderConfig } from './server/src/lib/aiProvider'

function localApiPlugin(config: AiProviderConfig): Plugin {
  return {
    name: 'local-internal-api',
    configureServer(devServer) {
      devServer.middlewares.use('/api', async (request, response, next) => {
        if (!request.url || !request.method) {
          next()
          return
        }

        try {
          const chunks: Buffer[] = []

          for await (const chunk of request) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
          }

          const headers = new Headers()
          Object.entries(request.headers).forEach(([name, value]) => {
            if (value) headers.set(name, Array.isArray(value) ? value.join(',') : value)
          })

          const body = chunks.length > 0 ? Buffer.concat(chunks) : undefined
          const apiResponse = await serverApp.request(
            `http://localhost/api${request.url}`,
            {
              method: request.method,
              headers,
              body,
            },
            config,
          )

          response.statusCode = apiResponse.status
          apiResponse.headers.forEach((value, name) => {
            response.setHeader(name, value)
          })
          response.end(Buffer.from(await apiResponse.arrayBuffer()))
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const serverEnv = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      localApiPlugin({
        AI_PROVIDER: serverEnv.AI_PROVIDER,
        AI_API_KEY: serverEnv.AI_API_KEY,
        AI_MODEL: serverEnv.AI_MODEL,
      }),
    ],
  }
})
