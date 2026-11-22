import { resolve } from 'node:path'
import { generateApi } from 'swagger-typescript-api'

generateApi({
  fileName: 'Api.ts',
  output: resolve(process.cwd(), './src/api'),
  input: resolve(process.cwd(), '../principality-backend/docs/swagger.json'),
  httpClientType: 'axios',
  moduleNameIndex: 1,
})
