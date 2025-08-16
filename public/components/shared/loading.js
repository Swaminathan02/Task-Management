// Loading component
import { dom } from '../../utils/dom.js';

class LoadingComponent {
  constructor() {
    this.loadingElement = dom.getElementById('loading');
  }

  show() {
    dom.removeClass(this.loadingElement, 'hidden');
  }

  hide() {
    dom.addClass(this.loadingElement, 'hidden');
  }
}

export const loading = new LoadingComponent();