import { apiClient, ApiResponse, PaginatedResponse } from '@/src/lib/api-client';

export interface IDigitalService {
  id: string;
  name: string;
  description: string;
  category: 'web' | 'mobile' | 'design' | 'api' | 'data' | 'cloud';
  price_range: {
    min: number;
    max: number;
  };
  tech_stack: string[];
  portfolio_items?: number;
}

export interface DigitalProject {
  id: string;
  title: string;
  description: string;
  service_id: string;
  client_name: string;
  client_email: string;
  budget: number;
  timeline: string;
  requirements: string;
  status: 'inquiry' | 'proposal' | 'in-progress' | 'completed' | 'on-hold';
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  client: string;
  tech_used: string[];
  url?: string;
  featured: boolean;
}

class DigitalService {
  private baseUrl = '/digital';

  // Get all services
  async getServices(): Promise<ApiResponse<IDigitalService[]>> {
    return apiClient.get<IDigitalService[]>(`${this.baseUrl}/services`);
  }

  // Get service by category
  async getServicesByCategory(category: string): Promise<ApiResponse<DigitalService[]>> {
    return apiClient.get<DigitalService[]>(`${this.baseUrl}/services`, { category });
  }

  // Get single service
  async getService(id: string): Promise<ApiResponse<DigitalService>> {
    return apiClient.get<DigitalService>(`${this.baseUrl}/services/${id}`);
  }

  // Create project inquiry
  async createProjectInquiry(
    project: Omit<DigitalProject, 'id' | 'status' | 'created_at' | 'updated_at'>
  ): Promise<ApiResponse<DigitalProject>> {
    return apiClient.post<DigitalProject>(`${this.baseUrl}/projects`, project);
  }

  // Get projects
  async getProjects(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<DigitalProject>>> {
    return apiClient.get<PaginatedResponse<DigitalProject>>(`${this.baseUrl}/projects`, {
      page,
      limit,
    });
  }

  // Get project by ID
  async getProject(id: string): Promise<ApiResponse<DigitalProject>> {
    return apiClient.get<DigitalProject>(`${this.baseUrl}/projects/${id}`);
  }

  // Update project
  async updateProject(id: string, project: Partial<DigitalProject>): Promise<ApiResponse<DigitalProject>> {
    return apiClient.put<DigitalProject>(`${this.baseUrl}/projects/${id}`, project);
  }

  // Get portfolio
  async getPortfolio(): Promise<ApiResponse<PortfolioItem[]>> {
    return apiClient.get<PortfolioItem[]>(`${this.baseUrl}/portfolio`);
  }

  // Get featured portfolio items
  async getFeaturedPortfolio(limit = 6): Promise<ApiResponse<PortfolioItem[]>> {
    return apiClient.get<PortfolioItem[]>(`${this.baseUrl}/portfolio/featured`, { limit });
  }

  // Get portfolio item by ID
  async getPortfolioItem(id: string): Promise<ApiResponse<PortfolioItem>> {
    return apiClient.get<PortfolioItem>(`${this.baseUrl}/portfolio/${id}`);
  }

  // Get tech stack
  async getTechStack(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>(`${this.baseUrl}/tech-stack`);
  }

  // Get team members
  async getTeamMembers(): Promise<ApiResponse<any[]>> {
    return apiClient.get<any[]>(`${this.baseUrl}/team`);
  }
}

export const digitalService = new DigitalService();
export default digitalService;
