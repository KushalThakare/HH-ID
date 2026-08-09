// Custom rule-based Builder Title generator

const KEYWORD_MAP = [
  {
    keywords: ['react', 'vue', 'next', 'nuxt', 'frontend', 'ui', 'css', 'html', 'tailwind', 'angular', 'svelte'],
    titles: ['Frontend Alchemist', 'UI Sorcerer', 'Client-Side Artisan', 'Pixel Virtuoso', 'DOM Whisperer']
  },
  {
    keywords: ['backend', 'node', 'express', 'django', 'fastapi', 'flask', 'springboot', 'database', 'postgres', 'sql', 'mongodb'],
    titles: ['Systems Architect', 'Server Overlord', 'API Conductor', 'Database Sentinel', 'Pipeline Sorcerer']
  },
  {
    keywords: ['solidity', 'web3', 'blockchain', 'ethereum', 'crypto', 'smart contract', 'rust', 'go-ethereum'],
    titles: ['Smart Contract Sovereign', 'DeFi Pioneer', 'Consensus Whisperer', 'Web3 Evangelist', 'EVM Navigator']
  },
  {
    keywords: ['ai', 'ml', 'llm', 'nlp', 'pytorch', 'tensorflow', 'model', 'data science', 'agent', 'gemini', 'openai'],
    titles: ['Neural Weaver', 'Algorithm Mystic', 'Data Prophet', 'Prompt Commander', 'AI Synapse Shaper']
  },
  {
    keywords: ['design', 'ux', 'figma', 'product', 'creative', 'graphics', 'uiux'],
    titles: ['Experience Sculptor', 'Visual Maestro', 'Figma Sorcerer', 'Interaction Craftsperson', 'Creative Catalyst']
  },
  {
    keywords: ['rust', 'cpp', 'c++', 'c', 'assembly', 'systems', 'go', 'golang'],
    titles: ['Bare-Metal Explorer', 'Memory-Safe Warden', 'Low-Level Tactician', 'Concurrency Commander', 'Byte Wrangler']
  },
  {
    keywords: ['cyber', 'security', 'hack', 'penetration', 'reverse', 'infosec', 'firewall'],
    titles: ['Security Sentinel', 'Kernel Breaker', 'Crypto Shield', 'White-Hat Tactician', 'Zero-Day Explorer']
  },
  {
    keywords: ['fullstack', 'generalist', 'dev', 'developer', 'software', 'engineer'],
    titles: ['Full-Stack Orchestrator', 'Polyglot Architect', 'Omnipresent Coder', 'System Synthesizer', 'Product Engineer']
  }
];

export function generateBuilderTitle(name = '', roleOrStack = '') {
  const cleanRole = roleOrStack.trim().toLowerCase();
  const cleanName = name.trim().toLowerCase();
  
  if (!cleanRole) {
    return 'Aspiring Builder';
  }

  // Find a matching category based on keywords
  let matchingCategory = null;
  for (const category of KEYWORD_MAP) {
    if (category.keywords.some(keyword => cleanRole.includes(keyword))) {
      matchingCategory = category;
      break;
    }
  }

  // Determine a deterministic index based on name & role lengths to keep it consistent
  // but unique per person/role combination
  const seed = (cleanName.length * 3 + cleanRole.length * 7) % 5;

  if (matchingCategory) {
    return matchingCategory.titles[seed % matchingCategory.titles.length];
  }

  // Standard fallback using prefixes & nouns
  const prefixes = [
    'Neon', 'Cyber', 'Nomadic', 'Quantum', 'Tropical', 
    'Infinite', 'Stellar', 'Goan', 'Solar', 'Glitch', 
    'Radical', 'Hyper', 'Delta', 'Coastal', 'Vapor'
  ];
  
  const nouns = [
    'Hacker', 'Architect', 'Wrangler', 'Explorer', 'Crafter', 
    'Scout', 'Strategist', 'Catalyst', 'Vanguard', 'Slayer',
    'Synthesizer', 'Navigator', 'Engineer', 'Creator', 'Maverick'
  ];

  const prefixIndex = (cleanName.length + cleanRole.length) % prefixes.length;
  const nounIndex = (cleanName.length * 2 + cleanRole.length * 3) % nouns.length;

  return `${prefixes[prefixIndex]} ${nouns[nounIndex]}`;
}
