import Didact from './didact'

const rootDom = document.getElementById("root");

function tick() {
  const time = new Date().toLocaleTimeString();
  const clockElement = <h1>{time}</h1>;
  Didact.render(clockElement, rootDom);
}

tick();

setInterval(tick, 1000);

Didact.render(element, document.getElementById('root'))
