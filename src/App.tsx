import { useState } from "react";
import Web3 from "web3";
import HexBox from "./components/HexBox";

const hexValues = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
];

const web3 = new Web3(); // Instanzia Web3
const targetPublicKey = "1BY8GQbnueYofwSuFAT3USAhGjPrkxDdW9"; // Chiave target dichiarata

const App = () => {
  const [values, setValues] = useState(Array(13).fill("0"));
  values[0] = "4"; // Impostiamo la prima casella su "4"

  const [privateKey, setPrivateKey] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [matchFound, setMatchFound] = useState<boolean>(false); // Stato per indicare se c'è corrispondenza

  const handleChange = (index: number, newValue: string) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
  };

  // Funzione per generare chiavi e cercare la soluzione
  const calculateKeys = () => {
    let found = false;
    let currentAttempt = 0;
    const maxCombinations = Math.pow(16, 4); // 16^6 combinazioni possibili per i finali

    // Loop per combinazioni di finali
    for (let i = 0; i < maxCombinations && !found; i++) {
      // Aggiungi i finali esadecimali
      const hexValue = values.join(""); // Combina la parte di 11 cifre
      const paddedHexRight = hexValue + i.toString(16).padStart(4, "0"); // Aggiungi finale

      // Converte in formato esadecimale per chiave privata
      const paddedHex = paddedHexRight.padStart(64, "0");

      if (paddedHex.length !== 64) {
        console.error("La chiave privata deve essere lunga 64 caratteri.");
        return;
      }

      try {
        const key = web3.eth.accounts.privateKeyToAccount("0x" + paddedHex);

        setPrivateKey(key.privateKey);
        setAddress(key.address);

        // Confronta con la chiave pubblica target
        if (key.address.toLowerCase() === targetPublicKey.toLowerCase()) {
          setMatchFound(true);
          alert("Chiave pubblica trovata! Operazione completata.");
          found = true;
        }

        // Log ogni 100 tentativi
        if (currentAttempt % 100 === 0) {
          console.log(`Tentativo ${currentAttempt}:`);
          console.log("Chiave pubblica:", key.address);
          console.log("Chiave privata:", key.privateKey);
        }

        currentAttempt++;
      } catch (error) {
        console.error("Errore nella generazione della chiave privata:", error);
      }
    }

    // Se tutte le combinazioni sono state tentate senza trovare la soluzione
    if (!found) {
      alert("Nessuna chiave pubblica trovata dopo tutte le combinazioni.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-10 space-y-4 bg-orange-300">
      <div className="flex space-x-4">
        <HexBox
          initial="4"
          range={["4", "5", "6", "7"]}
          onChange={(value: string) => handleChange(0, value)}
        />
        {[...Array(12)].map((_, i) => (
          <HexBox
            key={i + 1}
            initial="0"
            range={hexValues}
            onChange={(value: string) => handleChange(i + 1, value)}
          />
        ))}
      </div>

      <button
        onClick={calculateKeys}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Go
      </button>

      <div className="mt-4 text-center">
        <p>
          <strong>Chiave privata:</strong> {privateKey}
        </p>
        <p>
          <strong>Indirizzo pubblico:</strong> {address}
        </p>
        {matchFound && (
          <p className="text-green-500">La chiave pubblica è stata trovata!</p>
        )}
        {!matchFound && (
          <p className="text-red-500">
            La chiave pubblica non è stata trovata!
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
