
export function show() {
  const b = document.getElementById("globalBackButton")
  b.style.setProperty('--gbbdisplay', "flex")
}

export function hide() {
  const b = document.getElementById("globalBackButton")
  b.style.setProperty('--gbbdisplay', "none")
}

export function callback(cb) {
  const b = document.getElementById("globalBackButton")
  b.addEventListener("click", cb)
}