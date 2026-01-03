const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from "chalk"
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""

let rtx = `
🎋 𝗩𝗶𝗻𝗰𝘂𝗹𝗮𝗰𝗶𝗼́𝗻 𝗽𝗼𝗿 𝗖𝗼́𝗱𝗶𝗴𝗼 𝗤𝗥

📌 𝗣𝗮𝘀𝗼𝘀 𝗽𝗮𝗿𝗮 𝘃𝗶𝗻𝗰𝘂𝗹𝗮𝗿 𝘁𝘂 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽:
1️⃣ Abre 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 en tu teléfono  
2️⃣ Pulsa ⋮ *Más opciones* → *Dispositivos vinculados*  
3️⃣ Presiona *"Vincular un dispositivo"*  
4️⃣ Escanea el código QR que se mostrará aquí
`.trim()

let rtx2 = (number) => `
🍁 𝗩𝗶𝗻𝗰𝘂𝗹𝗮𝗰𝗶𝗼́𝗻 𝗽𝗼𝗿 𝗖𝗼́𝗱𝗶𝗴𝗼 𝗠𝗮𝗻𝘂𝗮𝗹 (8 dígitos)

📌 𝗣𝗮𝘀𝗼𝘀 𝗽𝗮𝗿𝗮 𝗵𝗮𝗰𝗲𝗿𝗹𝗼:
1️⃣ Abre 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 en tu teléfono  
2️⃣ Pulsa ⋮ *Más opciones* → *Dispositivos vinculados*  
3️⃣ Presiona *"Vincular un dispositivo"*  
4️⃣ Selecciona *"Con número"* e introduce el código mostrado  

📱 𝗡𝘂́𝗺𝗲𝗿𝗼 𝗮𝘂𝘁𝗼𝗿𝗶𝘇𝗮𝗱𝗼: ${number}

⚠️ 𝗜𝗺𝗽𝗼𝗿𝘁𝗮𝗻𝘁𝗲:  
- El código solo funciona para el número: ${number}
- Algunos grupos pueden fallar al generar el código  
- Recomendado: Solicítalo por privado al bot  
⏳ El código es válido solo para este número y expira en pocos segundos.
`.trim()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const yukiJBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  let time = global.db.data.users[m.sender].Subs + 120000
  
  const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
  const subBotsCount = subBots.length
  if (subBotsCount === 30) {
    return m.reply(`No se han encontrado espacios para *Sub-Bots* disponibles.`)
  }
  
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let id = `${who.split`@`[0]}`
  
  // Verificar si se proporcionó un número de teléfono
  if (command === 'code') {
    if (!args[0] || !args[0].match(/^\d+$/)) {
      return m.reply(`❌ *Uso incorrecto*\n\nPor favor, proporciona un número de teléfono válido:\n\n${usedPrefix}code 5492644893953\n\nEjemplo: ${usedPrefix}code 5492644893953`)
    }
    
    // Extraer el número proporcionado
    let phoneNumber = args[0].trim()
    
    // Verificar formato del número (debe comenzar con código de país)
    if (!phoneNumber.startsWith('549') && !phoneNumber.startsWith('54') && phoneNumber.length < 10) {
      return m.reply(`❌ *Formato incorrecto*\n\nEl número debe incluir el código de país.\nEjemplo: ${usedPrefix}code 5492644893953`)
    }
    
    // Almacenar el número en las opciones para usarlo después
    yukiJBOptions.phoneNumber = phoneNumber
  }
  
  let pathYukiJadiBot = path.join(`./${jadi}/`, id)
  if (!fs.existsSync(pathYukiJadiBot)) {
    fs.mkdirSync(pathYukiJadiBot, { recursive: true })
  }
  
  yukiJBOptions.pathYukiJadiBot = pathYukiJadiBot
  yukiJBOptions.m = m
  yukiJBOptions.conn = conn
  yukiJBOptions.args = args
  yukiJBOptions.usedPrefix = usedPrefix
  yukiJBOptions.command = command
  yukiJBOptions.fromCommand = true
  yukiJadiBot(yukiJBOptions)
  global.db.data.users[m.sender].Subs = new Date * 1
}

handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler

export async function yukiJadiBot(options) {
  let { pathYukiJadiBot, m, conn, args, usedPrefix, command, phoneNumber } = options
  
  if (command === 'code') {
    command = 'qr'
    args.unshift('code')
  }
  
  const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
  let txtCode, codeBot, txtQR
  
  if (mcode) {
    args[0] = args[0].replace(/^--code$|^code$/, "").trim()
    if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
    if (args[0] == "") args[0] = undefined
  }
  
  const pathCreds = path.join(pathYukiJadiBot, "creds.json")
  if (!fs.existsSync(pathYukiJadiBot)) {
    fs.mkdirSync(pathYukiJadiBot, { recursive: true })
  }
  
  try {
    args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
  } catch {
    conn.reply(m.chat, `${emoji} Use correctamente el comando » ${usedPrefix + command}`, m)
    return
  }
  
  const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
  exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
    const drmer = Buffer.from(drm1 + drm2, `base64`)
    
    let { version, isLatest } = await fetchLatestBaileysVersion()
    const msgRetry = (MessageRetryMap) => { }
    const msgRetryCache = new NodeCache()
    const { state, saveState, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot)
    
    const connectionOptions = {
      logger: pino({ level: "fatal" }),
      printQRInTerminal: false,
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
      msgRetry,
      msgRetryCache,
      browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Michi Wa [ Prem Bot ]','Chrome','2.0.0'],
      version: version,
      generateHighQualityLinkPreview: true
    };
    
    let sock = makeWASocket(connectionOptions)
    sock.isInit = false
    sock.phoneNumber = phoneNumber // Almacenar el número en el socket
    let isInit = true
    
    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update
      
      if (isNewLogin) sock.isInit = false
      
      if (qr && !mcode) {
        if (m?.chat) {
          txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim()}, { quoted: m})
        } else {
          return 
        }
        if (txtQR && txtQR.key) {
          setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 30000)
        }
        return
      } 
      
      if (qr && mcode) {
        // Usar el número de teléfono específico si se proporcionó
        let phoneForPairing = phoneNumber || (m.sender.split`@`[0])
        
        // Formatear el número para WhatsApp
        let formattedNumber = phoneForPairing
        if (!formattedNumber.includes('@s.whatsapp.net')) {
          formattedNumber = formattedNumber.replace(/\D/g, '') + '@s.whatsapp.net'
        }
        
        let secret
        try {
          // Intentar generar código específico para el número
          secret = await sock.requestPairingCode(formattedNumber)
          secret = secret.match(/.{1,4}/g)?.join("")
          
          txtCode = await conn.sendMessage(m.chat, {text: rtx2(phoneNumber || phoneForPairing)}, { quoted: m })
          codeBot = await m.reply(`🔢 *Código de vinculación:* ${secret}\n\n📱 *Número autorizado:* ${phoneNumber || phoneForPairing}\n\n⚠️ Este código solo funcionará para el número especificado.`)
          
          console.log(`Código generado para ${phoneNumber || phoneForPairing}: ${secret}`)
        } catch (error) {
          console.error('Error generando código:', error)
          return m.reply(`❌ Error al generar el código de vinculación para el número: ${phoneNumber || phoneForPairing}`)
        }
      }
      
      if (txtCode && txtCode.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key })}, 30000)
      }
      if (codeBot && codeBot.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 30000)
      }
      
      const endSesion = async (loaded) => {
        if (!loaded) {
          try {
            sock.ws.close()
          } catch {
          }
          sock.ev.removeAllListeners()
          let i = global.conns.indexOf(sock)                
          if (i < 0) return 
          delete global.conns[i]
          global.conns.splice(i, 1)
        }
      }
      
      const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
      if (connection === 'close') {
        if (reason === 428) {
          console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathYukiJadiBot)}) fue cerrada inesperadamente. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
          await creloadHandler(true).catch(console.error)
        }
        if (reason === 408) {
          console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathYukiJadiBot)}) se perdió o expiró. Razón: ${reason}. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
          await creloadHandler(true).catch(console.error)
        }
        if (reason === 440) {
          console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathYukiJadiBot)}) fue reemplazada por otra sesión activa.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
          try {
            // Código para enviar mensaje
          } catch (error) {
            console.error(chalk.bold.yellow(`Error 440 no se pudo enviar mensaje a: +${path.basename(pathYukiJadiBot)}`))
          }
        }
        if (reason == 405 || reason == 401) {
          console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La sesión (+${path.basename(pathYukiJadiBot)}) fue cerrada. Credenciales no válidas o dispositivo desconectado manualmente.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
          try {
            // Código para enviar mensaje
          } catch (error) {
            console.error(chalk.bold.yellow(`Error 405 no se pudo enviar mensaje a: +${path.basename(pathYukiJadiBot)}`))
          }
          fs.rmdirSync(pathYukiJadiBot, { recursive: true })
        }
        if (reason === 500) {
          console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Conexión perdida en la sesión (+${path.basename(pathYukiJadiBot)}). Borrando datos...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
          return creloadHandler(true).catch(console.error)
        }
        if (reason === 515) {
          console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Reinicio automático para la sesión (+${path.basename(pathYukiJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
          await creloadHandler(true).catch(console.error)
        }
        if (reason === 403) {
          console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sesión cerrada o cuenta en soporte para la sesión (+${path.basename(pathYukiJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
          fs.rmdirSync(pathYukiJadiBot, { recursive: true })
        }
      }
      
      if (global.db.data == null) loadDatabase()
      
      if (connection == `open`) {
        if (!global.db.data?.users) loadDatabase()
        let userName, userJid 
        userName = sock.authState.creds.me.name || 'Anónimo'
        userJid = sock.authState.creds.me.jid || `${path.basename(pathYukiJadiBot)}@s.whatsapp.net`
        
        console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(pathYukiJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`))
        sock.isInit = true
        global.conns.push(sock)
        await joinChannels(sock)
      }
    }
    
    setInterval(async () => {
      if (!sock.user) {
        try { sock.ws.close() } catch (e) {      
        }
        sock.ev.removeAllListeners()
        let i = global.conns.indexOf(sock)                
        if (i < 0) return
        delete global.conns[i]
        global.conns.splice(i, 1)
      }
    }, 60000)
    
    let handler = await import('../handler.js')
    let creloadHandler = async function (restatConn) {
      try {
        const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) handler = Handler
      } catch (e) {
        console.error('Nuevo error: ', e)
      }
      
      if (restatConn) {
        const oldChats = sock.chats
        try { sock.ws.close() } catch { }
        sock.ev.removeAllListeners()
        sock = makeWASocket(connectionOptions, { chats: oldChats })
        isInit = true
      }
      
      if (!isInit) {
        sock.ev.off("messages.upsert", sock.handler)
        sock.ev.off("connection.update", sock.connectionUpdate)
        sock.ev.off('creds.update', sock.credsUpdate)
      }
      
      sock.handler = handler.handler.bind(sock)
      sock.connectionUpdate = connectionUpdate.bind(sock)
      sock.credsUpdate = saveCreds.bind(sock, true)
      sock.ev.on("messages.upsert", sock.handler)
      sock.ev.on("connection.update", sock.connectionUpdate)
      sock.ev.on("creds.update", sock.credsUpdate)
      isInit = false
      return true
    }
    
    creloadHandler(false)
  })
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
  seconds = Math.floor((duration / 1000) % 60),
  minutes = Math.floor((duration / (1000 * 60)) % 60),
  hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds
  return minutes + ' m y ' + seconds + ' s '
}

async function joinChannels(conn) {
  for (const channelId of Object.values(global.ch)) {
    await conn.newsletterFollow(channelId).catch(() => {})
  }
}