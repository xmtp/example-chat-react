import {
  LinkIcon,
  BookOpenIcon,
  UserGroupIcon,
  ChevronRightIcon,
  ArrowSmRightIcon,
} from '@heroicons/react/solid'

type InfoRowProps = {
  icon: JSX.Element
  headingText: string
  subHeadingText: string
}

const InfoRows = [
  {
    icon: <LinkIcon />,
    headingText: 'Connect your wallet',
    subHeadingText: 'Verify your wallet to start using the XMTP protocol',
  },
  {
    icon: <BookOpenIcon />,
    headingText: 'Read the docs',
    subHeadingText:
      'Check out the documentation for our protocol and find out how to get up and running quickly',
  },
  {
    icon: <UserGroupIcon />,
    headingText: 'Join our community',
    subHeadingText:
      'Talk about what you’re building or find out other projects that are building upon XMTP',
  },
]

const InfoRow = ({
  icon,
  headingText,
  subHeadingText,
}: InfoRowProps): JSX.Element => (
  <div className="flex py-4 border border-x-0 border-y-zinc-50 justify-between items-stretch">
    <div className="h-10 w-10 bg-l-300 rounded-lg text-white p-2">{icon}</div>
    <div className="ml-3 flex-col justify-center text-md flex-1">
      <div className="font-semibold text-n-600">{headingText}</div>
      <div className="text-n-300">{subHeadingText}</div>
    </div>
    <button className="w-10 flex justify-end items-center pr-2">
      <ChevronRightIcon className="h-5" />
    </button>
  </div>
)

const InfoPanel = (): JSX.Element => (
  <div className="m-auto w-[464px]">
    <div className="pb-6">
      <div className="text-xl text-n-600 font-semibold mb-1">
        Welcome to the web3 communication protocol
      </div>
      <div className="text-md text-n-300">
        Get started by reading the docs or joining the community
      </div>
    </div>
    <div>
      {InfoRows.map((info, index) => {
        return (
          <InfoRow
            key={index}
            icon={info.icon}
            headingText={info.headingText}
            subHeadingText={info.subHeadingText}
          />
        )
      })}
    </div>
    <div className="flex justify-between items-center mt-4">
      <div className="text-n-600 text-sm">Version v0.0.1</div>
      <a className="text-l-300 font-semibold text-md flex items-center">
        I need help <ArrowSmRightIcon className="h-5 fill-l-300" />
      </a>
    </div>
  </div>
)

export default InfoPanel
