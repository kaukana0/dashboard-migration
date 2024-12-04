// TODO: this could potentially be a general-purpose WebComponent

let isShown=false

function getHtmlTemplate(source) {
  const t = document.createElement('template')
  t.innerHTML = source
  return t.content
}

export function show(e) {
  if(!isShown) {
    console.error(e)
    isShown=true
    // document.getElementsByTagName("ecl-like-hero-banner")[0].insertAdjacentHTML(
    //   "afterend",
    //   getHtmlTemplate(css()+html())
    // )
    document.body.appendChild( getHtmlTemplate(css()+html()) )
    document.body.style.overflow = "hidden"
  }
}

export function hide() {
  document.getElementById("errorScreen").remove()
}

function html() {
return `
<div id="errorScreen" class="errorScreen">

<div id="errorMessage" style="font-size: 30px;">
Ups, something went wrong!<br>
Try again later or contact our
<a href="https://ec.europa.eu/eurostat/en/web/main/contact-us/user-support">user support</a>
</div>


</div>
`}

function css() {
return `
<style>

/*
.errorScreen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(7, 139, 187, 1) 35%,
    rgba(27, 84, 137, 0.9) 60%,
    rgba(0,0,0, 0) 100%
  );
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: center;
}
*/

/*
.errorScreen {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(
    rgba(7, 139, 187, 1) 35%,
    rgba(27, 84, 137, 0.9) 60%,
    rgba(0,0,0, 0) 100%
  );
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: center;
}
*/

.errorScreen {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0%;
  top: 0%;
  /*margin-top: 30px;*/

  /*background: rgb(203,37,14);
  background: linear-gradient(180deg, rgba(203,37,14,0.9850315126050421) 0%, rgba(203,14,83,0.9654236694677871) 100%);
  */

  background: rgb(82,14,203);
  background: linear-gradient(180deg, rgba(82,14,203,0.22872899159663862) 0%, rgba(203,33,27,0.9598214285714286) 19%, rgba(203,32,30,1) 74%, rgba(203,53,14,0.8813900560224089) 100%);

  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
`}
