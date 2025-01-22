import { useState } from "react";

// Type for props
interface CopyTextProps {
  text: string | null;
}

const CopyText: React.FC<CopyTextProps> = ({ text }) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Copy text to clipboard function
  const copyTextFunction = async () => {
    if (text) {
      await window.navigator.clipboard.writeText(text);
      setCopied(true);

      // Reset "copied" state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div>
      {copied ? (
        <AfterCopyComponent />
      ) : (
        <CopyComponent func={copyTextFunction} />
      )}
    </div>
  );
};

// Type for CopyComponent props
interface CopyComponentProps {
  func: () => void;
}

const CopyComponent: React.FC<CopyComponentProps> = ({ func }) => {
  return (
    <div
      className="flex gap-1 font-light cursor-pointer"
      onClick={func} // Pass the function reference
    >
      <img src="/images/copy-text.svg" width={15} height={15} alt="Copy" />
      <span className="text-xs text-[#cfcfcf]">Copy</span>
    </div>
  );
};

const AfterCopyComponent: React.FC = () => {
  return (
    <div className="flex gap-1 font-light cursor-pointer items-center">
      <img src="/images/tick.svg" width={16} height={16} alt="Copied" />
      <span className="text-xs text-[#cfcfcf]">Copied!</span>
    </div>
  );
};

export default CopyText;
