const main = document.querySelector('[data-js=main]')
const nav = document.querySelector('[data-js=menu]')
nav.addEventListener('click', (event) => {
  const clickedElement = event.target
  const validButton = clickedElement.getAttribute('data-js')
  const htmlContent = getHtmlContent(validButton)
  manipulateMainHtml(htmlContent)
  if (!!htmlContent) {
    removeClassActive()
    setClassActive(clickedElement)
    dataMode[validButton].func()
  }
})

const setClassActive = (element) => {
  element.classList.add('active')
}
const removeClassActive = () => {
  nav.querySelector('.active').classList.remove('active')
}

const dataMode = {
  home: {
    content: `
    <h1 class="home">Coordenadas Polares e Retangulares</h1>
    <section class="home">
      <p>As coordenadas cartesianas, também chamadas de coordenadas retangulares, utilizam uma distância em cada uma das duas dimensões para localizar um ponto. As coordenadas polares usam um ângulo comparado a um eixo e uma distância. Ambas as coordenadas, podem ser convertidas de uma para outra, facilitando operações matematicas entre as mesmas.</p>
      <canvas></canvas>
      <div class="coords" data-js="coords"></div>
    </section>
    `,
    func: () => {
      openHome()
    },
  },
  conversao: {
    content: `
    <h1 class="conv">Conversão Coordenada Polar/Retangular</h2>
    <div class="conv">
      <input type="text" value="0+j0" data-js="input-retangular">
      <img onload="" src="svg/change-arrow.svg" width="50">
      <input type="text" value="0∠0°" data-js="input-polar">
    </div>`,
    func: () => {
      openConvert()
    },
  },
  soma: {
    content: `<p>Aba em desenvolvimento, contate o Paulo Augusto para terminar de desenvolver essa budega!!!!</p>`,
    func: () => {
      console.log('soma')
    },
  },
  multiplicacao: {
    content: `<p>Aba em desenvolvimento, contate o Paulo Augusto para terminar de desenvolver essa budega!!!!</p>`,
    func: () => {
      console.log('multiplicação')
    },
  },
}

const getHtmlContent = (button) => dataMode[button].content || ''

const manipulateMainHtml = (data) => {
  if (data) {
    main.innerHTML = data
  }
}

const openHome = () => {
  const canvas = document.querySelector('canvas')
  const context = canvas.getContext('2d')
  const coords = document.querySelector("[data-js=coords]")
  console.log("open Home")
  canvas.width = 900
  canvas.height = 500

  let mousePos = { x: 0, y: 0, sx: 0, sy: 0, cx: 0, cy: 0}

  const frameRender = () => {
    draw()
    requestAnimationFrame(frameRender)
  }

  const draw = () => {
    const preFrame = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.beginPath()
    }
    const drawGridLines = (backgroundGridSize) => {
      context.beginPath()
      context.strokeStyle = '#ddd'
      for (let x = 0; x <= canvas.width; x += backgroundGridSize) {
        context.moveTo(x, 0)
        context.lineTo(x, canvas.height)
      }
      for (let y = 0; y <= canvas.height; y += backgroundGridSize) {
        context.moveTo(0, y)
        context.lineTo(canvas.width, y)
      }
      context.stroke()
      context.closePath()
    }
    const drawXYAxis = (backgroundGridSize) => {
      context.beginPath()
      context.strokeStyle = '#000'
      context.moveTo(0, canvas.height / 2)
      context.lineTo(canvas.width, canvas.height / 2)
      context.lineTo(
        canvas.width - 2 * backgroundGridSize,
        canvas.height / 2 - backgroundGridSize,
      )
      context.lineTo(
        canvas.width - 2 * backgroundGridSize,
        canvas.height / 2 + backgroundGridSize,
      )
      context.lineTo(canvas.width, canvas.height / 2)
      context.fill()
      context.moveTo(canvas.width / 2, 0)
      context.lineTo(
        canvas.width / 2 - backgroundGridSize,
        2 * backgroundGridSize,
      )
      context.lineTo(
        canvas.width / 2 + backgroundGridSize,
        2 * backgroundGridSize,
      )
      context.lineTo(canvas.width / 2, 0)
      context.fill()
      context.lineTo(canvas.width / 2, canvas.height)
      context.stroke()
      context.closePath()
    }
    const drawMousePos = () => {
      context.beginPath()
      context.strokeStyle = '#000'
      context.fillStyle = '#000'
      context.arc(mousePos.sx, mousePos.sy, 3, 0, Math.PI * 2)
      context.fill()
      context.stroke()
    }
    const drawVector = () => {
      context.beginPath()
      context.strokeStyle = '#000'
      context.moveTo(canvas.width / 2, canvas.height / 2)
      context.lineTo(mousePos.sx, mousePos.sy)
      context.stroke()
      context.closePath()
    }
    const drawXYDash = () => {
      context.beginPath()
      context.strokeStyle = '#000'
      context.setLineDash([4, 2])
      context.moveTo(mousePos.sx, mousePos.sy)
      context.lineTo(mousePos.sx, canvas.height / 2)
      context.moveTo(mousePos.sx, mousePos.sy)
      context.lineTo(canvas.width / 2, mousePos.sy)
      context.stroke()
      context.setLineDash([])
      context.closePath()
    }
    const setCartesianXY = () => {
      mousePos.cy = (mousePos.sy - canvas.height / 2) * -1
      mousePos.cx = mousePos.sx - canvas.width / 2 
    }
    const getRadiansAngle = () => {
      const radians = (Math.atan2(mousePos.cy,mousePos.cx) * -1)
      return radians
    }
    const drawArcAngleLine = () => {
      context.beginPath()
      context.strokeStyle = '#000'
      context.arc(
        canvas.width / 2,
        canvas.height / 2,
        20,
        0,
        getRadiansAngle(),
        getRadiansAngle() < 0
      )
      context.stroke()
      context.closePath()
    }
    const drawAngleSimbol = () => {
      
      const angle = getRadiansAngle() / 2
      const modulo = 35
      const x = modulo * Math.cos(angle)
      const y = modulo * Math.sin(angle)

      context.font = "20px Arial"
      context.textAlign = "center"
      context.fillText("θ",x + canvas.width/2, y + canvas.height/2 + 8)
    }
    const drawXYCoords = () => {
      context.font = "20px Arial"
      context.textAlign = "center"
      context.fillText("X",mousePos.sx, (canvas.height / 2) + ((mousePos.sy - (canvas.height / 2)) > 0 ? -20 : 20))
      context.fillText("Y", (canvas.width / 2) + ((mousePos.sx - (canvas.width / 2)) > 0 ? -20 : 20), mousePos.sy)
    }
    const drawModule = () => {
      const ya = (mousePos.sy - (canvas.height / 2))
      const xa = mousePos.sx - (canvas.width / 2)  
      const angle = getRadiansAngle()- (0.05 * Math.PI)
      const modulo = Math.sqrt((ya * ya) + (xa * xa)) / 2
      const xb = modulo * Math.cos(angle)
      const yb = modulo * Math.sin(angle)
      context.font = "20px Arial"
      context.textAlign = "center"
      context.fillText("|v|",xb + canvas.width/2, yb + canvas.height/2)
    }
    const coordsWrite = () => {
      coords.innerHTML = `<p>Coordenada Retangular:(${mousePos.cx/10};${mousePos.cy/10})</p> <p>Coordenada Polar: ()<p>`
    }
    preFrame()
    drawGridLines(10)
    drawXYAxis(10)
    drawMousePos()
    setCartesianXY()
    drawVector()
    drawXYDash()
    drawArcAngleLine()
    drawAngleSimbol()
    drawXYCoords()
    drawModule()
    coordsWrite()
  }

  frameRender()

  const getMousePos = (event, backgroundGridSize) => {
    const rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width, // relationship bitmap vs. element for X
      scaleY = canvas.height / rect.height // relationship bitmap vs. element for Y

    mousePos = {
      x: (event.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
      y: (event.clientY - rect.top) * scaleY, // been adjusted to be relative to element
      sx:
        Math.round(
          ((event.clientX - rect.left) * scaleX) / backgroundGridSize,
        ) * backgroundGridSize,
      sy:
        Math.round(((event.clientY - rect.top) * scaleY) / backgroundGridSize) *
        backgroundGridSize,
    }
  }

  const canvasClick = (event) => {
    console.log('canvas click')
  }

  canvas.addEventListener('mousemove', (event) => {
    getMousePos(event, 10)
  })
  canvas.addEventListener('click', canvasClick)
}

const openConvert = () => {
  console.log('open Convert')
  const inputRetangular = document.querySelector('[data-js=input-retangular]')
  const inputPolar = document.querySelector('[data-js=input-polar]')
  inputRetangular.addEventListener('input', (e) => {
    convertRetPol(e, inputPolar)
  })
  inputPolar.addEventListener('input', (e) => {
    convertPolRet(e, inputRetangular)
  })
}

const convertPolRet = (event, element) => {
  const value = getValue(event)
  const [modulo, angle] = getSanetizedValue(value, 'pol')
  const real =
    Math.round(modulo * Math.cos((angle * Math.PI) / 180) * 1000000) / 1000000
  const imagi =
    Math.round(modulo * Math.sin((angle * Math.PI) / 180) * 1000000) / 1000000
  setValueHTML(element, real, imagi, 'ret')
}

const convertRetPol = (event, element) => {
  const value = getValue(event)
  const [real, imagi] = getSanetizedValue(value, 'ret')
  const modulo =
    Math.round(Math.sqrt(real * real + imagi * imagi) * 1000000) / 1000000
  const angle =
    Math.round(((Math.atan2(imagi, real) * 180) / Math.PI) * 100000) / 100000
  setValueHTML(element, modulo, angle, 'pol')
}

const getValue = (event) => {
  return event.target.value
}

const funcsCoordType = {
  ret: (preValue) => {
    const slicePos = preValue.indexOf('j')
    const real = +preValue.slice(0, slicePos - 1)
    const imagi = +preValue
      .slice(slicePos - 1, preValue.length)
      .replace('j', '')
    return [real, imagi]
  },
  pol: (preValue) => {
    const slicePos = preValue.indexOf('∠')
    const modulo = +preValue.slice(0, slicePos)
    const angulo = +preValue.slice(slicePos + 1, preValue.length - 1)
    return [modulo, angulo]
  },
}

const getSanetizedValue = (value, type) => {
  const preSanetizeValue = value.replaceAll(' ', '')
  return funcsCoordType[type](preSanetizeValue)
}

const maskValueInput = {
  ret: (first, second) => {
    return `${first}${second < 0 ? '-' : '+'}j${Math.abs(second)}`
  },
  pol: (first, second) => {
    return `${first}∠${second}°`
  },
}

const setValueHTML = (element, first, second, type) => {
  element.value = maskValueInput[type](first, second)
}

const initInHome = () => {
  manipulateMainHtml(getHtmlContent('home'))
  openHome()
}
initInHome()
