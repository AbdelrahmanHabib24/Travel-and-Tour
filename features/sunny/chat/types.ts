export type ChatTurnMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ConversationIntent =
  | "packages"
  | "budget"
  | "budget_flexibility"
  | "destination"
  | "comparison"
  | "hotel"
  | "custom_itinerary"
  | "closing"
  | "general";

export type SearchMode =
  | "lowest_price"
  | "next_price_tier"
  | "price_asc"
  | "budget_filter"
  | "duration_filter"
  | "destination_filter"
  | "all_packages"
  | "comparison"
  | "hotel_search"
  | "custom_itinerary"
  | "closing";

export type StructuredSuggestionItem = {
  id: string;
  label: {
    en: string;
    ar: string;
  };
  action?: {
    type: string;
    [key: string]: unknown;
  };
};

export type ChatAPIResponse = {
  response_id?: string;
  reply: string;
  model: string;
  fallback_used: boolean;
  language: "ar" | "en";
  packages_queried: boolean;
  intent?: ConversationIntent;
  explicit_table_requested?: boolean;
  suggestions?: string[];
  structured_suggestions?: StructuredSuggestionItem[];
  search_mode?: SearchMode;
  current_price_tier?: number | null;
  next_price_tier?: number | null;
  can_show_all_trips?: boolean;
  matched_packages?: Array<Record<string, unknown>>;
  packages?: Array<Record<string, unknown>>;
  hotel_inventory_available?: boolean;
  destination?: string | null;
  duration_days?: number | null;
  budget?: number | null;
};

export type SupportedLanguage = "en" | "ar";

export interface PackageRecord {
  id: number;
  URL: string;
  title1: string;
  title2: string;
  price: number;
  currency?: string;
  des: string;
  duration: string;
  durationDays?: number;
  durationNights?: number;
  rating?: number;
  count?: number;
}

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  language: SupportedLanguage;
  timestamp: number;
  packagesQueried?: boolean;
  userQuery?: string;
  intent?: ConversationIntent;
  explicitTableRequested?: boolean;
  suggestions?: string[];
  structuredSuggestions?: StructuredSuggestionItem[];
  responseId?: string;
  searchMode?: SearchMode;
  currentPriceTier?: number | null;
  nextPriceTier?: number | null;
  canShowAllTrips?: boolean;
  matchedPackages?: PackageRecord[];
}

export type SunnyWidgetMode = "chat" | "voice";

export interface TextChatProps {
  isOpen: boolean;
  onClose: () => void;
  onStartVoice?: () => void;
  initialMode?: SunnyWidgetMode;
  isPreConnectBufferEnabled?: boolean;
}

export interface StarterSuggestionItem {
  icon: "packages" | "plan" | "budget";
  text: string;
}

export interface VoiceSyncedTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  language: SupportedLanguage;
  timestamp: number;
}
