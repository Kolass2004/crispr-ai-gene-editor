
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, Undo, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EditableBase {
  id: string;
  base: string;
  position: number;
  isEdited: boolean;
}

interface LiveGeneEditorProps {
  initialSequence?: string;
  onSequenceChange: (sequence: string) => void;
}

export const LiveGeneEditor: React.FC<LiveGeneEditorProps> = ({
  initialSequence = 'ATGCGATCGATCGATCGATCGATCTGGATGCATGCATGCATGCATGCAGGCGTACGTACGTACGTACGTACGG',
  onSequenceChange
}) => {
  const [sequence, setSequence] = useState(initialSequence);
  const [editableSequence, setEditableSequence] = useState<EditableBase[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editHistory, setEditHistory] = useState<string[]>([]);
  const [showInsertDialog, setShowInsertDialog] = useState(false);
  const [insertPosition, setInsertPosition] = useState(0);
  const [insertSequence, setInsertSequence] = useState('');

  useEffect(() => {
    const bases = sequence.split('').map((base, index) => ({
      id: `base-${index}`,
      base,
      position: index,
      isEdited: false
    }));
    setEditableSequence(bases);
  }, [sequence]);

  const handleBaseEdit = (id: string, newBase: string) => {
    if (!['A', 'T', 'G', 'C'].includes(newBase.toUpperCase())) return;
    
    setEditHistory(prev => [...prev, sequence]);
    
    setEditableSequence(prev =>
      prev.map(base =>
        base.id === id
          ? { ...base, base: newBase.toUpperCase(), isEdited: true }
          : base
      )
    );
    
    const newSequence = editableSequence.map(base =>
      base.id === id ? newBase.toUpperCase() : base.base
    ).join('');
    
    setSequence(newSequence);
    onSequenceChange(newSequence);
  };

  const handleDeleteBase = (id: string) => {
    setEditHistory(prev => [...prev, sequence]);
    
    const newEditableSequence = editableSequence.filter(base => base.id !== id);
    setEditableSequence(newEditableSequence);
    
    const newSequence = newEditableSequence.map(base => base.base).join('');
    setSequence(newSequence);
    onSequenceChange(newSequence);
  };

  const handleInsertSequence = () => {
    if (!insertSequence || insertPosition < 0) return;
    
    setEditHistory(prev => [...prev, sequence]);
    
    const validBases = insertSequence.toUpperCase().split('').filter(base => 
      ['A', 'T', 'G', 'C'].includes(base)
    );
    
    const newSequence = 
      sequence.slice(0, insertPosition) + 
      validBases.join('') + 
      sequence.slice(insertPosition);
    
    setSequence(newSequence);
    onSequenceChange(newSequence);
    setShowInsertDialog(false);
    setInsertSequence('');
  };

  const handleUndo = () => {
    if (editHistory.length === 0) return;
    
    const previousSequence = editHistory[editHistory.length - 1];
    setSequence(previousSequence);
    onSequenceChange(previousSequence);
    setEditHistory(prev => prev.slice(0, -1));
  };

  const getBaseColor = (base: string, isEdited: boolean) => {
    const colors = {
      'A': isEdited ? 'bg-red-200 text-red-800' : 'bg-red-100 text-red-700',
      'T': isEdited ? 'bg-yellow-200 text-yellow-800' : 'bg-yellow-100 text-yellow-700',
      'G': isEdited ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-700',
      'C': isEdited ? 'bg-blue-200 text-blue-800' : 'bg-blue-100 text-blue-700'
    };
    return colors[base as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Live Gene Editor</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Save className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
              {isEditing ? 'Save' : 'Edit'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={editHistory.length === 0}
            >
              <Undo className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInsertDialog(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Insert
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Sequence Length: {sequence.length} bp | Edits: {editableSequence.filter(b => b.isEdited).length}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-auto">
            <div className="flex flex-wrap gap-1 font-mono text-sm">
              {editableSequence.map((base, index) => (
                <div key={base.id} className="flex flex-col items-center group relative">
                  <div className="text-xs text-gray-400 mb-1">{index + 1}</div>
                  {isEditing ? (
                    <div className="relative">
                      <Input
                        value={base.base}
                        onChange={(e) => handleBaseEdit(base.id, e.target.value)}
                        className={`w-8 h-8 text-center p-0 text-xs font-bold border-2 flex items-center justify-center ${getBaseColor(base.base, base.isEdited)}`}
                        maxLength={1}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -top-2 -right-2 w-4 h-4 p-0 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleDeleteBase(base.id)}
                      >
                        <Trash2 className="h-2 w-2" />
                      </Button>
                    </div>
                  ) : (
                    <Badge
                      variant="outline"
                      className={`w-8 h-8 flex items-center justify-center p-0 text-xs font-bold ${getBaseColor(base.base, base.isEdited)}`}
                    >
                      {base.base}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-100 border rounded"></div>
              <span>Adenine (A)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-100 border rounded"></div>
              <span>Thymine (T)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-100 border rounded"></div>
              <span>Guanine (G)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-100 border rounded"></div>
              <span>Cytosine (C)</span>
            </div>
          </div>
        </div>
      </CardContent>

      <Dialog open={showInsertDialog} onOpenChange={setShowInsertDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert DNA Sequence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Position</label>
              <Input
                type="number"
                value={insertPosition}
                onChange={(e) => setInsertPosition(parseInt(e.target.value) || 0)}
                min={0}
                max={sequence.length}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sequence (A, T, G, C only)</label>
              <Input
                value={insertSequence}
                onChange={(e) => setInsertSequence(e.target.value)}
                placeholder="ATGC..."
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowInsertDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleInsertSequence}>
                Insert
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
