"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { useReward } from "react-rewards";

const CONFETTI_LIFETIME = 200;
const CONFETTI_SIZE = 25;
const CONFETTI_START_VELOCITY = 25;
const CONFETTI_DECAY = 0.985;
const CONFETTI_SPREAD = 90;
const CONFETTI_AMOUNT = 150;

export default function ConfettiPage() {
  const { reward: rewardLeft } = useReward("rewardIdLeft", "confetti", {
    angle: 45,
    lifetime: CONFETTI_LIFETIME,
    elementSize: CONFETTI_SIZE,
    startVelocity: CONFETTI_START_VELOCITY,
    spread: CONFETTI_SPREAD,
    elementCount: CONFETTI_AMOUNT,
    decay: CONFETTI_DECAY
  });

  const { reward: rewardRight } = useReward("rewardIdRight", "confetti", {
    angle: 135,
    lifetime: CONFETTI_LIFETIME,
    elementSize: CONFETTI_SIZE,
    startVelocity: CONFETTI_START_VELOCITY,
    spread: CONFETTI_SPREAD,
    elementCount: CONFETTI_AMOUNT,
    decay: CONFETTI_DECAY
  });

  const launchConfetti = () => {
    rewardLeft();
    rewardRight();
  };

  useEffect(() => {
    if (typeof overlay !== "undefined") {
      overlay.onConfetti(launchConfetti);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {false && <Button onClick={launchConfetti}>🎉</Button>}
      <div className="w-full fixed bottom-0 flex justify-between">
        <span id="rewardIdLeft" />
        <span id="rewardIdRight" />
      </div>
    </>
  );
}
