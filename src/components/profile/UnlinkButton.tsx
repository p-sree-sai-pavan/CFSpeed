'use client';

import { useState } from 'react';
import { Unlink } from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';
import toast from 'react-hot-toast';

export default function UnlinkButton() {
    const [showUnlinkModal, setShowUnlinkModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowUnlinkModal(true)}
                className="inline-flex items-center gap-1 text-[10px] md:text-xs text-zinc-600 hover:text-red-400 transition-colors p-3 -m-3 touch-target flex justify-center"
            >
                <Unlink className="h-3 w-3" />
                Unlink
            </button>

            <ConfirmModal
                isOpen={showUnlinkModal}
                title="Unlink Account"
                message="Are you sure you want to unlink your Codeforces account? Your synced data will be removed."
                confirmText="Unlink"
                variant="danger"
                onCancel={() => setShowUnlinkModal(false)}
                onConfirm={async () => {
                    try {
                        const res = await fetch('/api/cf/unlink', { method: 'DELETE' });
                        if (res.ok) {
                            setShowUnlinkModal(false);
                            window.location.reload();
                        } else {
                            toast.error('Failed to unlink account');
                            setShowUnlinkModal(false);
                        }
                    } catch {
                        toast.error('Failed to unlink account');
                        setShowUnlinkModal(false);
                    }
                }}
            />
        </>
    );
}
