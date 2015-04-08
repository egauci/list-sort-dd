import ddcntrol from './ddcntrol';
import config from './dconfig';

let callBack = function (cfg) {
  console.log(`New order: ${this.listid}`);
  if (console.table) {
    console.table(cfg.list);
  } else {
    console.dir(cfg.list);
  }
};

ddcntrol(config, callBack.bind({listid: 'list 1'}), document.querySelector('#ddCtr1'));
ddcntrol(config, callBack.bind({listid: 'list 2'}), document.querySelector('#ddCtr2'));
