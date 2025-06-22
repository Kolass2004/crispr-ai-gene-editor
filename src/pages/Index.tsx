import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dna, Zap, Shield, Target, Microscope, FlaskConical, Users, ChevronRight, Play, Atom, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchRecommendations } from '@/components/SearchRecommendations';

const Index = () => {
  const [geneInput, setGeneInput] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (geneInput.trim()) {
      navigate(`/analysis?gene=${encodeURIComponent(geneInput.trim())}`);
    }
  };

  const handleGeneSelect = (gene: string) => {
    setGeneInput(gene);
  };

  const features = [
    {
      icon: Target,
      title: 'Precision Targeting',
      description: 'Advanced algorithms identify optimal gRNA sequences with high specificity and minimal off-target effects.'
    },
    {
      icon: Zap,
      title: 'Rapid Analysis',
      description: 'Get comprehensive results in seconds with our optimized computational pipeline.'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Comprehensive off-target analysis ensures safer gene editing experiments.'
    },
    {
      icon: Microscope,
      title: 'Research Grade',
      description: 'Validated algorithms used by leading research institutions worldwide.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'DNA Recognition',
      description: 'Cas9 protein identifies and binds to the target DNA sequence guided by the gRNA',
      icon: Dna
    },
    {
      number: '02',
      title: 'PAM Identification',
      description: 'The system locates PAM sequences (NGG) adjacent to target sites for precise cutting',
      icon: Target
    },
    {
      number: '03',
      title: 'Double-Strand Break',
      description: 'Cas9 creates a precise double-strand break 3 base pairs upstream of the PAM site',
      icon: Zap
    },
    {
      number: '04',
      title: 'DNA Repair',
      description: 'Cellular repair mechanisms activate, allowing for gene insertion, deletion, or modification',
      icon: Beaker
    }
  ];

  const applications = [
    {
      icon: FlaskConical,
      title: 'Disease Research',
      description: 'Develop treatments for genetic disorders and cancer through precise gene editing',
      stats: '2,500+ studies'
    },
    {
      icon: Atom,
      title: 'Drug Discovery',
      description: 'Create cellular models to test new pharmaceuticals and therapeutic approaches',
      stats: '1,200+ compounds'
    },
    {
      icon: Users,
      title: 'Clinical Trials',
      description: 'Advance from laboratory research to human therapeutic applications',
      stats: '50+ trials'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
 {/* Hero Section */}
<section className="relative overflow-hidden py-20 md:py-32 lg:py-25">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-teal-600/10" />
  
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="text-center max-w-7xl mx-auto">
      
      {/* Floating DNA Helix Animation */}
      <div className="flex justify-center mb-16 md:mb-20">
        <div className="relative">
          {/* Animated rings */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-blue-500/20 rounded-full"></div>
          </div>
          <div className="absolute inset-2 animate-spin-reverse">
            <div className="w-28 h-28 md:w-36 md:h-36 border-2 border-purple-500/20 rounded-full"></div>
          </div>
          
          {/* Central DNA icon */}
          <div className="relative z-10 w-10 h-10 md:w-40 md:h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 rounded-full shadow-2xl flex items-center justify-center">
            <Dna className="h-6 w-6 md:h-6 md:w-20 text-white animate-pulse" />
          </div>
          
          {/* Floating particles */}
          <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-8 left-8 w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
      
      {/* Hero Typography */}
      <div className="space-y-8 mb-16 md:mb-20">
        <h1 className="text-3xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-none">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent block mb-4">
            CRISPR AI GENE EDITOR
          </span>
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-500 tracking-wide">
            Next-Generation gRNA Design
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl md:text-2xl text-gray-600 max-w-5xl mx-auto leading-relaxed font-light">
          Harness the power of artificial intelligence to design precision guide RNAs <br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium"> with unprecedented accuracy</span>
          <br />
          <span className=" font-medium">By Kolassrexon J</span>
        </p>
      </div>
      
      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-16 md:mb-20">
        {/* Quick Design Card */}
        <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Play className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 ">Quick Design</h3>
            <p className="text-gray-600 mb-4">Start designing gRNAs instantly with our AI-powered platform</p>
            <Button
              onClick={handleAnalyze}
              disabled={!geneInput.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
            >
              Get Started
            </Button>
          </div>
        </div>
        
        {/* Popular Genes Card */}
        <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Dna className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Targets</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {['BRCA1', 'TP53', 'CFTR', 'EGFR'].map((gene) => (
                <button
                  key={gene}
                  onClick={() => setGeneInput(gene)}
                  className="text-sm font-medium text-gray-700 hover:text-purple-600 bg-gray-50 hover:bg-purple-50 rounded-lg px-3 py-2 transition-colors"
                >
                  {gene}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Advanced Features Card */}
        <div className="group relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Analytics</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span>Off-target prediction</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Efficiency scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Safety assessment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gene Input Section */}
      <div className="max-w-2xl mx-auto mb-16">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Enter Your Target Gene</h3>
          <p className="text-gray-600">Start by entering a gene symbol or sequence</p>
        </div>
        
        <div className="relative">
          <SearchRecommendations
            open={searchOpen}
            onOpenChange={setSearchOpen}
            value={geneInput}
            onValueChange={setGeneInput}
            onSelect={handleGeneSelect}
            onAnalyze={handleAnalyze}
          />
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="py-12 md:py-20 lg:py-32 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <Badge className="mb-4 md:mb-6 px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0 text-sm md:text-base">
              Advanced Technology
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Precision Gene Editing Tools
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              State-of-the-art algorithms and comprehensive analysis for safer, more effective CRISPR experiments
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-white/50">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-3 md:p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4 group-hover:from-blue-200 group-hover:to-purple-200 transition-all">
                    <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How CRISPR Works Section */}
      <section className="py-12 md:py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <Badge className="mb-4 md:mb-6 px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-green-100 to-teal-100 text-green-800 border-0 text-sm md:text-base">
              Molecular Biology
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              How CRISPR-Cas9 Works
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding the molecular mechanism behind precise gene editing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <Card className="h-full bg-white/90 backdrop-blur-sm border-white/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto p-3 md:p-4 bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl mb-4 group-hover:from-green-200 group-hover:to-teal-200 transition-all">
                      <step.icon className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                    </div>
                    <Badge variant="outline" className="mb-2 text-xs md:text-sm">{step.number}</Badge>
                    <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Molecular Precision Section */}
      <section className="py-12 md:py-20 lg:py-32 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <Badge className="mb-4 md:mb-6 px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-0 text-sm md:text-base">
                Molecular Precision
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                Atomic-Level Accuracy
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed">
                Our platform leverages advanced computational biology to design gRNAs with unprecedented precision, 
                ensuring targeted gene editing with minimal off-target effects.
              </p>
              
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="p-2 bg-purple-100 rounded-lg mt-1">
                    <Target className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base md:text-lg">Single Base Precision</h4>
                    <p className="text-sm md:text-base text-gray-600">Target specific nucleotides with 99.9% accuracy</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="p-2 bg-purple-100 rounded-lg mt-1">
                    <Shield className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base md:text-lg">Safety Validation</h4>
                    <p className="text-sm md:text-base text-gray-600">Comprehensive off-target analysis across the genome</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="p-2 bg-purple-100 rounded-lg mt-1">
                    <Zap className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base md:text-lg">Rapid Processing</h4>
                    <p className="text-sm md:text-base text-gray-600">Results delivered in seconds, not hours</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              <div className="relative bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 md:p-12 h-64 md:h-80 lg:h-96 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl" />
                <div className="relative">
                  <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                    {['A', 'T', 'G', 'C', 'G', 'A', 'T', 'C', 'G'].map((base, index) => (
                      <div key={index} className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold text-purple-600 shadow-lg animate-pulse" style={{ animationDelay: `${index * 0.1}s` }}>
                        {base}
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <Atom className="h-8 w-8 md:h-12 md:w-12 text-purple-600 mx-auto animate-spin" style={{ animationDuration: '4s' }} />
                    <p className="text-xs md:text-sm text-purple-600 font-medium mt-2">Molecular Analysis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Applications Section */}
      <section className="py-12 md:py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <Badge className="mb-4 md:mb-6 px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-0 text-sm md:text-base">
              Real-World Impact
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
              Scientific Applications
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Advancing medical research and therapeutic development through precise gene editing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {applications.map((app, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-white/50">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-3 md:p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl mb-4 group-hover:from-amber-200 group-hover:to-orange-200 transition-all">
                    <app.icon className="h-6 w-6 md:h-8 md:w-8 text-amber-600" />
                  </div>
                  <CardTitle className="text-lg md:text-xl font-semibold text-gray-900">{app.title}</CardTitle>
                  <Badge variant="secondary" className="mt-2 text-xs md:text-sm">{app.stats}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">{app.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Dna className="h-6 w-6 md:h-8 md:w-8 text-blue-400" />
              <span className="text-lg md:text-xl font-bold">CRISPR Studio</span>
            </div>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
              Empowering researchers worldwide with cutting-edge gene editing tools and computational biology solutions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
