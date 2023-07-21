// TODO: this could potentially be a general-purpose WebComponent

function getHtmlTemplate(source) {
		const t = document.createElement('template')
		t.innerHTML = source
		return t.content
}

export function show() {
  document.getElementById("anchorExpandedCard").insertBefore( getHtmlTemplate(css()+html()), null )
}

export function hide() {
  document.getElementById("mainLoader").remove()
}

function html() {
  return `
<div id="mainLoader" class="loader">
  <div id="genericProgressBar" style="position:absolute;transform: translateY(-50%);left:2%;font-size:12px;">
    <div id="circleProgressContainer">
        <div id="circularProgress">

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
      150deg,
      rgba(7, 139, 187, 1) 35%,
      rgba(27, 84, 137, 1) 100%
    );
    z-index: 200;
    display: block;
  }
  
  #mainLoader {
    position: fixed;
    width: 100vw;
    height: 100vh;
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
  
  .loader-chart {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.5);
    z-index: 999999;
    display: none;
    justify-content: center;
  }  
  #genericProgressBar {
    display: block;
    width: 100%;
    text-align: center;
  }
  #circleProgressContainer {
    top: 0;
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
    width: 110px;
    height: 110px;
    border-radius: 100%;
    background: #fff;
/*
    background-image: linear-gradient(91deg, transparent 50%, #fff 50%),
      linear-gradient(90deg, #fff 50%, transparent 50%);
    transition: transform 0.3s ease-in;
*/
  }
  
  </style>
`}
