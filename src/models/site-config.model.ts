
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
}

export interface SiteConfig {
  logoUrl: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string; // Just the number
  instagramUrl: string;
  twitterUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;

  // About Section
  aboutTitle: string;
  aboutText: string;
  team: TeamMember[];

  footerText: string;
  
  // Legal Texts
  kvkkText: string;
  privacyText: string;
  cookiesText: string;
  termsText: string;
  distanceSellingText: string;
  cancellationText: string;
  insuranceText: string;

  // Campaigns Section
  campaignEarlyBooking: string;
  campaignRoadside: string;
  campaignFreeDelivery: string;

  // Why Us Section
  whyUsTitle: string;
  whyUsSubtitle: string;
  whyUsTrustTitle: string;
  whyUsTrustDesc: string;
  whyUsSupportTitle: string;
  whyUsSupportDesc: string;
  whyUsComfortTitle: string;
  whyUsComfortDesc: string;

  // Sales Section
  salesTitle: string;
  salesDesc: string;
  salesCta: string;

  // Partner Section
  partnerTitle: string;
  partnerSubtitle: string;
  partnerRequirementYear: string;

  // Theme
  theme: 'light' | 'dark' | 'luxury' | 'corporate';
}
