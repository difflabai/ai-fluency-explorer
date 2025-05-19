
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from "@/components/ui/switch";
import type { TestDataConfig } from '@/utils/testData';

interface TestDataFormProps {
  config: TestDataConfig;
  setConfig: React.Dispatch<React.SetStateAction<TestDataConfig>>;
  showConfigAdvanced: boolean;
  setShowConfigAdvanced: React.Dispatch<React.SetStateAction<boolean>>;
}

const TestDataForm: React.FC<TestDataFormProps> = ({
  config,
  setConfig,
  showConfigAdvanced,
  setShowConfigAdvanced
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="count">Number of Test Results</Label>
          <div className="flex items-center gap-4">
            <Slider 
              id="count"
              min={1} 
              max={100} 
              step={1}
              value={[config.count]}
              onValueChange={(values) => setConfig({...config, count: values[0]})}
              className="flex-1"
            />
            <Input
              type="number"
              min={1}
              max={100}
              className="w-16"
              value={config.count}
              onChange={(e) => setConfig({...config, count: parseInt(e.target.value) || 1})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="distribution">Score Distribution</Label>
          <Select
            value={config.scoreDistribution}
            onValueChange={(value: 'random' | 'fixed' | 'gaussian') => 
              setConfig({...config, scoreDistribution: value})
            }
          >
            <SelectTrigger id="distribution">
              <SelectValue placeholder="Distribution" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="random">Random</SelectItem>
                <SelectItem value="fixed">Fixed Range</SelectItem>
                <SelectItem value="gaussian">Bell Curve</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="username-pattern">Username Pattern</Label>
        <Input
          id="username-pattern"
          value={config.usernamePattern}
          onChange={(e) => setConfig({...config, usernamePattern: e.target.value})}
          placeholder="TestUser_"
        />
        <p className="text-xs text-muted-foreground">
          Test usernames will be this pattern followed by a number
        </p>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="advanced-config"
          checked={showConfigAdvanced}
          onCheckedChange={setShowConfigAdvanced}
        />
        <Label htmlFor="advanced-config">Show advanced configuration</Label>
      </div>

      {showConfigAdvanced && (
        <div className="pt-2 space-y-4 border-t">
          <div className="space-y-2">
            <Label>Score Range</Label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-12">Min:</span>
              <Slider 
                min={0} 
                max={100} 
                step={1}
                value={[config.minScore]}
                onValueChange={(values) => setConfig({...config, minScore: values[0]})}
                className="flex-1"
              />
              <Input
                type="number"
                min={0}
                max={100}
                className="w-16"
                value={config.minScore}
                onChange={(e) => setConfig({...config, minScore: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-12">Max:</span>
              <Slider 
                min={0} 
                max={100} 
                step={1}
                value={[config.maxScore]}
                onValueChange={(values) => setConfig({...config, maxScore: values[0]})}
                className="flex-1"
              />
              <Input
                type="number"
                min={0}
                max={100}
                className="w-16"
                value={config.maxScore}
                onChange={(e) => setConfig({...config, maxScore: parseInt(e.target.value) || 100})}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDataForm;
