'use client';

import { useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LinkAccountForm() {
    const [loading, setLoading] = useState(false);

    return (
        <div className="text-center py-6 md:py-8">
            <UserIcon className="h-10 w-10 md:h-12 md:w-12 text-zinc-700 mx-auto mb-3 md:mb-4" />
            <h2 className="text-base md:text-lg font-semibold text-white mb-2">Link Codeforces</h2>
            <p className="text-zinc-500 text-xs md:text-sm mb-4 md:mb-6 max-w-xs mx-auto">
                Connect your handle to see your stats.
            </p>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const handle = formData.get('handle');
                    setLoading(true);
                    try {
                        const res = await fetch('/api/cf/link', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ handle }),
                        });
                        if (res.ok) window.location.reload();
                        else { const data = await res.json(); toast.error('Error: ' + data.error); }
                    } catch { toast.error('Failed to link account'); }
                    finally { setLoading(false); }
                }}
                className="flex gap-2 justify-center"
            >
                <label htmlFor="cf-handle" className="sr-only">Codeforces Handle</label>
                <input
                    id="cf-handle"
                    type="text"
                    name="handle"
                    placeholder="CF Handle"
                    className="px-3 md:px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder-zinc-600 focus:outline-none w-32 md:w-40 touch-target"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 md:px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium disabled:opacity-50 transition-colors touch-target flex items-center"
                >
                    {loading ? '...' : 'Link'}
                </button>
            </form>
        </div>
    );
}
