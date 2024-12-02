import React from 'react';
import { RationalAnalysis, ProcessBreakdown } from '@/types/chat';

interface AnalysisPanelProps {
  rational: RationalAnalysis;
  process: ProcessBreakdown;
}

export function AnalysisPanel({ rational, process }: AnalysisPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold">Rational Analysis</h3>
        <div className="pl-4 text-sm">
          <div>Consistency: {(rational.logicalFlow.consistency * 100).toFixed(0)}%</div>
          {rational.biases.cognitive.length > 0 && (
            <div>Potential Biases: {rational.biases.cognitive.join(', ')}</div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Process Breakdown</h3>
        <div className="pl-4 text-sm">
          <div>Primary Goal: {process.objectives.primary}</div>
          <div className="mt-1">
            Key Steps:
            {process.steps.slice(0, 3).map(step => (
              <div key={step.order} className="pl-2">
                {step.order}. {step.description}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}