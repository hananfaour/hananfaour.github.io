// This expects a modern browser, but does not require any libraries. (Yes, it does not use jQuery.)

// Enable some array methods for results of DOM selectors:
NodeList.prototype.__proto__ = Array.prototype;

function addSidenotes(content) {
  const footnotesConverted = content.querySelectorAll('.footnote-ref > a').
  map(function convertFootnoteToSidenote(ref) {
    const footnote = document.querySelectorAll(ref.getAttribute('href'))[0];
    if (!footnote) {return;}

    ref.parentNode.insertAdjacentHTML('afterend', `<span class="sidenote">
      <span class="sidenote-number">${ref.textContent}</span>
      ${footnote.innerHTML}
    </span>`);

    return 1;
  }).
  filter(x => !!x).length;

  const linksConverted = content.querySelectorAll('a[title]').
  map(function convertLinkToSidenote(link) {
    if (link.href[0] === '#') {return;}
    if (link.matches('.sidenote a')) {return;}

    const title = link.getAttribute('title');
    const hostname = link.hostname;

    link.insertAdjacentHTML('afterend', `<span class="sidenote">
      <span class="sidenote-title">${title}</span> &ndash;
      <a href="${link.href}">${hostname}</a>
    </span>`);

    return 1;
  }).
  filter(x => !!x).length;

  if (0 < footnotesConverted + linksConverted) {
    content.classList.add('has-sidenotes');
  }
}

document.querySelectorAll('article .content').map(addSidenotes);