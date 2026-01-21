import { useState } from "react";
import RewardSlot from "@/components/RewardSlot";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [activeCase, setActiveCase] = useState<1 | 2 | null>(null);
  const [key, setKey] = useState(0);

  const handleCase1 = () => {
    setActiveCase(1);
    setKey((k) => k + 1);
  };

  const handleCase2 = () => {
    setActiveCase(2);
    setKey((k) => k + 1);
  };

  const cashbackDetails = {
    amount: 10,
    currency: "₹",
  };

  const rewardDetails = [
    {
      id: "sbi-card",
      badge: "₹200 cashback on all purchase",
      title: "5% cashback on online spends",
      subtitle: "SBI Card exclusive offer",
      buttonText: "Apply now",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Demo Controls */}
      <div className="max-w-md mx-auto mb-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reward Slot Demo
        </h1>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={handleCase1}
            variant={activeCase === 1 ? "default" : "outline"}
          >
            Case 1: Cashback Only
          </Button>
          <Button 
            onClick={handleCase2}
            variant={activeCase === 2 ? "default" : "outline"}
          >
            Case 2: Cashback + Rewards
          </Button>
        </div>
      </div>

      {/* Mock Payment Success Screen */}
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Payment Header */}
        <div className="bg-white p-6 text-center border-b">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹5,460</p>
          <p className="text-gray-600">Payment successful</p>
          <p className="text-gray-500 text-sm mt-2">BESCOM, Karnataka • 387647293882</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <button className="text-blue-600 text-sm font-medium">View details</button>
            <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Reward Slot */}
        <div className="p-4">
          {activeCase && (
            <RewardSlot
              key={key}
              cashback={cashbackDetails}
              rewards={activeCase === 2 ? rewardDetails : []}
              onComplete={() => console.log("Animation complete")}
            />
          )}
        </div>

        {/* Bill Reminders Section (Static) */}
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-gray-800 font-medium">Bill reminders</span>
              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
            </div>
            <button className="bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded-lg text-sm">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
