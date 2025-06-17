import { serverConfig } from './Server.mjs'

export const DEV_SERVER = `http://${serverConfig.development.host}:${serverConfig.development.port}`
