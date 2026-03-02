
export default function OverdueAlerts() {
  const alerts = [
    { company: 'Warung Sejahtera Depok', contact: 'Siti Rahayu', days: 5, type: 'Tindak Lanjut', priority: 'high' },
    { company: 'RM Sederhana', contact: 'Ahmad Fauzi', days: 3, type: 'Demo', priority: 'high' },
    { company: 'Minimarket Citra', contact: 'Dewi Lestari', days: 2, type: 'Proposal', priority: 'medium' },
    { company: 'Toko Sumber Rezeki', contact: 'Bambang Wijaya', days: 1, type: 'Tindak Lanjut', priority: 'medium' },
    { company: 'Kantor HR Depok', contact: 'Linda Kusuma', days: 1, type: 'Closing', priority: 'high' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Tindak Lanjut Terlambat</h3>
          <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center whitespace-nowrap">
            {alerts.length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <div key={index} className="p-4 bg-red-50 border border-red-100 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">{alert.company}</h4>
                <p className="text-xs text-gray-600 mt-1">{alert.contact}</p>
              </div>
              <span className={`
                px-2 py-1 rounded text-xs font-semibold whitespace-nowrap
                ${alert.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}
              `}>
                {alert.type}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-red-600 font-medium">
              <i className="ri-time-line w-4 h-4 flex items-center justify-center"></i>
              <span className="whitespace-nowrap">Terlambat {alert.days} hari</span>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer">
        Lihat Semua Tugas
      </button>
    </div>
  );
}
