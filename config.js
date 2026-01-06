import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

global.owner = [
  ['51941658192', 'gabriel', true],
  ['584125877491'],
  ['156981591593126'],
  ['595972314588'],
]

global.mods = []
global.prems = []

global.namebot = 'itachi bot 🌴'
global.packname = 'itachi-bot 🌱'
global.author = 'dani | © 2025 🍀'
global.moneda = 'Itachis'



global.libreria = 'Baileys'
global.baileys = 'V 6.7.16'
global.vs = '2.2.0'
global.sessions = 'Sessions'
global.jadi = 'JadiBots'
global.yukiJadibts = true

global.namecanal = '❇️'
global.idcanal = '120363420590235387@newsletter'
global.idcanal2 = '120363420590235387@newsletter'
global.canal = 'https://whatsapp.com/channel/0029Vb6nOKBD8SDp0aFtCD3R'
global.canalreg = '120363420590235387@newsletter'

global.ch = {
  ch1: '120363420590235387@newsletter'
}

global.multiplier = 69
global.maxwarn = 2

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("🔄 Se actualizó 'config.js'"))
  import(`file://${file}?update=${Date.now()}`)
})