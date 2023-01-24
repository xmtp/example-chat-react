import 'es6-shim'
import React from 'react'
import { createRoot } from 'react-dom/client'

import ExtensionRoot from '../../components/ExtensionRoot'

function IndexPopup() {
  return (
    <div>
      <ExtensionRoot />
    </div>
  )
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<IndexPopup />)
