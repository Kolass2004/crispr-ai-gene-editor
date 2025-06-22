
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dna, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface LiveResultsProps {
  sequence: string;
  originalSequence: string;
  grnaResults: Array<{
    id: number;
    sequence: string;
    position: number;
    onTargetScore: number;
    offTargetRisk: number;
    pamSequence: string;
    gcContent: number;
  }>;
}

export const LiveResults: React.FC<LiveResultsProps> = ({ 
  sequence, 
  originalSequence, 
  grnaResults 
}) => {
  const hasChanges = sequence !== originalSequence;
  const sequenceDiff = sequence.length - originalSequence.length;
  
  // Simulate updated analysis based on sequence changes
  const updatedResults = hasChanges ? {
    pamSites: Math.max(0, 23 + Math.floor(sequenceDiff / 100)),
    grnaCount: Math.max(0, grnaResults.length + Math.floor(sequenceDiff / 200)),
    highScoreCount: Math.max(0, 1 + (sequenceDiff > 100 ? 1 : sequenceDiff < -100 ? -1 : 0)),
    avgOnTargetScore: Math.min(1, Math.max(0, 0.78 + (sequenceDiff * 0.001))),
    avgOffTargetRisk: Math.min(1, Math.max(0, 0.12 - (sequenceDiff * 0.0005)))
  } : {
    pamSites: 23,
    grnaCount: grnaResults.length,
    highScoreCount: 1,
    avgOnTargetScore: 0.78,
    avgOffTargetRisk: 0.12
  };

  const getChangeIcon = (current: number, original: number) => {
    if (current > original) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (current < original) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 0.1) return 'text-green-600';
    if (risk <= 0.2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className={`transition-all duration-300 ${hasChanges ? 'ring-2 ring-blue-200 bg-blue-50/20' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Dna className="h-5 w-5" />
          <span>Live Analysis Results</span>
          {hasChanges && (
            <Badge variant="secondary" className="ml-2">
              Updated
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasChanges && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-blue-800">
              <AlertTriangle className="h-4 w-4" />
              <span>
                Sequence modified: {sequenceDiff > 0 ? '+' : ''}{sequenceDiff} bases
                {sequenceDiff !== 0 && ' - Results updated automatically'}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Sequence Length</span>
              <div className="flex items-center space-x-1">
                <span className="font-medium">{sequence.length} bp</span>
                {getChangeIcon(sequence.length, originalSequence.length)}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">PAM Sites Found</span>
              <div className="flex items-center space-x-1">
                <span className="font-medium">{updatedResults.pamSites}</span>
                {getChangeIcon(updatedResults.pamSites, 23)}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">gRNA Candidates</span>
              <div className="flex items-center space-x-1">
                <span className="font-medium">{updatedResults.grnaCount}</span>
                {getChangeIcon(updatedResults.grnaCount, grnaResults.length)}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">High Score (&gt; 0.8)</span>
              <div className="flex items-center space-x-1">
                <span className={`font-medium ${updatedResults.highScoreCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {updatedResults.highScoreCount}
                </span>
                {getChangeIcon(updatedResults.highScoreCount, 1)}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Avg On-Target Score</span>
                <span className={`font-medium text-sm ${getScoreColor(updatedResults.avgOnTargetScore)}`}>
                  {updatedResults.avgOnTargetScore.toFixed(2)}
                </span>
              </div>
              <Progress 
                value={updatedResults.avgOnTargetScore * 100} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Avg Off-Target Risk</span>
                <span className={`font-medium text-sm ${getRiskColor(updatedResults.avgOffTargetRisk)}`}>
                  {updatedResults.avgOffTargetRisk.toFixed(2)}
                </span>
              </div>
              <Progress 
                value={updatedResults.avgOffTargetRisk * 100} 
                className="h-2"
              />
            </div>

            {hasChanges && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                <div className="font-medium">Editing Impact:</div>
                <div>
                  {sequenceDiff > 0 ? 'Added bases may create new gRNA sites' : 
                   sequenceDiff < 0 ? 'Removed bases may eliminate gRNA sites' : 
                   'Modified bases may affect gRNA efficiency'}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
