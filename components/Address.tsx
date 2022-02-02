type AddressProps = {
  address: string;
  className?: string;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Address = ({ address, className }: AddressProps): JSX.Element => {
  const shortAddress = (addr: string): string =>
    addr.length > 10 && addr.startsWith("0x")
      ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
      : addr;

  return (
    <div className={classNames(className || "")} title={address}>
      {shortAddress(address)}
    </div>
  );
};

export default Address;
