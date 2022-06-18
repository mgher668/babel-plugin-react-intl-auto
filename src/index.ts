import { PluginObj } from '@babel/core'
import { State } from './types'
import { visitJSXElement } from './visitors/jsx'
import { addIdToDefineMessage } from './visitors/addIdToDefineMessage'
import { addIdToFormatMessage } from './visitors/addIdToFormatMessage'

export default function () {
  return {
    name: 'react-intl-auto',
    visitor: {
      JSXElement: visitJSXElement,
      CallExpression(path, state: State) {
        let isMatchedFile = true
        if (typeof state.opts.includes === 'string') {
          isMatchedFile = state.file.opts.filename
            .slice(state.file.opts.cwd.length)
            .startsWith(state.opts.includes)
        } else if (Array.isArray(state.opts.includes)) {
          isMatchedFile = state.opts.includes.some((n) =>
            state.file.opts.filename
              .slice(state.file.opts.cwd.length)
              .startsWith(n)
          )
        }
        if (isMatchedFile) {
          addIdToFormatMessage(path, state)
          addIdToDefineMessage(path, state)
        }
      },
    },
  } as PluginObj
}
