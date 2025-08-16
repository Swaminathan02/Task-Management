// Stats component
import { appState } from '../../state/app-state.js';
import { dom } from '../../utils/dom.js';

export class Stats {
  update() {
    const totalTasks = appState.tasks.length;
    const completedTasks = appState.tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const totalHours = appState.tasks.reduce((sum, t) => sum + t.estimatedHours, 0);

    dom.setText(dom.getElementById('total-tasks'), totalTasks);
    dom.setText(dom.getElementById('completed-tasks'), completedTasks);
    dom.setText(dom.getElementById('pending-tasks'), pendingTasks);
    dom.setText(dom.getElementById('total-hours'), totalHours.toFixed(1));
  }
}