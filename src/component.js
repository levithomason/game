class Component extends HTMLElement {
  constructor() {
    super()

    const constructor = this.constructor
    const componentName = constructor.name

    //
    // 1. Auto bind methods
    //
    const prototype = Object.getPrototypeOf(this)
    const properties = Object.getOwnPropertyNames(prototype)

    properties.forEach(name => {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, name)

      // use the descriptor value to get the function
      // getters and setters do not have a descriptor value
      // so they cannot and should not be bound to the class
      const method = descriptor.value

      if (typeof method === 'function' && method !== constructor) {
        this[name] = this[name].bind(this)
      }
    })

    if (typeof this.render !== 'function') {
      throw new Error(`"${componentName}" is missing the render method.`)
    }

    //
    // 2. Create the shadow DOM and append the template to it
    //
    this.attachShadow({ mode: 'open' })
    const template = document.createElement('template')
    template.innerHTML = this.render()
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    //
    // 3. Create this.refs to select DOM nodes in the template
    //
    this.refs = new Proxy(
      {},
      {
        get: (_, prop) => this.shadowRoot.querySelector(`[ref="${prop}"]`),
      }
    )
  }

  emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }))
  }
}
