declare module '*.svg' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any
  export default content
}

declare module '*.png' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any
  export default content
}

declare module '*.jpeg' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any
  export default content
}

declare module 'react-blockies' {
  import React from 'react'
  interface BlockiesProps {
    seed: string
    size?: number
    scale?: number
    color?: string
    bgColor?: string
    spotColor?: string
    className?: string
  }
  const Blockies: React.FC<BlockiesProps>

  export default Blockies
}
