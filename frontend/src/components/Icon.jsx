import { BookOpen, Pencil, Calculator, Zap, FlaskConical, Microscope, TrendingUp, Briefcase, Monitor, Scroll, Globe, Brain, Landmark, BookMarked, Music, Palette, Trophy, Search, MessageCircle, User, DollarSign, Camera, Star, Send, Plus, X, Menu, ChevronLeft, Flag, Trash2, Check, RefreshCw, Megaphone, Package, LogIn, UserPlus, Mail, Lock, ShoppingBag } from 'lucide-react';

const CATEGORY_ICONS = {
  chinese: BookOpen, english: Pencil, math: Calculator, physics: Zap, chemistry: FlaskConical,
  biology: Microscope, economics: TrendingUp, bafs: Briefcase, ict: Monitor, history: Scroll,
  geography: Globe, ls: Brain, chinese_history: Landmark, chinese_literature: BookMarked,
  music: Music, visual_arts: Palette, pe: Trophy,
};

const ICON_CLASS = "w-5 h-5";

export function CategoryIcon({ name, className = ICON_CLASS }) {
  const Component = CATEGORY_ICONS[name] || BookOpen;
  return <Component className={className} strokeWidth={1.5} />;
}

export function SearchIcon({ className = ICON_CLASS }) { return <Search className={className} strokeWidth={1.5} />; }
export function MessageIcon({ className = ICON_CLASS }) { return <MessageCircle className={className} strokeWidth={1.5} />; }
export function UserIcon({ className = ICON_CLASS }) { return <User className={className} strokeWidth={1.5} />; }
export function PriceIcon({ className = ICON_CLASS }) { return <DollarSign className={className} strokeWidth={1.5} />; }
export function CameraIcon({ className = ICON_CLASS }) { return <Camera className={className} strokeWidth={1.5} />; }
export function StarIcon({ className = ICON_CLASS }) { return <Star className={className} strokeWidth={1.5} />; }
export function SendIcon({ className = ICON_CLASS }) { return <Send className={className} strokeWidth={1.5} />; }
export function PlusIcon({ className = ICON_CLASS }) { return <Plus className={className} strokeWidth={1.5} />; }
export function CloseIcon({ className = ICON_CLASS }) { return <X className={className} strokeWidth={1.5} />; }
export function MenuIcon({ className = ICON_CLASS }) { return <Menu className={className} strokeWidth={1.5} />; }
export function BackIcon({ className = ICON_CLASS }) { return <ChevronLeft className={className} strokeWidth={1.5} />; }
export function FlagIcon({ className = ICON_CLASS }) { return <Flag className={className} strokeWidth={1.5} />; }
export function TrashIcon({ className = ICON_CLASS }) { return <Trash2 className={className} strokeWidth={1.5} />; }
export function CheckIcon({ className = ICON_CLASS }) { return <Check className={className} strokeWidth={1.5} />; }
export function RefreshIcon({ className = ICON_CLASS }) { return <RefreshCw className={className} strokeWidth={1.5} />; }
export function MegaphoneIcon({ className = ICON_CLASS }) { return <Megaphone className={className} strokeWidth={1.5} />; }
export function PackageIcon({ className = ICON_CLASS }) { return <Package className={className} strokeWidth={1.5} />; }
export function LoginIcon({ className = ICON_CLASS }) { return <LogIn className={className} strokeWidth={1.5} />; }
export function RegisterIcon({ className = ICON_CLASS }) { return <UserPlus className={className} strokeWidth={1.5} />; }
export function MailIcon({ className = ICON_CLASS }) { return <Mail className={className} strokeWidth={1.5} />; }
export function LockIcon({ className = ICON_CLASS }) { return <Lock className={className} strokeWidth={1.5} />; }
export function ShopIcon({ className = ICON_CLASS }) { return <ShoppingBag className={className} strokeWidth={1.5} />; }
