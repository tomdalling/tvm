const DISPLAY_SIZE = 16
const COLORS = ['red', 'orange', 'yellow', 'blue', 'green', 'indigo', 'violet']

export default class VirtualMachine {
  constructor() {
    this.display = Array.from({length: DISPLAY_SIZE}, () =>
      Array.from({length: DISPLAY_SIZE}, () => 'black')
    )
    this.instructions = []
    this.labels = {}
    this.registers = {
      slp: 0,
      ip: 0,
      dx: 0,
      dy: 0,
    }
  }

  reg(name, value=undefined) {
    this.registers[name] = value
  }

  load(sourceCode) {
    const labelsAndInstrs = sourceCode
      .split(/;|\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0)

    this.labels = {}
    this.instructions = []
    for(const line of labelsAndInstrs) {
      if(line.endsWith(':')){
        this.labels[line.substring(0, line.length - 1)] = this.instructions.length
      } else {
        this.instructions.push(line.split(/\s+/))
      }
    }

    this.reg('ip', 0)
  }

  frame() {
    const { slp } = this.registers
    if(slp > 0){
      this.reg('slp', slp - 1)
      return
    }

    let stepsTaken = 0
    let running = true
    while(running && stepsTaken < 1000) {
      running = this.step()
      stepsTaken += 1
    }
  }

  step() {
    const { ip } = this.registers
    if(ip >= this.instructions.length){
      return false
    }

    const [op, ...args] = this.instructions[ip]
    this.reg('ip', ip + 1)

    switch(op){
      case 'PIX': {
        const [color] = args
        this.drawPixel(color)
        break }
      case 'PIXR': {
        const [reg] = args
        const colorIdx = (this.registers[reg.toLowerCase()] || 0) % COLORS.length
        this.drawPixel(COLORS[colorIdx])
        break }
      case 'SLP': {
        const [cycles] = args
        this.reg('slp', parseInt(cycles))
        break }
      case 'JMP': {
        const [label] = args
        this.jumpTo(label)
        break }
      case 'JEZ': {
        const [label, rawReg] = args
        const reg = rawReg.toLowerCase()
        if(this.registers[reg] === 0) {
          this.jumpTo(label)
        }
        break }
      case 'JNZ': {
        const [label, rawReg] = args
        const reg = rawReg.toLowerCase()
        if(this.registers[reg] !== 0 && reg in this.registers) {
          this.jumpTo(label)
        }
        break }
      case 'SET': {
        const [reg, value] = args
        this.reg(reg.toLowerCase(), parseInt(value))
        break }
      case 'SUB': {
        const [reg, value] = args
        this.registers[reg.toLowerCase()] -= parseInt(value)
        break }
      case 'ADD': {
        const [reg, value] = args
        this.registers[reg.toLowerCase()] += parseInt(value)
        break }
      case 'FRM':
        return false
      default:
        // eslint-disable-next-line
        console.error('BAD INSTRUCTION:', op, ...args)
        return false
    }

    return true
  }

  jumpTo(label) {
    const ip = this.labels[label]
    if(typeof ip == 'undefined'){
      // eslint-disable-next-line
      console.error('Undefined label: ' + label)
      return
    }

    this.reg('ip', ip)
  }

  drawPixel(color) {
    const { dx, dy } = this.registers
    this.display[dy][dx] = color

    if(dx < DISPLAY_SIZE - 1) {
      this.reg('dx', dx + 1)
    } else {
      this.reg('dx', 0)
      if(dy < DISPLAY_SIZE - 1) {
        this.reg('dy', dy + 1)
      } else {
        this.reg('dy', 0)
      }
    }
  }
}
