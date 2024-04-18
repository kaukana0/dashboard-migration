export const TEXT = {
  FOR_GEO10: "This selection will only allow you to select max 10 countries.",
  FOR_GEO2: "This selection will only allow you to select max 2 countries.",
  FOR_BY: "This selection will only allow you to use one dimension."
}

export function show(text, showClose=true, timeout=null) {
  document.getElementsByTagName("ecl-like-message")[0].setHeader("Attention")
  document.getElementsByTagName("ecl-like-message")[0].setText(text)
  document.getElementsByTagName("ecl-like-message")[0].show(showClose, timeout)
}
