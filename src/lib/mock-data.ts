// Mock data for Huggle Admin Platform

export interface DashboardStats {
  activeUsers: number;
  verifiedSellers: number;
  totalRevenue: number;
  pendingReports: number;
  totalOrders: number;
  monthlyGrowth: number;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  storeName: string;
  storeLocation: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  submissionDate: string;
  documents: {
    govId: string;
    businessPermit: string;
  };
  membershipStatus: 'active' | 'expired' | 'pending';
  totalRevenue: number;
  totalOrders: number;
  rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'buyer' | 'seller' | 'admin';
  status: 'active' | 'disabled' | 'banned';
  joinDate: string;
  lastActive: string;
  totalOrders?: number;
  totalSpent?: number;
}

export interface ContentReport {
  id: string;
  reportedBy: string;
  reportedContent: {
    type: 'product' | 'post';
    id: string;
    title: string;
    description: string;
  };
  reason: string;
  status: 'open' | 'in-review' | 'resolved' | 'dismissed';
  reportDate: string;
  seller: string;
}

export interface AnalyticsData {
  timeRange: '1month' | '3months' | '6months' | '1year' | 'overall';
  users: {
    total: number;
    new: number;
    active: number;
  };
  revenue: {
    total: number;
    growth: number;
  };
  orders: {
    total: number;
    completed: number;
    cancelled: number;
  };
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'viewer' | 'moderator' | 'superadmin';
  lastLogin: string;
  createdAt: string;
}

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  activeUsers: 15420,
  verifiedSellers: 342,
  totalRevenue: 1250000,
  pendingReports: 23,
  totalOrders: 8934,
  monthlyGrowth: 12.5,
};

// Mock sellers data
export const mockSellers: Seller[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@bakeryplus.com',
    storeName: 'Bakery Plus',
    storeLocation: 'Makati City, Metro Manila',
    status: 'pending',
    submissionDate: '2024-01-15',
    documents: {
      govId: 'gov-id-001.jpg',
      businessPermit: 'permit-001.pdf',
    },
    membershipStatus: 'pending',
    totalRevenue: 0,
    totalOrders: 0,
    rating: 0,
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@freshmarket.com',
    storeName: 'Fresh Market',
    storeLocation: 'Quezon City, Metro Manila',
    status: 'approved',
    submissionDate: '2024-01-10',
    documents: {
      govId: 'gov-id-002.jpg',
      businessPermit: 'permit-002.pdf',
    },
    membershipStatus: 'active',
    totalRevenue: 125000,
    totalOrders: 456,
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Carlos Rodriguez',
    email: 'carlos@techgadgets.com',
    storeName: 'Tech Gadgets Store',
    storeLocation: 'Cebu City, Cebu',
    status: 'approved',
    submissionDate: '2024-01-05',
    documents: {
      govId: 'gov-id-003.jpg',
      businessPermit: 'permit-003.pdf',
    },
    membershipStatus: 'active',
    totalRevenue: 275000,
    totalOrders: 789,
    rating: 4.6,
  },
];

// Mock users data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@email.com',
    type: 'buyer',
    status: 'active',
    joinDate: '2023-11-15',
    lastActive: '2024-01-15',
    totalOrders: 24,
    totalSpent: 15600,
  },
  {
    id: '2',
    name: 'Bob Chen',
    email: 'bob@email.com',
    type: 'buyer',
    status: 'active',
    joinDate: '2023-12-01',
    lastActive: '2024-01-14',
    totalOrders: 12,
    totalSpent: 8400,
  },
  {
    id: '3',
    name: 'Sarah Admin',
    email: 'sarah@huggle.com',
    type: 'admin',
    status: 'active',
    joinDate: '2023-01-01',
    lastActive: '2024-01-15',
  },
];

// Mock content reports
export const mockReports: ContentReport[] = [
  {
    id: '1',
    reportedBy: 'Alice Johnson',
    reportedContent: {
      type: 'product',
      id: 'prod-123',
      title: 'Expired Milk Products',
      description: 'Selling expired dairy products at discounted prices',
    },
    reason: 'Unsafe/Expired products',
    status: 'open',
    reportDate: '2024-01-14',
    seller: 'Fresh Market',
  },
  {
    id: '2',
    reportedBy: 'Bob Chen',
    reportedContent: {
      type: 'post',
      id: 'post-456',
      title: 'Misleading Advertisement',
      description: 'Claims 90% discount but actual discount is only 10%',
    },
    reason: 'False advertising',
    status: 'in-review',
    reportDate: '2024-01-13',
    seller: 'Tech Gadgets Store',
  },
];

// Mock analytics data
export const mockAnalytics: AnalyticsData = {
  timeRange: '1month',
  users: {
    total: 15420,
    new: 1240,
    active: 8930,
  },
  revenue: {
    total: 1250000,
    growth: 12.5,
  },
  orders: {
    total: 8934,
    completed: 8234,
    cancelled: 700,
  },
  topProducts: [
    { id: '1', name: 'Fresh Bread Bundle', sales: 1200, revenue: 48000 },
    { id: '2', name: 'Phone Accessories Set', sales: 800, revenue: 65000 },
    { id: '3', name: 'Organic Vegetables', sales: 950, revenue: 35000 },
  ],
};

// Mock admins data
export const mockAdmins: Admin[] = [
  {
    id: '1',
    name: 'Sarah Wilson',
    email: 'sarah@huggle.com',
    role: 'superadmin',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike@huggle.com',
    role: 'moderator',
    lastLogin: '2024-01-14T15:45:00Z',
    createdAt: '2023-06-15T00:00:00Z',
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@huggle.com',
    role: 'viewer',
    lastLogin: '2024-01-13T09:20:00Z',
    createdAt: '2023-09-01T00:00:00Z',
  },
];