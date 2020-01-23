// JAVASCRIPT VOOR VOETNOOT-TEKST //
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

// JAVASCRIPT VOOR AANUIT-TEKST//
var checkboxes = document.querySelectorAll('input');

for( var i = 0; i < checkboxes.length; i++ ) {

  checkboxes[i].addEventListener("change", function() {
    updateBugs(this);
  });
}

function updateBugs(changedElement) {
  var checkedCount = document.querySelectorAll('input:checked').length;

  // No bugs, thats impossible!
  if( checkedCount === 0 ) {
    turnOnRandomBug(changedElement);
    if( Math.random() >= 0.85 ) {
      turnOnRandomBug(changedElement);
    }
  }
}

function turnOnRandomBug(excluding) {
  turnOn = Math.floor(Math.random() * checkboxes.length);

  if( checkboxes[turnOn] === excluding) {
    turnOn = turnOn - 1;
    if( turnOn > (checkboxes.length - 1)) {
      turnOn = 0;
    }
  }

  checkboxes[turnOn].checked = true;
}

setTimeout(function() {
  turnOnRandomBug(null);
}, 400)

// TERMINAL //

$.fn.typewriter = function() {
  this.each(function() {
    var c = $(this),
      b = c.html(),
      a = 0,
      d = 0;
    c.html("");
    var e = function() {
      if ("<" == b.substring(a, a + 1)) {
        var f = new RegExp(/<span class="instant"/),
          g = new RegExp(/<span class="clear"/);
        if (b.substring(a, b.length).match(f)) a += b.substring(a, b.length).indexOf("</span>") + 7;
        else if (b.substring(a, b.length).match(g)) d = a, a += b.substring(a, b.length).indexOf("</span>") + 7;
        else
          for (;
            ">" != b.substring(a, a + 1);) a++
      }
      c.html(b.substring(d, a++) + (a & 1 ? "_" : ""));
      a >= b.length || setTimeout(e, 70 + 100 *
        Math.random())
    };
    e()
  });
  return this
};
$(".terminal").typewriter();

function goBack() {
  window.history.back();
}