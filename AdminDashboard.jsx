import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AdminDashboard = () => {
  const [toilets, setToilets] = useState([]);

  useEffect(() => {
    // Real-time listener: Sort by worst grade first
    const q = query(collection(db, "toilets"), orderBy("score", "asc"));
    return onSnapshot(q, (snapshot) => {
      setToilets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const toggleStatus = async (id, field, currentVal) => {
    await updateDoc(doc(db, "toilets", id), { [field]: !currentVal });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sanitation Admin Panel</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Location</th>
              <th className="p-4">Grade</th>
              <th className="p-4">Score</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {toilets.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-4 font-medium">{t.name}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-white font-bold ${t.score < 40 ? 'bg-red-500' : 'bg-green-500'}`}>
                    {t.grade}
                  </span>
                </td>
                <td className="p-4">{t.score}/100</td>
                <td className="p-4 space-x-2">
                  <button 
                    onClick={() => toggleStatus(t.id, 'isOpen', t.isOpen)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                  >
                    {t.isOpen ? 'Close' : 'Open'}
                  </button>
                  <button 
                    onClick={() => toggleStatus(t.id, 'waterAvailable', t.waterAvailable)}
                    className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded text-sm"
                  >
                    Water: {t.waterAvailable ? 'ON' : 'OFF'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;