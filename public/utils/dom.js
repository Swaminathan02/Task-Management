// DOM utilities
export const dom = {
  getElementById: (id) => document.getElementById(id),
  
  querySelector: (selector) => document.querySelector(selector),
  
  querySelectorAll: (selector) => document.querySelectorAll(selector),
  
  addClass: (element, className) => {
    if (element) element.classList.add(className);
  },
  
  removeClass: (element, className) => {
    if (element) element.classList.remove(className);
  },
  
  toggleClass: (element, className) => {
    if (element) element.classList.toggle(className);
  },
  
  hasClass: (element, className) => {
    return element ? element.classList.contains(className) : false;
  },
  
  setContent: (element, content) => {
    if (element) element.innerHTML = content;
  },
  
  setText: (element, text) => {
    if (element) element.textContent = text;
  }
};