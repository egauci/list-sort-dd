import ddcntrol from './ddcntrol';
import config from './dconfig';

let callBack = function (cfg) {
  console.log('New order: ');
  if (console.table) {
    console.table(cfg.list);
  } else {
    console.dir(cfg.list);
  }
};

ddcntrol(config, callBack, document.querySelector('#ddCtr'));
