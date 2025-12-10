'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Settings, Loader2, Trash2, User, BarChart3 } from 'lucide-react';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function SettingsPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const generations = useQuery(api.generations.getByUser);
  const deleteGeneration = useMutation(api.generations.remove);

  const [defaultWeirdness, setDefaultWeirdness] = useState(50);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  // Load saved weirdness preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('defaultWeirdness');
    if (saved) {
      setDefaultWeirdness(parseInt(saved));
    }
  }, []);

  // Save weirdness preference to localStorage
  const handleWeirdnessChange = (value: number) => {
    setDefaultWeirdness(value);
    localStorage.setItem('defaultWeirdness', value.toString());
  };

  const getWeirdnessLabel = (value: number) => {
    if (value <= 20) return { label: 'Standard', color: 'text-blue-400' };
    if (value <= 40) return { label: 'Lifestyle', color: 'text-green-400' };
    if (value <= 60) return { label: 'Attention', color: 'text-yellow-400' };
    if (value <= 80) return { label: 'Shareable', color: 'text-orange-400' };
    return { label: 'Viral', color: 'text-pink-400' };
  };

  // Calculate usage stats
  const totalSessions = generations?.length || 0;
  const totalVariations = generations?.reduce((acc, gen) => acc + (gen.variations?.length || 0), 0) || 0;

  const handleDeleteAll = async () => {
    if (!generations || generations.length === 0) return;

    setIsDeleting(true);
    try {
      for (const gen of generations) {
        await deleteGeneration({ id: gen._id });
      }
    } catch (err) {
      console.error('Delete all error:', err);
    } finally {
      setIsDeleting(false);
      setConfirmDeleteAll(false);
    }
  };

  // Show loading while checking auth
  if (!isUserLoaded) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Sign in to access settings</h2>
          <SignInButton mode="modal">
            <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500">
              Sign in
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f0f0f]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img src="/logo.svg" alt="StaticKit" className="w-7 h-7" />
            <span className="text-lg">StaticKit</span>
          </Link>

          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-white/50 text-sm">Manage your preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="font-semibold">Account</h2>
                <p className="text-sm text-white/50">Your account information</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-white/60">Email</span>
                <span className="font-medium">{user.emailAddresses?.[0]?.emailAddress || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-white/60">Name</span>
                <span className="font-medium">{user.fullName || user.firstName || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Usage Stats Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="font-semibold">Usage Stats</h2>
                <p className="text-sm text-white/50">Your generation history</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-violet-400">{totalSessions}</p>
                <p className="text-sm text-white/50">Saved Sessions</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-indigo-400">{totalVariations}</p>
                <p className="text-sm text-white/50">Total Variations</p>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="font-semibold">Preferences</h2>
                <p className="text-sm text-white/50">Customize your experience</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80">Default Virality Level</span>
                  <span className={`text-sm font-medium ${getWeirdnessLabel(defaultWeirdness).color}`}>
                    {getWeirdnessLabel(defaultWeirdness).label}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={defaultWeirdness}
                  onChange={(e) => handleWeirdnessChange(parseInt(e.target.value))}
                  className="w-full weirdness-slider"
                />
                <p className="text-xs text-white/40 mt-1">
                  This will be the default setting for generating new variation prompts
                </p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h2 className="font-semibold text-red-400">Danger Zone</h2>
                <p className="text-sm text-white/50">Irreversible actions</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80">Delete All Saved Ads</p>
                  <p className="text-sm text-white/40">
                    Permanently delete all {totalSessions} saved sessions and {totalVariations} variations
                  </p>
                </div>
                {confirmDeleteAll ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDeleteAll(false)}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleDeleteAll}
                      disabled={isDeleting || totalSessions === 0}
                      className="bg-red-600 hover:bg-red-500"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Confirm Delete'
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirmDeleteAll(true)}
                    disabled={totalSessions === 0}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 disabled:opacity-50"
                  >
                    Delete All
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-white/40">
          <p>Powered by Google Gemini AI</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
