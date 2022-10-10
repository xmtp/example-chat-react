import { ChatProvider } from '../src/index'
import { alice, bob } from '../src/tests/wallets'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const mockLookup = {
  [alice.address]: { name: 'Alice' },
  [bob.address]: { name: 'Bob' },
}

export const decorators = [
  (Story, context) => {
    return (
      <ChatProvider
        signer={alice}
        lookupAddress={async (address) => mockLookup[address] || {}}
      >
        <Story {...context} />
      </ChatProvider>
    )
  },
]
