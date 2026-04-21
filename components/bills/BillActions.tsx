"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, RotateCcw, Loader2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { reverseBillAction, payBillAction } from "@/lib/actions/bill";

type Props = {
  billId: string;
  isUdhari: boolean;
};

export default function BillActions({ billId, isUdhari }: Props) {
  const router = useRouter();
  const [showReverse, setShowReverse] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleReverse() {
    startTransition(async () => {
      await reverseBillAction(billId);
      setShowReverse(false);
      router.refresh();
    });
  }

  function handlePay() {
    startTransition(async () => {
      await payBillAction(billId);
      setShowPay(false);
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex gap-3">
        {isUdhari && (
          <button
            onClick={() => setShowPay(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-colors"
          >
            <CheckCircle size={15} />
            Mark as paid
          </button>
        )}
        <button
          onClick={() => setShowReverse(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <RotateCcw size={15} />
          Reverse bill
        </button>
      </div>

      {/* Pay confirm */}
      <Modal open={showPay} onClose={() => setShowPay(false)} title="Mark as paid?">
        <p className="text-sm text-gray-500 mb-5">
          This will clear the udhari balance for this bill. The customer&apos;s credit will be
          marked as settled.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handlePay}
            disabled={pending}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {pending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
            Confirm
          </button>
          <button
            onClick={() => setShowPay(false)}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Reverse confirm */}
      <Modal open={showReverse} onClose={() => setShowReverse(false)} title="Reverse this bill?">
        <p className="text-sm text-gray-500 mb-5">
          This will cancel the bill and restore the inventory quantities. This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleReverse}
            disabled={pending}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {pending ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
            Yes, reverse
          </button>
          <button
            onClick={() => setShowReverse(false)}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}
