// JAVASCRIPT VOOR VOETNOOT-TEKST //

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


// JAVASCRIPT VOOR LIJST DRAG AND DROP //

var btn = document.querySelector('.add');
var remove = document.querySelector('.draggable');

function dragStart(e) {
  this.style.opacity = '0.4';
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
};

function dragEnter(e) {
  this.classList.add('over');
}

function dragLeave(e) {
  e.stopPropagation();
  this.classList.remove('over');
}

function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function dragDrop(e) {
  if (dragSrcEl != this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }
  return false;
}

function dragEnd(e) {
  var listItens = document.querySelectorAll('.draggable');
  [].forEach.call(listItens, function(item) {
    item.classList.remove('over');
  });
  this.style.opacity = '1';
}

function addEventsDragAndDrop(el) {
  el.addEventListener('dragstart', dragStart, false);
  el.addEventListener('dragenter', dragEnter, false);
  el.addEventListener('dragover', dragOver, false);
  el.addEventListener('dragleave', dragLeave, false);
  el.addEventListener('drop', dragDrop, false);
  el.addEventListener('dragend', dragEnd, false);
}

var listItens = document.querySelectorAll('.draggable');
[].forEach.call(listItens, function(item) {
  addEventsDragAndDrop(item);
});

function addNewItem() {
  var newItem = document.querySelector('.input').value;
  if (newItem != '') {
    document.querySelector('.input').value = '';
    var li = document.createElement('li');
    var attr = document.createAttribute('draggable');
    var ul = document.querySelector('ul');
    li.className = 'draggable';
    attr.value = 'true';
    li.setAttributeNode(attr);
    li.appendChild(document.createTextNode(newItem));
    ul.appendChild(li);
    addEventsDragAndDrop(li);
  }
}

btn.addEventListener('click', addNewItem);