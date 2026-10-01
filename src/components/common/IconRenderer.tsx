import React from 'react';
import {
  Code,
  Search,
  Share2,
  Target,
  Smartphone,
  Palette,
  TrendingUp,
  Video,
  Award,
  Users,
  Compass,
  Zap,
  Globe,
  BarChart3,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Code,
  Search,
  Share2,
  Target,
  Smartphone,
  Palette,
  TrendingUp,
  Video,
  Award,
  Users,
  Compass,
  Zap,
  Globe,
  BarChart3,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2
};

interface IconRendererProps {
  name: string;
  className?: string;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5' }) => {
  const IconComponent = iconMap[name] || Sparkles;
  return <IconComponent className={className} />;
};
