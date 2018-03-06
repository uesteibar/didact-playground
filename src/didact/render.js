let currentInstance = null

const putInDom = (newInstance, container) => {
  if (currentInstance == null) {
    container.appendChild(newInstance.dom);
  } else {
    container.replaceChild(newInstance.dom, currentInstance.dom);
  }
}

const reconcile = (element, container) => {
  const newInstance = createInstance(element)
  putInDom(newInstance, container)

  return newInstance
}

const isEvent = name => name.startsWith("on");
const isAttribute = name => !isEvent(name) && name != "children";

const removeDomProperties = (dom) => {
  const currentProps = currentInstance.element.props

  Object.keys(currentProps).filter(isEvent).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.removeEventListener(eventType, prevProps[name]);
  });

  Object.keys(currentProps).filter(isAttribute).forEach(name => {
    delete dom[name]
  });
}

const addDomProperties = (dom, props) => {
  Object.keys(props).filter(isEvent).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, props[name]);
  });

  Object.keys(props).filter(isAttribute).forEach(name => {
    dom[name] = props[name];
  });
}

const updateDomProperties = (dom, props) => {
  if (currentInstance !== null) removeDomProperties(dom)
  addDomProperties(dom, props)

  return dom
}

const createInstance = (element) => {
  const { type, props } = element;

  // Create DOM element
  const isTextElement = type === 'TEXT ELEMENT'
  const dom = isTextElement ? document.createTextNode(props.nodevalue) : document.createElement(type)

  updateDomProperties(dom, props)

  // Instantiate and append children
  const childElements = props.children || [];
  const childInstances = childElements.map(createInstance);
  const childDoms = childInstances.map(childInstance => childInstance.dom);
  childDoms.forEach(childDom => dom.appendChild(childDom));

  return { dom, element, childInstances };
}

const render = (element, container) => {
  const { type, props } = element

  currentInstance = reconcile(element, container)
}

export default render
