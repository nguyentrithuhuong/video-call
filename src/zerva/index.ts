import { serve, zerva } from '@zerva/core'
import { useHttp } from '@zerva/http'
import { useVite } from '@zerva/vite'
import { useWebSocket } from '@zerva/websocket'
import { setupEnv, toPath } from 'zeed'
import { useConfig } from './config'
import { useRoom } from './room'
import { useStun } from './stun'

if (process.env.ZERVA_MODE === 'development')
  setupEnv()

// async function setupRoutes() {
//   zerva.on('httpInit', ({ post }) => {
//     post('/gps-tracker', (req, res) => {
//       console.log("gps tracker", req.body)
//       return `OK`
//     })
//   })
// }

async function main() {
  // await setupRoutes()

  useHttp({
    port: +(process.env.PORT || 8080),
    helmet: false,
  })

  useConfig()

  useWebSocket()

  useRoom()

  useStun()

  useVite({
    root: toPath('.'),
    www: toPath('www'),
  })

  // onStop(() => console.log('stopp!'))

  await serve()
}

void main()
