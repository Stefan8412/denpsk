import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeGenerator = () => {
  const votingPageURL = "https://den.psk.sk"; // Change to your actual voting page URL
  const [qrValue, setQrValue] = useState(votingPageURL);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold">Deň PSK QR Code </h2>
      <QRCodeCanvas value={qrValue} size={200} />
      <p className="mt-2 text-sm text-gray-600">
        Skenuj so svojim mobilom aby si videl tento web
      </p>
    </div>
  );
};

export default QRCodeGenerator;
