import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";

const SimulationControls = ({ isPlaying, onPlayPause, onReset, onStep }) => {
  return (
    <Card className="p-4 flex gap-4 items-center justify-center">
      <Button onClick={onPlayPause} variant="outline">
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <Button onClick={onStep} variant="outline" disabled={isPlaying}>
        Step
      </Button>
      <Button onClick={onReset} variant="outline">
        <RotateCcw className="h-4 w-4" />
      </Button>
    </Card>
  );
};

export default SimulationControls;
