import { modules } from './env';
import { Stress } from './stress/Stress';

modules.forEach(_module => {
  switch (_module) {
    case 'stress':
      new Stress();
      break;
    default:
      break;
  }
})