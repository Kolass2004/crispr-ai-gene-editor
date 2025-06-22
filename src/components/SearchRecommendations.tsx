
import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dna, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchRecommendationsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onValueChange: (value: string) => void;
  onSelect: (value: string) => void;
  onAnalyze: () => void;
}

const popularGenes = [
  { symbol: 'BRCA1', description: 'Breast cancer susceptibility gene 1' },
  { symbol: 'TP53', description: 'Tumor protein p53' },
  { symbol: 'CFTR', description: 'Cystic fibrosis transmembrane conductance regulator' },
  { symbol: 'EGFR', description: 'Epidermal growth factor receptor' },
  { symbol: 'APOE', description: 'Apolipoprotein E' },
  { symbol: 'BRCA2', description: 'Breast cancer susceptibility gene 2' },
  { symbol: 'MTHFR', description: 'Methylenetetrahydrofolate reductase' },
  { symbol: 'KRAS', description: 'Kirsten rat sarcoma viral oncogene' },
  { symbol: 'PIK3CA', description: 'Phosphatidylinositol-4,5-bisphosphate 3-kinase' },
  { symbol: 'APC', description: 'Adenomatous polyposis coli' }
];

export const SearchRecommendations: React.FC<SearchRecommendationsProps> = ({
  open,
  onOpenChange,
  value,
  onValueChange,
  onSelect,
  onAnalyze
}) => {
  const filteredGenes = popularGenes.filter(gene =>
    gene.symbol.toLowerCase().includes(value.toLowerCase()) ||
    gene.description.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div className="relative flex-1">
          <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-gray-400" />
          <input
            placeholder="Enter gene symbol (e.g., BRCA1, TP53, CFTR)"
            value={value}
            onChange={(e) => {
              onValueChange(e.target.value);
              onOpenChange(true);
            }}
            onKeyPress={(e) => e.key === 'Enter' && onAnalyze()}
            onFocus={() => onOpenChange(true)}
            className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 text-base md:text-lg border-0 bg-gray-50/80 focus:bg-white rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandList>
            {value && (
              <CommandEmpty>
                <div className="flex items-center space-x-2 p-2">
                  <Dna className="h-4 w-4 text-gray-400" />
                  <span>No genes found matching "{value}"</span>
                </div>
              </CommandEmpty>
            )}
            {filteredGenes.length > 0 && (
              <CommandGroup heading="Popular Genes">
                {filteredGenes.slice(0, 6).map((gene) => (
                  <CommandItem
                    key={gene.symbol}
                    value={gene.symbol}
                    onSelect={() => {
                      onSelect(gene.symbol);
                      onOpenChange(false);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <Dna className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{gene.symbol}</div>
                        <div className="text-xs text-gray-500 truncate">{gene.description}</div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {!value && (
              <CommandGroup heading="Popular Genes">
                {popularGenes.slice(0, 6).map((gene) => (
                  <CommandItem
                    key={gene.symbol}
                    value={gene.symbol}
                    onSelect={() => {
                      onSelect(gene.symbol);
                      onOpenChange(false);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 w-full">
                      <Dna className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900">{gene.symbol}</div>
                        <div className="text-xs text-gray-500 truncate">{gene.description}</div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
