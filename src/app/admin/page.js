'use client';

import { useEffect, useState } from 'react';
import { Download, Trash2, RefreshCw } from 'lucide-react';

export default function AdminEmails() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Charger les emails
  const fetchEmails = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/get-emails');
      const data = await response.json();
      setEmails(data.emails || []);
      setStats({
        total: data.totalEmails || 0,
        lastEmail: data.lastEmail
      });
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des emails: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // Exporter en CSV
  const exportToCSV = () => {
    if (emails.length === 0) {
      alert('Aucun email à exporter');
      return;
    }

    const headers = ['Email', 'Profil', 'Score', 'Contexte', 'Date'];
    const rows = emails.map(e => [
      e.email,
      e.userPattern,
      e.vitalityScore,
      e.context,
      new Date(e.submittedAt).toLocaleString('fr-FR')
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `emails_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Supprimer tous les emails
  const deleteAllEmails = async () => {
    if (!confirm('⚠️ Êtes-vous sûr? Cette action est irréversible!')) return;

    const adminKey = prompt('Entrez la clé admin:');
    if (!adminKey) return;

    try {
      const response = await fetch('/api/get-emails', {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey
        }
      });
      const data = await response.json();

      if (data.success) {
        setEmails([]);
        setStats({ total: 0, lastEmail: null });
        alert('✅ Tous les emails ont été supprimés');
      } else {
        alert('❌ ' + data.message);
      }
    } catch (err) {
      alert('❌ Erreur: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📧 Admin - Emails</h1>
          <p className="text-gray-300">Gestion des emails collectés via la popup de sortie</p>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
              <p className="text-gray-300 text-sm">Total d'emails</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
              <p className="text-gray-300 text-sm">Dernier email</p>
              <p className="text-lg font-bold text-white">
                {stats.lastEmail 
                  ? new Date(stats.lastEmail).toLocaleString('fr-FR')
                  : 'Aucun'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
              <p className="text-gray-300 text-sm">Fichier</p>
              <p className="text-lg font-bold text-white">/data/emails.json</p>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={fetchEmails}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <RefreshCw size={20} />
            Actualiser
          </button>
          <button
            onClick={exportToCSV}
            disabled={emails.length === 0}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <Download size={20} />
            Exporter CSV
          </button>
          <button
            onClick={deleteAllEmails}
            disabled={emails.length === 0}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            <Trash2 size={20} />
            Supprimer tous
          </button>
        </div>

        {/* Messages */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">⏳ Chargement...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 mb-8">
            <p className="text-red-200">❌ {error}</p>
          </div>
        )}

        {/* Tableau des emails */}
        {!loading && emails.length > 0 && (
          <div className="bg-white/10 backdrop-blur rounded-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20 bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Profil</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Contexte</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {emails.map((email) => (
                    <tr key={email.id} className="hover:bg-white/5 transition">
                      <td className="px-6 py-4 text-sm text-white font-mono">{email.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{email.userPattern}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <span className="bg-blue-500/30 px-3 py-1 rounded-full text-blue-200">
                          {email.vitalityScore}/100
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <span className="bg-purple-500/30 px-3 py-1 rounded-full text-purple-200">
                          {email.context}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(email.submittedAt).toLocaleString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && emails.length === 0 && !error && (
          <div className="text-center py-16 bg-white/5 rounded-lg border border-white/20">
            <p className="text-gray-400 text-lg">📭 Aucun email pour l'instant</p>
            <p className="text-gray-500 text-sm mt-2">Les emails apparaîtront ici après soumission via la popup</p>
          </div>
        )}
      </div>
    </div>
  );
}
