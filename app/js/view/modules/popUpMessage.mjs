export const TEXT = {
  FOR_GEO: "This selection will only allow you to select max 10 countries.",
  FOR_BY: "This selection will only allow you to use one dimension."
}

export function show(text) {
  document.getElementsByTagName("ecl-like-message")[0].setHeader("Attention!")
  document.getElementsByTagName("ecl-like-message")[0].setText(text)
  document.getElementsByTagName("ecl-like-message")[0].show()
}
