import Wallet from "../sections/Wallet";
import { Section } from "../common/Section";

const WalletPage = () => {
  return (
    <Section id="wallet-page">
      <Wallet limit={12} /> {/* Show more cards on the dedicated page */}
    </Section>
  );
};

export default WalletPage;
