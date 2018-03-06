let currentInstance = null

const putInDom = (newInstance, instance, container) => {
  if (instance == null) {
    container.appendChild(newInstance.dom)
  } else {
    container.replaceChild(newInstance.dom, instance.dom)
  }
}

const createInstance = (element, instance) => {
  const { type, props } = element

  // Create DOM element
  const isTextElement = type === 'TEXT ELEMENT'
  const dom = isTextElement ? document.createTextNode(props.nodevalue) : document.createElement(type)

  updateDomProperties(dom, props, instance)

  // Instantiate and append children
  const childElements = props.children || []
  const childInstances = childElements.map((element) => createInstance(element, instance))
  const childDoms = childInstances.map(childInstance => childInstance.dom)
  childDoms.forEach(childDom => dom.appendChild(childDom))

  return { dom, element, childInstances }
}

const renderNewInstance = (element, container, instance) => {
  const newInstance = createInstance(element, instance)
  putInDom(newInstance, instance, container)

  return newInstance
}

const reconcileChildren = ({dom, childInstances}, {props: {children = []}}) => {
  const newChildInstances = []
  const count = Math.max(childInstances.length, children.length)

  for (let i = 0; i < count; i++) {
    const newChildInstance = reconcile(children[i], dom, childInstances[i])

    newChildInstances.push(newChildInstance)
  }

  return newChildInstances.filter(instance => instance != null)
}

const updateCurrentInstance = (element, instance) => {
  updateDomProperties(instance.dom, element.props, instance)
  instance.childInstances = reconcileChildren(instance, element)
  instance.element = element

  return instance
}

const deleteCurrentInstance = ({ dom }, container) => {
  container.removeChild(instance.dom)

  return null
}

const reconcile = (element, container, instance) => {
  if (instance === null) {
    const newInstance = renderNewInstance(element, container, instance)

    return newInstance
  } else if (element === null) {
    const newInstance = deleteCurrentInstance(instance, container)

    return newInstance
  } else if (instance.element.type === element.type) {
    const newInstance = updateCurrentInstance(element, instance)

    return newInstance
  } else {
    const newInstance = renderNewInstance(element, container, instance)

    return newInstance
  }
}

const isEvent = name => name.startsWith("on")
const isAttribute = name => !isEvent(name) && name != "children"

const removeDomProperties = (dom, instance) => {
  const currentProps = instance.element.props

  Object.keys(currentProps).filter(isEvent).forEach(name => {
    const eventType = name.toLowerCase().substring(2)
    dom.removeEventListener(eventType, currentProps[name])
  })

  Object.keys(currentProps).filter(isAttribute).forEach(name => {
    delete dom[name]
  })
}

const addDomProperties = (dom, props) => {
  Object.keys(props).filter(isEvent).forEach(name => {
    const eventType = name.toLowerCase().substring(2)
    dom.addEventListener(eventType, props[name])
  })

  Object.keys(props).filter(isAttribute).forEach(name => {
    dom[name] = props[name]
  })
}

const updateDomProperties = (dom, props, instance) => {
  if (instance !== null) removeDomProperties(dom, instance)
  addDomProperties(dom, props)

  return dom
}


const render = (element, container) => {
  const { type, props } = element

  currentInstance = reconcile(element, container, currentInstance)
}

export default render
