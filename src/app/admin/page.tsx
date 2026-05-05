"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, Team } from "@/lib/supabase";
import { Trash2, RotateCcw, AlertTriangle, Skull, ShieldAlert } from "lucide-react";

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTeams = useCallback(async () => {
    const { data } = await supabase.from("teams").select("*").order("progress", { ascending: false });
    if (data) setTeams(data as Team[]);
  }, []);

  useEffect(() => {
    let ignore = false;
    const loadTeams = async () => {
      const { data } = await supabase.from("teams").select("*").order("progress", { ascending: false });
      if (!ignore && data) setTeams(data as Team[]);
    };

    if (isAuthenticated) {
      loadTeams();
      const channel = supabase
        .channel("admin-teams")
        .on("postgres_changes", { event: "*", schema: "public", table: "teams" }, () => loadTeams())
        .subscribe();
      return () => { 
        ignore = true;
        supabase.removeChannel(channel); 
      };
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      setIsAuthenticated(true);
      setError("");
    }
  };

  const handleAction = async (action: string, teamId?: string) => {
    const confirmMsg = 
      action === "delete_all" ? "⚠️ WARNING: Are you sure you want to DELETE ALL TEAMS? This cannot be undone!" :
      action === "reset_all" ? "⚠️ WARNING: Are you sure you want to RESET ALL PROGRESS?" :
      action === "delete_team" ? "Are you sure you want to delete this team?" :
      "Are you sure you want to reset this team's progress?";
      
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, adminPassword: password, teamId })
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          setPassword("");
        }
        throw new Error(data.error);
      }
      
      await fetchTeams();
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to perform action");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-pirate-black/80 border-2 border-blood-red/50 p-8 rounded-2xl shadow-2xl shadow-blood-red/20 backdrop-blur-md">
          <div className="flex justify-center mb-6 text-blood-red">
            <ShieldAlert className="w-16 h-16" />
          </div>
          <h1 className="font-[family-name:var(--font-pirate)] text-4xl text-center text-blood-red mb-2">Captain&apos;s Quarters</h1>
          <p className="text-center text-parchment-dark text-sm mb-8">Restricted Access. Enter the captain&apos;s passphrase.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password..."
                className="w-full bg-pirate-navy/50 border border-blood-red/30 text-parchment rounded-xl px-4 py-3 focus:outline-none focus:border-blood-red focus:ring-1 focus:ring-blood-red"
              />
            </div>
            {error && <p className="text-blood-red text-sm text-center">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-blood-red hover:bg-red-800 text-white font-bold py-3 rounded-xl transition-colors cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-pirate-black/40 p-6 rounded-2xl border border-gold-800/30">
        <div>
          <h1 className="font-[family-name:var(--font-pirate)] text-4xl md:text-5xl text-gold-400 mb-2 flex items-center gap-3">
            <Skull className="w-8 h-8 text-blood-red" />
            Admin Dashboard
          </h1>
          <p className="text-parchment-dark text-sm">Manage crews, reset progress, and orchestrate the CTF.</p>
        </div>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => handleAction("reset_all")}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-pirate-navy border border-gold-600/50 hover:bg-gold-900/30 text-gold-400 px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" /> Reset Entire Game
          </button>
          <button 
            onClick={() => handleAction("delete_all")}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blood-red/10 border border-blood-red hover:bg-blood-red/30 text-blood-red px-4 py-2 rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" /> Delete All Teams
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-blood-red/10 border border-blood-red/30 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-blood-red" />
          <p className="text-blood-red text-sm">{error}</p>
        </div>
      )}

      <div className="bg-pirate-black/60 border border-ocean-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pirate-navy/50 border-b border-ocean-800/50 text-gold-500 text-sm">
                <th className="p-4">Crew Name</th>
                <th className="p-4 text-center">Progress</th>
                <th className="p-4">Finished At</th>
                <th className="p-4">Duration</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-ocean-600 italic">No crews found in the database.</td>
                </tr>
              ) : (
                teams.map((team) => (
                  <tr key={team.id} className="border-b border-ocean-900/30 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold text-parchment">{team.name}</td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-3 py-1 bg-ocean-900/50 rounded-full text-ocean-300 font-mono text-sm">
                        {team.progress} / 10
                      </span>
                    </td>
                    <td className="p-4 text-sm text-ocean-500">
                      {team.finished_at ? new Date(team.finished_at).toLocaleString() : "-"}
                    </td>
                    <td className="p-4 text-sm text-ocean-400 font-mono">
                      {team.finished_at && team.started_at ? (() => {
                        const ms = new Date(team.finished_at).getTime() - new Date(team.started_at).getTime();
                        const totalSecs = Math.floor(ms / 1000);
                        const h = Math.floor(totalSecs / 3600);
                        const m = Math.floor((totalSecs % 3600) / 60);
                        const s = totalSecs % 60;
                        const parts: string[] = [];
                        if (h > 0) parts.push(`${h}h`);
                        parts.push(`${m}m`);
                        parts.push(`${s}s`);
                        return parts.join(' ');
                      })() : <span className="text-ocean-700">—</span>}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleAction("reset_team", team.id)}
                        disabled={loading}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gold-900/20 text-gold-400 hover:bg-gold-600/30 transition-colors cursor-pointer disabled:opacity-50"
                        title="Reset Progress"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleAction("delete_team", team.id)}
                        disabled={loading}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blood-red/10 text-blood-red hover:bg-blood-red/30 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete Team"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
