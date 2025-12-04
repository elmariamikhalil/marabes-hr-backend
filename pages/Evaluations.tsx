import React, { useEffect, useState } from 'react';
import { db } from '../services/mockDb';
import { useAuth } from '../App';
import { UserScore, EvaluationCategory } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const Evaluations: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<EvaluationCategory[]>([]);
  const [scores, setScores] = useState<UserScore[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const cats = await db.getCategories();
      const s = await db.getScores();
      setCategories(cats);
      setScores(s);
      processChartData(cats, s);
    };
    init();
  }, []);

  const processChartData = (cats: EvaluationCategory[], allScores: UserScore[]) => {
    // Goal: Count users in buckets per category
    const buckets = [
      { label: '0-30', min: 0, max: 30 },
      { label: '31-50', min: 31, max: 50 },
      { label: '51-70', min: 51, max: 70 },
      { label: '71-100', min: 71, max: 100 },
    ];

    const data = cats.map(cat => {
      const catScores = allScores.filter(s => s.categoryId === cat.id);
      const entry: any = { name: cat.name };
      
      buckets.forEach(b => {
        entry[b.label] = catScores.filter(s => s.score >= b.min && s.score <= b.max).length;
      });
      return entry;
    });

    setChartData(data);
  };

  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold text-gray-800">Evaluations & Performance</h1>
       
       {/* Reports Section (Admin) */}
       {user?.role === 'ADMIN' && (
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-mint-800">Score Distribution Report</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="0-30" fill="#f87171" stackId="a" />
                  <Bar dataKey="31-50" fill="#fbbf24" stackId="a" />
                  <Bar dataKey="51-70" fill="#60a5fa" stackId="a" />
                  <Bar dataKey="71-100" fill="#34d399" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-gray-400 mt-2">Number of employees per score range per category</p>
         </div>
       )}

       {/* Score List */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scores.map(score => (
             <div key={score.id} className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{categories.find(c => c.id === score.categoryId)?.name}</span>
                    <span className="text-xs text-gray-400">{score.date}</span>
                  </div>
                  <h3 className="font-medium text-gray-800">{score.userName}</h3>
                </div>
                <div className="mt-4">
                   <div className="flex justify-between items-end mb-1">
                      <span className="text-3xl font-bold text-gray-800">{score.score}</span>
                      <span className="text-xs text-gray-500 mb-1">/100</span>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${score.score > 70 ? 'bg-mint-500' : score.score > 50 ? 'bg-blue-400' : 'bg-red-400'}`} 
                        style={{ width: `${score.score}%` }}
                      ></div>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default Evaluations;
