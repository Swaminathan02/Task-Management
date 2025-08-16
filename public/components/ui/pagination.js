// Pagination component
import { appState } from '../../state/app-state.js';
import { dom } from '../../utils/dom.js';

export class Pagination {
  constructor(taskManager) {
    this.taskManager = taskManager;
  }

  update() {
    this.updateInfo();
    this.updateButtons();
    this.generatePageNumbers();
  }

  updateInfo() {
    const start = (appState.currentPage - 1) * appState.itemsPerPage + 1;
    const end = Math.min(appState.currentPage * appState.itemsPerPage, appState.tasks.length + start - 1);
    const total = appState.tasks.length;

    const paginationInfo = dom.getElementById('pagination-info');
    dom.setText(paginationInfo, `Showing ${start}-${end} of ${total} tasks`);
  }

  updateButtons() {
    const prevBtn = dom.getElementById('prev-btn');
    const nextBtn = dom.getElementById('next-btn');
    
    prevBtn.disabled = appState.currentPage === 1;
    nextBtn.disabled = appState.currentPage === appState.totalPages;
  }

  generatePageNumbers() {
    const pageNumbers = dom.getElementById('page-numbers');
    dom.setContent(pageNumbers, '');

    for (let i = 1; i <= appState.totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = `page-number ${i === appState.currentPage ? 'active' : ''}`;
      pageBtn.textContent = i;
      pageBtn.onclick = () => this.taskManager.changePage(i);
      pageNumbers.appendChild(pageBtn);
    }
  }
}