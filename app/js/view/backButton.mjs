
export function show() {
  const b = document.getElementById("globalBackButton")
  b.style.setProperty('--gbbDisplay', "block")
}

export function hide() {
  const b = document.getElementById("globalBackButton")
  b.style.setProperty('--gbbDisplay', "none")
}

export function callback(cb) {
  const b = document.getElementById("globalBackButton")
  b.addEventListener("click", cb)
}