import { isMobile } from './compatibility';

export function query(selector, parent = document) {
    return parent.querySelector(selector);
}

export function queryAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
}

export function addClass(target, className) {
    return target.classList.add(className);
}

export function removeClass(target, className) {
    return target.classList.remove(className);
}

export function hasClass(target, className) {
    return target.classList.contains(className);
}

export function append(parent, child) {
    if (child instanceof Element) {
        parent.appendChild(child);
    } else {
        parent.insertAdjacentHTML('beforeend', String(child));
    }
    return parent.lastElementChild || parent.lastChild;
}

export function remove(child) {
    return child.parentNode.removeChild(child);
}

export function setStyle(element, key, value) {
    element.style[key] = value;
    return element;
}

export function setStyles(element, styles) {
    for (const key in styles) {
        setStyle(element, key, styles[key]);
    }
    return element;
}

export function getStyle(element, key, numberType = true) {
    const value = window.getComputedStyle(element, null).getPropertyValue(key);
    return numberType ? parseFloat(value) : value;
}

export function sublings(target) {
    return Array.from(target.parentElement.children).filter((item) => item !== target);
}

export function inverseClass(target, className) {
    sublings(target).forEach((item) => removeClass(item, className));
    addClass(target, className);
}

export function tooltip(target, msg, pos = 'top') {
    if (isMobile) return;
    target.setAttribute('aria-label', msg);
    addClass(target, 'hint--rounded');
    addClass(target, `hint--${pos}`);
}

export function isInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    const vertInView = rect.top - offset <= windowHeight && rect.top + rect.height + offset >= 0;
    const horInView = rect.left - offset <= windowWidth + offset && rect.left + rect.width + offset >= 0;
    return vertInView && horInView;
}

export function includeFromEvent(event, target) {
    return event.composedPath && event.composedPath().indexOf(target) > -1;
}

export function includeFromEventGroup(event, ...target){
    for(let i = 0; i < target.length; i++){
        if(includeFromEvent(event,target[i])){
            return true;
        }
    }
    return false;
}

export function replaceElement(newChild, oldChild) {
    oldChild.parentNode.replaceChild(newChild, oldChild);
    return newChild;
}

export function createElement(tag) {
    return document.createElement(tag);
}

export function getIcon(key = '', html = '') {
    const icon = createElement('i');
    addClass(icon, 'art-icon');
    addClass(icon, `art-icon-${key}`);
    append(icon, html);
    return icon;
}

export function dragElement(elmnt,extraHeight = 0, extraWidth = 0) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let sh;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        if(sh === undefined){
            sh = (window.titleBarHeight)?(window.titleBarHeight).get():0;
        }
        let h = extraHandle(extraHeight,sh);
        // let w = extraHandle(extraWidth,(window.titleBarHeight)?(window.titleBarHeight).get():0);
        elmnt.style.top = (((elmnt.offsetTop - pos2)<=h)?h:Math.min((elmnt.offsetTop - pos2),document.documentElement.clientHeight - elmnt.clientHeight)) + "px";
        elmnt.style.left = ((elmnt.offsetLeft - pos1)<=extraWidth?extraWidth:Math.min((elmnt.offsetLeft - pos1),document.documentElement.clientWidth - elmnt.clientWidth)) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function extraHandle(extra,stand){
        return (stand && (extra !== stand) && (stand !== 0)) ? stand : extra;
    }
}
