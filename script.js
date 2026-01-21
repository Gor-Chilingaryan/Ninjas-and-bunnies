
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const backgroundImg = document.createElement('img')
const heroImg = document.createElement('img')
const bulletImg = document.createElement('img')
const audio = document.createElement('audio')
const rabbitImg = document.createElement('img')
const stabAudio = document.createElement('audio')
audio.volume = 0.4
let data = {
  hero: {
    xDelta: 0,
    yDelta: 0,
    x: 10,
    y: 140,
    width: 100,
    height: 100,
  },
  bullets: [],
  rabbits: [],
}

function intersect(rect1, rect2) {
  const x = Math.max(rect1.x, rect2.x)
  const num1 = Math.min(rect1.x + rect1.width, rect2.x + rect2.width)
  const y = Math.max(rect1.y, rect2.y)
  const num2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.height)
  return num1 >= x && num2 >= y
}

function update() {
  // движение героя
  data.hero.x += data.hero.xDelta
  data.hero.y += data.hero.yDelta

  // ADDED: limiting the hero to canvas borders
  // чтобы он не мог выйти за экран
  data.hero.x = Math.max(0, Math.min(canvas.width - data.hero.width, data.hero.x))
  data.hero.y = Math.max(0, Math.min(canvas.height - data.hero.height, data.hero.y))

  //Checking for bullet and rabbit collisions
  data.bullets.forEach((bullet) => {
    data.rabbits.forEach((rabbit) => {
      if (intersect(bullet, rabbit)) {
        stabAudio.currentTime = 0.2
        stabAudio.play()
        bullet.deleteMe = true
        rabbit.deleteMe = true
      }
    })
  })

  // deleting the dead objects
  data.bullets = data.bullets.filter((bullet) => !bullet.deleteMe)
  data.rabbits = data.rabbits.filter((rabbit) => !rabbit.deleteMe)

  // movement of bullets
  data.bullets.forEach((bullet) => {
    bullet.x += bullet.xDelta
  })

  // CHANGED: bullets are removed if they go beyond any boundaries
  // previously, only the right side was checked
  data.bullets = data.bullets.filter((bullet) => {
    return (
      bullet.x + bullet.width > 0 &&
      bullet.x < canvas.width &&
      bullet.y + bullet.height > 0 &&
      bullet.y < canvas.height
    )
  })
  // movement of rabbits
  data.rabbits.forEach((rabbit) => {
    rabbit.x += rabbit.xDelta
    rabbit.y += rabbit.yDelta

    // ADDED: rabbit bouncing off canvas borders
    //so that it does not go off the screen, but is reflected.
    if (rabbit.x <= 0 || rabbit.x + rabbit.width >= canvas.width) {
      rabbit.xDelta *= -1
    }

    if (rabbit.y <= 0 || rabbit.y + rabbit.height >= canvas.height) {
      rabbit.yDelta *= -1
    }
  })

  // if there are no rabbits, we create a new one
  if (data.rabbits.length <= 3) {
    data.rabbits.push({
      xDelta: -1,
      yDelta: -1,
      // CHANGED: correct spawn inside the screen
      // so that the rabbit does not appear immediately abroad
      x: Math.random() * (canvas.width - 100),
      y: Math.random() * (canvas.height - 100),
      width: 100,
      height: 100,
    })
  }
}

function draw(data) {
  context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)
  context.drawImage(heroImg, data.hero.x, data.hero.y, data.hero.width, data.hero.height)

  data.bullets.forEach((bullet) => {
    context.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height)
  })

  data.rabbits.forEach((rabbit) => {
    context.drawImage(rabbitImg, rabbit.x, rabbit.y, rabbit.width, rabbit.height)
  })
}

function loop() {
  requestAnimationFrame(loop)
  update()
  draw(data)
}

loop()

document.addEventListener('keydown', (evt) => {
  if (evt.code === 'ArrowRight') {
    data.hero.xDelta = 5
  } else if (evt.code === 'ArrowLeft') {
    data.hero.xDelta = -5
  } else if (evt.code === 'ArrowUp') {
    data.hero.yDelta = -5
  } else if (evt.code === 'ArrowDown') {
    data.hero.yDelta = 5
  } else {
    audio.currentTime = 0
    audio.play()

    data.bullets.push({
      xDelta: 5,
      x: data.hero.x + 55,
      y: data.hero.y + 55,
      width: 50,
      height: 50,
    })
  }
})

document.addEventListener('keyup', () => {
  data.hero.xDelta = 0
  data.hero.yDelta = 0
})

backgroundImg.src = 'https://images.freeimages.com/images/large-previews/cd0/vintage-textured-background-0410-5699369.jpg?fmt=webp&w=500'
heroImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXItcm91bmQteC1pY29uIGx1Y2lkZS11c2VyLXJvdW5kLXgiPjxwYXRoIGQ9Ik0yIDIxYTggOCAwIDAgMSAxMS44NzMtNyIvPjxjaXJjbGUgY3g9IjEwIiBjeT0iOCIgcj0iNSIvPjxwYXRoIGQ9Im0xNyAxNyA1IDUiLz48cGF0aCBkPSJtMjIgMTctNSA1Ii8+PC9zdmc+'
bulletImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXgtaWNvbiBsdWNpZGUteCI+PHBhdGggZD0iTTE4IDYgNiAxOCIvPjxwYXRoIGQ9Im02IDYgMTIgMTIiLz48L3N2Zz4='
audio.src = 'https://d-gun.com/files/sounds/LASRFIR2.WAV'
rabbitImg.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXJhYmJpdC1pY29uIGx1Y2lkZS1yYWJiaXQiPjxwYXRoIGQ9Ik0xMyAxNmEzIDMgMCAwIDEgMi4yNCA1Ii8+PHBhdGggZD0iTTE4IDEyaC4wMSIvPjxwYXRoIGQ9Ik0xOCAyMWgtOGE0IDQgMCAwIDEtNC00IDcgNyAwIDAgMSA3LTdoLjJMOS42IDYuNGExIDEgMCAxIDEgMi44LTIuOEwxNS44IDdoLjJjMy4zIDAgNiAyLjcgNiA2djFhMiAyIDAgMCAxLTIgMmgtMWEzIDMgMCAwIDAtMyAzIi8+PHBhdGggZD0iTTIwIDguNTRWNGEyIDIgMCAxIDAtNCAwdjMiLz48cGF0aCBkPSJNNy42MTIgMTIuNTI0YTMgMyAwIDEgMC0xLjYgNC4zIi8+PC9zdmc+'
stabAudio.src = 'http://cd.textfiles.com/sbsw/BEEPCHMS/TINCAN.WAV'