/*
all HTML and CSS as JS string
*/

export const itemIds = {
  Facebook:"facebook-color.svg",
  X:"twitter-color.svg",
  Linkedin:"linkedin-color.svg",
  Email:"email-color.svg",
  Embed:"code-solid.svg"
}

export default function get(assetBaseUrl = "./assets", showEmbed = true) {
  return getTemplateTag(
`<button class="ewc-button ewc-button--secondary" type="button">
  <img class="ewc-icon ewc-icon--fluid" width="16" height="16" src="${assetBaseUrl}/share.svg">
</button>

<div class="ewc-pseudopopover__container ewc-social-media-share ewc-social-media-share--vertical">
  <p class="ewc-social-media-share__description">Share</p>
  <ul class="ewc-social-media-share__list">
    ${Object.getOwnPropertyNames(itemIds).map(e=>getItemHtml(assetBaseUrl, e, itemIds[e], showEmbed)).join("")}
  </ul>
</div>
`)}

function getItemHtml(assetBaseUrl, itemId, imgFileName, showEmbed) {
  if(itemId==="Embed" && !showEmbed) {return ""}
  return `<li class="ewc-social-media-share__item ${itemId}" tabindex="0">
    <a class="ewc-link ewc-link--standalone ewc-social-media-share__link">
      <img class="ewc-icon ewc-icon--m ewc-button__icon" 
        focusable="false" 
        aria-hidden="true" 
        src="${assetBaseUrl}/${imgFileName}"/>
      <span class="ewc-link__label">${itemId}</span>
    </a>
  </li>`
}


// helper
function getTemplateTag(source) {
	const t = document.createElement('template')
	t.innerHTML = source
	return t.content
}
