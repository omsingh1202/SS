import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const ToiletDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toilet, setToilet] = useState(null);
  const [reportType, setReportType] = useState('DIRTY');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return onSnapshot(doc(db, "toilets", id), (doc) => {
      setToilet({ id: doc.id, ...doc.data() });
    });
  }, [id]);

  const submitReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toiletId: id,
          type: reportType,
          rating: 3, // Default rating
        }),
      });
      const result = await response.json();
      alert(`Report submitted! Status updated to Grade ${result.alternative ? 'B' : 'A'}`);
    } catch (error) {
      console.error("Error reporting:", error);
    }
    setLoading(false);
  };

  if (!toilet) return <div className="p-10">Loading Toilet Data...</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-2">{toilet.name}</h1>
      <div className={`text-4xl font-black mb-4 ${toilet.score < 40 ? 'text-red-500' : 'text-green-600'}`}>
        Grade {toilet.grade} <span className="text-lg font-normal text-gray-500">({toilet.score}/100)</span>
      </div>

      <div className="space-y-2 mb-6 border-y py-4">
        <p>💧 Water: {toilet.waterAvailable ? 'Available' : 'No Water'}</p>
        <p>🚪 Status: {toilet.isOpen ? 'Open' : 'Closed'}</p>
      </div>

      <form onSubmit={submitReport} className="space-y-4">
        <h3 className="font-bold">Report an Issue:</h3>
        <select 
          value={reportType} 
          onChange={(e) => setReportType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="DIRTY">Dirty / Uncleaned</option>
          <option value="WET_FLOOR">Slippery / Wet Floor</option>
          <option value="OVERFLOW">Toilet Overflow</option>
          <option value="NO_WATER">No Water supply</option>
          <option value="SMELL">Bad Odor</option>
        </select>
        <button 
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
};

export default ToiletDetail;