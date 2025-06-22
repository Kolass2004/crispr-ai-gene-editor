import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Dna, Download, Filter, SortAsc, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Gene3DViewer } from '@/components/Gene3DViewer';
import { LiveGeneEditor } from '@/components/LiveGeneEditor';
import { LiveResults } from '@/components/LiveResults';

interface GRNACandidate {
  id: number;
  sequence: string;
  position: number;
  onTargetScore: number;
  offTargetRisk: number;
  pamSequence: string;
  gcContent: number;
  offTargetSites: Array<{
    sequence: string;
    position: number;
    cfdScore: number;
    mismatches: number;
  }>;
}

const Analysis = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const gene = searchParams.get('gene') || '';
  
  const [analysisStage, setAnalysisStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedGRNA, setSelectedGRNA] = useState<GRNACandidate | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'risk'>('score');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  const stages = [
    'Fetching gene sequence from NCBI',
    'Identifying PAM sites',
    'Designing guide RNAs',
    'Calculating on-target scores',
    'Analyzing off-target effects',
    'Ranking candidates'
  ];

  // Mock gRNA results
  const grnaResults: GRNACandidate[] = [
    {
      id: 1,
      sequence: 'GATCGATCGATCGATCGATC',
      position: 1250,
      onTargetScore: 0.85,
      offTargetRisk: 0.12,
      pamSequence: 'TGG',
      gcContent: 55,
      offTargetSites: [
        { sequence: 'GATCGATCGATCGATCGAAC', position: 5420, cfdScore: 0.08, mismatches: 1 },
        { sequence: 'GATCGATCGATCGCTCGATC', position: 12450, cfdScore: 0.04, mismatches: 2 }
      ]
    },
    {
      id: 2,
      sequence: 'ATGCATGCATGCATGCATGC',
      position: 2100,
      onTargetScore: 0.78,
      offTargetRisk: 0.08,
      pamSequence: 'AGG',
      gcContent: 50,
      offTargetSites: [
        { sequence: 'ATGCATGCATGCATGCAAGC', position: 8920, cfdScore: 0.06, mismatches: 1 }
      ]
    },
    {
      id: 3,
      sequence: 'CGTACGTACGTACGTACGTA',
      position: 3450,
      onTargetScore: 0.72,
      offTargetRisk: 0.15,
      pamSequence: 'CGG',
      gcContent: 60,
      offTargetSites: [
        { sequence: 'CGTACGTACGTACGTACGAA', position: 6780, cfdScore: 0.12, mismatches: 1 },
        { sequence: 'CGTACGTACGTACGTCCGTA', position: 15420, cfdScore: 0.03, mismatches: 2 }
      ]
    }
  ];

  const initialSequence = 'ATGCGATCGATCGATCGATCGATCTGGATGCATGCATGCATGCATGCAGGCGTACGTACGTACGTACGTACGG';
  const [originalSequence] = useState(initialSequence);
  const [currentSequence, setCurrentSequence] = useState(initialSequence);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnalysisStage(prev => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          setIsComplete(true);
          clearInterval(timer);
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

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

  const sortedResults = [...grnaResults].sort((a, b) => {
    if (sortBy === 'score') return b.onTargetScore - a.onTargetScore;
    return a.offTargetRisk - b.offTargetRisk;
  });

  if (!isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <header className="border-b bg-white/90 backdrop-blur-sm shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 self-start sm:self-auto hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Dna className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Analyzing {gene}
                  </h1>
                  <p className="text-sm text-gray-600">CRISPR gRNA Design</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl text-blue-900">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
                <span>Processing Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <Progress value={(analysisStage + 1) / stages.length * 100} className="h-3" />
              
              <div className="space-y-4">
                {stages.map((stage, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    {index < analysisStage ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : index === analysisStage ? (
                      <div className="animate-pulse-slow h-5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0" />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-gray-200 flex-shrink-0" />
                    )}
                    <span className={`text-sm sm:text-base ${index <= analysisStage ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                      {stage}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <header className="border-b bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 self-start sm:self-auto hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Dna className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {gene} Analysis
                  </h1>
                  <p className="text-sm text-gray-600">{grnaResults.length} gRNA candidates found</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
              <div className="flex border rounded-lg overflow-hidden w-full sm:w-auto shadow-sm">
                <Button
                  variant={viewMode === '2d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('2d')}
                  className={`rounded-none flex-1 sm:flex-none ${viewMode === '2d' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' : 'hover:bg-blue-50'}`}
                >
                  2D View
                </Button>
                <Button
                  variant={viewMode === '3d' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('3d')}
                  className={`rounded-none flex-1 sm:flex-none ${viewMode === '3d' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' : 'hover:bg-blue-50'}`}
                >
                  3D View
                </Button>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none border-blue-200 hover:bg-blue-50 hover:border-blue-300">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content - Sequence Viewer and Live Editor */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <CardTitle className="text-lg sm:text-xl text-blue-900">
                  {viewMode === '2d' ? 'Sequence Overview' : '3D Gene Structure'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {viewMode === '2d' ? (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl border border-blue-200">
                    <div className="dna-sequence sequence-viewer text-xs sm:text-sm break-all">
                      <span>ATGCGATCGATC</span>
                      <span className="grna-highlight">GATCGATCGATCGATCGATC</span>
                      <span className="pam-highlight">TGG</span>
                      <span>ATGCATGCATGC...ATGCATGC</span>
                      <span className="grna-highlight">ATGCATGCATGCATGCATGC</span>
                      <span className="pam-highlight">AGG</span>
                      <span>CGTACGTACGTA...</span>
                    </div>
                    <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex-shrink-0"></div>
                        <span className="text-blue-800">gRNA sequence</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded flex-shrink-0"></div>
                        <span className="text-blue-800">PAM site</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Gene3DViewer gene={gene} grnaResults={grnaResults} />
                )}
              </CardContent>
            </Card>

            {/* Live Gene Editor */}
            <LiveGeneEditor
              onSequenceChange={(newSequence) => {
                console.log('Sequence updated:', newSequence);
                setCurrentSequence(newSequence);
              }}
            />
          </div>

          {/* Sidebar - Analysis Summary and Live Results */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <CardTitle className="text-lg sm:text-xl text-blue-900">Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50/50">
                  <span className="text-sm text-blue-700 font-medium">Sequence Length</span>
                  <span className="font-bold text-blue-900">2,847 bp</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50/50">
                  <span className="text-sm text-blue-700 font-medium">PAM Sites Found</span>
                  <span className="font-bold text-blue-900">23</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50/50">
                  <span className="text-sm text-blue-700 font-medium">gRNA Candidates</span>
                  <span className="font-bold text-blue-900">{grnaResults.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
                  <span className="text-sm text-green-700 font-medium">High Score (&gt; 0.8)</span>
                  <span className="font-bold text-green-600">1</span>
                </div>
              </CardContent>
            </Card>

            {/* Live Results */}
            <LiveResults 
              sequence={currentSequence}
              originalSequence={originalSequence}
              grnaResults={grnaResults}
            />
          </div>
        </div>

        {/* Results Table */}
        <Card className="mt-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
              <CardTitle className="text-lg sm:text-xl text-blue-900">gRNA Candidates</CardTitle>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
                <span className="text-sm text-blue-700 font-medium">Sort by:</span>
                <div className="flex space-x-2 w-full sm:w-auto">
                  <Button
                    variant={sortBy === 'score' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('score')}
                    className={`flex-1 sm:flex-none ${sortBy === 'score' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'border-blue-200 hover:bg-blue-50'}`}
                  >
                    <SortAsc className="h-4 w-4 mr-1" />
                    Score
                  </Button>
                  <Button
                    variant={sortBy === 'risk' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('risk')}
                    className={`flex-1 sm:flex-none ${sortBy === 'risk' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'border-blue-200 hover:bg-blue-50'}`}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Risk
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-blue-100">
                    <TableHead className="min-w-[80px] text-blue-800 font-semibold">Rank</TableHead>
                    <TableHead className="min-w-[200px] text-blue-800 font-semibold">gRNA Sequence</TableHead>
                    <TableHead className="min-w-[100px] text-blue-800 font-semibold">Position</TableHead>
                    <TableHead className="min-w-[150px] text-blue-800 font-semibold">On-Target Score</TableHead>
                    <TableHead className="min-w-[120px] text-blue-800 font-semibold">Off-Target Risk</TableHead>
                    <TableHead className="min-w-[100px] text-blue-800 font-semibold">GC Content</TableHead>
                    <TableHead className="min-w-[100px] text-blue-800 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedResults.map((grna, index) => (
                    <TableRow key={grna.id} className="hover:bg-blue-50/50 transition-colors border-blue-50">
                      <TableCell>
                        <Badge variant={index === 0 ? 'default' : 'secondary'} className={index === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-700' : ''}>
                          #{index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="dna-sequence bg-blue-50 px-2 py-1 rounded text-xs sm:text-sm break-all border border-blue-200">
                          {grna.sequence}
                        </code>
                      </TableCell>
                      <TableCell className="text-blue-900">{grna.position}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="score-bar w-12 sm:w-16 relative bg-blue-100 rounded-full">
                            <div 
                              className="score-indicator bg-gradient-to-r from-green-500 to-green-600 rounded-full" 
                              style={{ width: `${grna.onTargetScore * 100}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${getScoreColor(grna.onTargetScore)}`}>
                            {grna.onTargetScore.toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${getRiskColor(grna.offTargetRisk)}`}>
                          {grna.offTargetRisk.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-blue-900 font-medium">{grna.gcContent}%</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedGRNA(grna)}
                          className="w-full sm:w-auto border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* gRNA Details Modal */}
      <Dialog open={!!selectedGRNA} onOpenChange={() => setSelectedGRNA(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm">
          <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 -m-6 mb-6 p-6 rounded-t-lg">
            <DialogTitle className="text-blue-900">gRNA Detailed Analysis</DialogTitle>
          </DialogHeader>
          {selectedGRNA && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-blue-700">Sequence</label>
                  <code className="block dna-sequence bg-blue-50 p-3 rounded-lg mt-1 text-xs sm:text-sm break-all border border-blue-200">
                    {selectedGRNA.sequence}
                  </code>
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-700">PAM</label>
                  <code className="block dna-sequence bg-blue-50 p-3 rounded-lg mt-1 text-xs sm:text-sm border border-blue-200">
                    {selectedGRNA.pamSequence}
                  </code>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <label className="text-sm font-medium text-green-700">On-Target Score</label>
                  <div className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                    {selectedGRNA.onTargetScore.toFixed(2)}
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <label className="text-sm font-medium text-amber-700">Off-Target Risk</label>
                  <div className="text-xl sm:text-2xl font-bold text-amber-600 mt-1">
                    {selectedGRNA.offTargetRisk.toFixed(2)}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <label className="text-sm font-medium text-blue-700">GC Content</label>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                    {selectedGRNA.gcContent}%
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-blue-900 mb-3">Potential Off-Target Sites</h4>
                <div className="space-y-2">
                  {selectedGRNA.offTargetSites.map((site, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <code className="dna-sequence text-xs sm:text-sm break-all">{site.sequence}</code>
                        <div className="text-xs text-blue-600 mt-1">
                          Position: {site.position} | Mismatches: {site.mismatches}
                        </div>
                      </div>
                      <Badge variant={site.cfdScore < 0.1 ? 'default' : 'destructive'} className={`ml-0 sm:ml-2 ${site.cfdScore < 0.1 ? 'bg-gradient-to-r from-green-500 to-green-600' : ''}`}>
                        CFD: {site.cfdScore.toFixed(2)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Analysis;
