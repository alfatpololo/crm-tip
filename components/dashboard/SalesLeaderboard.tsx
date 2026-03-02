
export default function SalesLeaderboard() {
  const salesData = [
    { rank: 1, name: 'Nina', avatar: 'NA', activities: 156, conversion: 28.5, revenue: 48500000, score: 94 },
    { rank: 2, name: 'Ilham', avatar: 'IH', activities: 142, conversion: 26.2, revenue: 45200000, score: 91 },
    { rank: 3, name: 'Robby', avatar: 'RB', activities: 138, conversion: 25.8, revenue: 43800000, score: 89 },
    { rank: 4, name: 'Radi', avatar: 'RD', activities: 125, conversion: 24.1, revenue: 39500000, score: 85 },
    { rank: 5, name: 'Jemi', avatar: 'JM', activities: 118, conversion: 22.8, revenue: 36200000, score: 82 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Papan Peringkat Penjualan</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap cursor-pointer">
          Lihat Laporan Lengkap
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Peringkat</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Sales Rep</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Aktivitas</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Konversi</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Pendapatan</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Skor</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((rep) => (
              <tr key={rep.rank} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm whitespace-nowrap
                    ${rep.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                      rep.rank === 2 ? 'bg-gray-100 text-gray-700' : 
                      rep.rank === 3 ? 'bg-orange-100 text-orange-700' : 
                      'bg-blue-50 text-blue-700'}
                  `}>
                    {rep.rank}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-sm whitespace-nowrap">
                      {rep.avatar}
                    </div>
                    <span className="font-medium text-gray-900 whitespace-nowrap">{rep.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right text-gray-900 font-medium whitespace-nowrap">{rep.activities}</td>
                <td className="py-4 px-4 text-right text-gray-900 font-medium whitespace-nowrap">{rep.conversion}%</td>
                <td className="py-4 px-4 text-right text-gray-900 font-medium whitespace-nowrap">Rp {(rep.revenue / 1000000).toFixed(0)}Jt</td>
                <td className="py-4 px-4 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-50 text-blue-700 whitespace-nowrap">
                    {rep.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
