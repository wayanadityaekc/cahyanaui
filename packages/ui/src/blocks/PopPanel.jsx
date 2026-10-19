import { cn } from '../lib/cn.js';
import { navPop } from './navbarClasses.js';

export default function PopPanel({ pop: Pop = null, open = false, className, children, ...rest }) {
  if (Pop) {
    return (
      <Pop open={open}>
        <div className={className} data-nav-pop {...rest}>
          {children}
        </div>
      </Pop>
    );
  }
  return (
    <div className={cn(className, navPop(open))} data-nav-pop {...rest}>
      {children}
    </div>
  );
}
