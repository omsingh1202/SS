import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { QRCodeSVG } from 'qrcode.react';

const PublicDisplay = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    return onSnapshot(doc(db, "toilets", id), (d) => setData(d.data()));
  }, [id]);

  if (!data) return null;

  const bgColor = {
    'A': 'bg-green-500', 'B': 'bg-green-400',
    'C': 'bg-yellow-400', 'D': 'bg-orange-500',
    'E': 'bg-red-500', 'F': 'bg-black'
  }[data.grade] || 'bg-gray-500';

  return (
    <div className={`${bgColor} h-screen flex flex-col items-center justify-center text-white p-10`}>
      <h1 className="text-9xl font-black mb-4">{data.grade}</h1>
      <p className="text-4xl mb-8">Hygiene Status: {data.score}/100</p>
      
      <div className="grid grid-cols-2 gap-10 text-2xl bg-white/20 p-8 rounded-2xl backdrop-blur-md">
        <div>Water: {data.waterAvailable ? "✅ YES" : "❌ NO"}</div>
        <div>Status: {data.isOpen ? "🟢 OPEN" : "🔴 CLOSED"}</div>
        <div className="col-span-2">Last Cleaned: {data.lastCleanedAt?.toDate().toLocaleTimeString()}</div>
      </div>

      <div className="mt-12 p-4 bg-white rounded-xl">
        <QRCodeSVG value={`https://your-app.com/toilet/${id}`} size={200} />
        <p className="text-black text-center mt-2 font-bold">SCAN TO REPORT</p>
      </div>
    </div>
  );
};