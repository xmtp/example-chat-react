import Link from 'next/link'
import { ReactNode } from 'react'

export const NavigationColumnLayout = ({ children }) => (
  <aside className="fixed inset-y-0 flex flex-col flex-grow w-full md:w-84">
    <div className="flex flex-col flex-grow overflow-y-auto bg-white md:border-r md:border-gray-200">
      {children}
    </div>
  </aside>
)

export const TopBarLayout = ({ children }) => (
  <div className="sticky flex-col top-0 z-10 flex flex-shrink-0 border-b border-gray-200 bg-zinc-50 md:bg-white md:border-0">
    {children}
  </div>
)

export type RenderContext = 'next' | 'react'

interface INavigationHeaderLayout {
  renderCtx?: RenderContext
  children: ReactNode
  onClickLogo?: () => void
}

export const NavigationHeaderLayout: React.FC<INavigationHeaderLayout> = ({
  children,
  renderCtx = 'next',
  onClickLogo,
}) => (
  <div className="h-[10vh] max-h-20 bg-p-600 flex items-center justify-between flex-shrink-0 px-4">
    {renderCtx === 'next' ? (
      <Link href="/" passHref={true}>
        <img className="w-auto h-8" src="/xmtp-icon.png" alt="XMTP" />
      </Link>
    ) : (
      <span onClick={onClickLogo}>
        <img className="w-auto h-8" src="/xmtp-icon.png" alt="XMTP" />
      </span>
    )}

    {children}
  </div>
)
