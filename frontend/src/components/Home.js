import React, { useState } from "react";

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const features = [
    {
      title: "🚗 Evidencija vozila",
      description:
        "Sistem omogućava dodavanje, ažuriranje i brisanje vozila sa svim potrebnim podacima.",
    },
    {
      title: "📝 Evidencija putnih naloga",
      description:
        "Omogućava unos informacija o putnom nalogu, uključujući vozača, broj putnika i lokacije.",
    },
    {
      title: "📊 Upravljanje statusima",
      description:
        "Nalozi mogu imati statuse 'evidentiran', 'potvrđen', 'odbijen' ili 'završen' radi lakšeg praćenja.",
    },
    {
      title: "📋 Kreiranje izvještaja",
      description:
        "Generišite izvještaje o korištenju vozila na osnovu vremenskog perioda i vozila.",
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? features.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === features.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      {/* PONG Logo */}
      <img src="/pong.png" alt="PONG Logo" className="w-28 h-auto mb-3" />

      {/* Naslov i opis */}
      <h1 className="text-3xl font-bold text-blue-700 mb-3">
        Dobrodošli u Fleet Management Sistem
      </h1>
      <p className="text-md text-gray-700 max-w-2xl mb-4">
        PONG kompanija sada ima moderni sistem za upravljanje voznim parkom, omogućavajući
        digitalnu evidenciju vozila i putnih naloga. Ovaj sistem olakšava upravljanje flotom,
        smanjuje ručni rad i poboljšava efikasnost.
      </p>

      {/* Ključne funkcionalnosti */}
      <h2 className="text-xl font-semibold text-blue-600 mb-3">
        Ključne funkcionalnosti
      </h2>

      {/* Carousel container */}
      <div className="relative w-full max-w-md flex items-center justify-center">
        {/* Strelica lijevo - pomaknuta van kartice */}
        <button
          onClick={handlePrev}
          className="absolute left-[-50px] bg-gray-300 p-2 rounded-full shadow-md hover:bg-gray-400 transition"
        >
          ◀
        </button>

        {/* Kartica sa funkcionalnostima */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full text-center">
          <h3 className="font-bold text-lg text-gray-900">{features[currentIndex].title}</h3>
          <p className="text-sm text-gray-700 mt-2">{features[currentIndex].description}</p>
        </div>

        {/* Strelica desno - pomaknuta van kartice */}
        <button
          onClick={handleNext}
          className="absolute right-[-50px] bg-gray-300 p-2 rounded-full shadow-md hover:bg-gray-400 transition"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Home;