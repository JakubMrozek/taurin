const escape = require('escape-html')


const SELF_CLOSING = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]

function isString(value) {
  return typeof value === 'string'
}

function isNumber(value) {
  return typeof value === 'number'
}

function isUndefined(value) {
  return typeof value === 'undefined'
}

function element(name, attrs = null, children = [], config = {}) {
  config.self = SELF_CLOSING.includes(name)
  if (isString(attrs) || Array.isArray(attrs)) {
    children = attrs
    attrs = null
  }
  return {name, attrs, children, config}
}

function renderAttrs(attrs) {
  return Object.keys(attrs || {}).map((key) => (
    ` ${key}="${escape(attrs[key])}"`
  ))
}

function render(value) {
  if (isString(value) || isNumber(value)) {
    return escape(value)
  }
  if (isUndefined(value)) {
    return ''
  }

  const {name, attrs, children, config} = value
  let html = `<${name}`
  html += renderAttrs(attrs).join('')
  html += config.self ? '/>' : '>'
  if (Array.isArray(children)) {
    for (let i = 0, len = children.length; i < len; ++i) {
      html += render(children[i])
    }
  } else {
    html += config.noEscape ? children : escape(children)
  }
  if (!config.self) {
    html += `</${name}>`
  }
  return html
}


exports.el = element
exports.element = element
exports.render = render
