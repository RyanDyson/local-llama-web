
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { GenerationSettings } from '@/types';
import { Settings } from 'lucide-react';

interface SettingsDialogProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: GenerationSettings) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  settings,
  onSettingsChange,
}) => {
  const [localSettings, setLocalSettings] = React.useState<GenerationSettings>(settings);

  const handleSliderChange = (key: keyof GenerationSettings, value: number[]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value[0] }));
  };

  const handleNumberInputChange = (key: keyof GenerationSettings, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setLocalSettings(prev => ({ ...prev, [key]: numValue }));
    }
  };

  const handleStopSequencesChange = (value: string) => {
    const sequences = value.split(',').map(s => s.trim()).filter(Boolean);
    setLocalSettings(prev => ({ ...prev, stop: sequences }));
  };

  const handleApply = () => {
    onSettingsChange(localSettings);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generation Settings</DialogTitle>
          <DialogDescription>
            Adjust the parameters used for text generation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperature: {localSettings.temperature.toFixed(2)}</Label>
              <Input
                id="temperature-value"
                type="number"
                step="0.01"
                min="0"
                max="2"
                value={localSettings.temperature}
                onChange={(e) => handleNumberInputChange('temperature', e.target.value)}
                className="w-16 h-8 ml-2"
              />
            </div>
            <Slider
              id="temperature"
              min={0}
              max={2}
              step={0.01}
              value={[localSettings.temperature]}
              onValueChange={(value) => handleSliderChange('temperature', value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="top_p">Top P: {localSettings.top_p.toFixed(2)}</Label>
              <Input
                id="top_p-value"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={localSettings.top_p}
                onChange={(e) => handleNumberInputChange('top_p', e.target.value)}
                className="w-16 h-8 ml-2"
              />
            </div>
            <Slider
              id="top_p"
              min={0}
              max={1}
              step={0.01}
              value={[localSettings.top_p]}
              onValueChange={(value) => handleSliderChange('top_p', value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="max_tokens">Max Tokens: {localSettings.max_tokens}</Label>
              <Input
                id="max_tokens-value"
                type="number"
                min="1"
                max="4096"
                value={localSettings.max_tokens}
                onChange={(e) => handleNumberInputChange('max_tokens', e.target.value)}
                className="w-16 h-8 ml-2"
              />
            </div>
            <Slider
              id="max_tokens"
              min={1}
              max={4096}
              step={1}
              value={[localSettings.max_tokens]}
              onValueChange={(value) => handleSliderChange('max_tokens', value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stop-sequences">Stop Sequences (comma separated)</Label>
            <Input
              id="stop-sequences"
              value={localSettings.stop.join(', ')}
              onChange={(e) => handleStopSequencesChange(e.target.value)}
              placeholder="Enter stop sequences separated by commas"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleApply}>Apply Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
