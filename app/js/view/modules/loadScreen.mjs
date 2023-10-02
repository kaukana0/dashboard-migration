// TODO: this could potentially be a general-purpose WebComponent

function getHtmlTemplate(source) {
		const t = document.createElement('template')
		t.innerHTML = source
		return t.content
}

export function show() {
  document.getElementById("anchorExpandedCard").insertBefore( getHtmlTemplate(css()+html()), null )

  // try to avoid FOUC
  var elements = document.querySelectorAll(".showAfterLoad")
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.visibility = "visible";
  }
  document.body.style.overflow = "hidden"
}

export function hide() {
  document.getElementById("mainLoader").classList.add("fadeOut")
  setTimeout(()=>document.getElementById("mainLoader").remove(), 700)
  document.body.style.overflow = ""
  document.body.style.overflowX = "hidden"
}

function html() {
  return `
<div id="mainLoader" class="loader">
  <div id="genericProgressBar" style="position:absolute;transform: translateY(-50%);left:2%;font-size:12px;">
    <div id="circleProgressContainer">
        <div id="circularProgress" class="pulse2">

            <div class="ecl-spinner ecl-spinner--primary ecl-spinner--medium ecl-spinner--centered ecl-spinner--visible">
              <svg class="ecl-spinner__loader" viewBox="25 25 50 50">
                <circle class="ecl-spinner__circle" cx="50" cy="50" r="20" fill="none" stroke-width="4px" stroke-miterlimit="10" vector-effect="non-scaling-stroke"></circle>
              </svg>
              <div class="ecl-spinner__text">Loading...</div>
            </div>
        
        </div>
    </div>
  </div>
</div>
`}

function css() {
  return `
  <style>

  .loader {
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
    display: block;
  }

  .fadeOut {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s 0.3s, opacity 0.4s linear;
  }
  
  #mainLoader {
    position: fixed;
    width: 100vw;
    height: 150vh;
    left: 0%;
    top: 0%;
    margin-top: 30px;
  }
  
  .loader-main {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(3, 77, 162, 1);
    z-index: 9999999;
    display: none;
  }
  
  #genericProgressBar {
    display: block;
    width: 100%;
    text-align: center;
  }
  #circleProgressContainer {
    top: 10px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    position: absolute;
    width: 110px;
    height: 110px;
  }
  #circularProgress {
    position: relative;
    text-align: center;
    width: 120px;
    height: 120px;
    border-radius: 100%;
    background: #ffffff;
  }


  .pulse2 {
    animation: pulse2 0.8s ease-out infinite;
  }
  
  @keyframes pulse2 {
    50% {
      box-shadow: 0 0 0 0.3em rgba(255, 255, 255, 0.75);
    }
    100% {
      box-shadow: 0 0 0 1em rgba(255, 255, 255, 0);
    }
  }
    </style>
`}
