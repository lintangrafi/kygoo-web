import { apiClient, ApiResponse, PaginatedResponse } from '@/src/lib/api-client';

export interface MenuItem {
  id: string;
  name: string;
  category: 'coffee' | 'pastry' | 'food' | 'beverage';
  price: number;
  description: string;
  image_url?: string;
  available: boolean;
  calories?: number;
}

export interface CoffeeOrder {
  id: string;
  order_date: string;
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
  total_price: number;
  order_type: 'dine-in' | 'takeaway' | 'delivery';
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  notes?: string;
}

export interface OrderItem {
  menu_item_id: string;
  quantity: number;
  special_instructions?: string;
}

export interface CoffeeEvent {
  id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  guest_count: number;
  event_type: 'birthday' | 'corporate' | 'wedding' | 'private' | 'workshop';
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string;
  menu_preference: string;
  budget: number;
  requirements?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface CoffeeReservation {
  id: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

class CoffeeService {
  private baseUrl = '/coffee';

  // Menu operations
  async getMenuItems(category?: string): Promise<ApiResponse<MenuItem[]>> {
    return apiClient.get<MenuItem[]>(`${this.baseUrl}/menu`, { category });
  }

  async getMenuItem(id: string): Promise<ApiResponse<MenuItem>> {
    return apiClient.get<MenuItem>(`${this.baseUrl}/menu/${id}`);
  }

  // Order operations
  async createOrder(order: Omit<CoffeeOrder, 'id' | 'order_date' | 'status'>): Promise<ApiResponse<CoffeeOrder>> {
    return apiClient.post<CoffeeOrder>(`${this.baseUrl}/orders`, order);
  }

  async getOrders(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<CoffeeOrder>>> {
    return apiClient.get<PaginatedResponse<CoffeeOrder>>(`${this.baseUrl}/orders`, {
      page,
      limit,
    });
  }

  async getOrder(id: string): Promise<ApiResponse<CoffeeOrder>> {
    return apiClient.get<CoffeeOrder>(`${this.baseUrl}/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: CoffeeOrder['status']): Promise<ApiResponse<CoffeeOrder>> {
    return apiClient.put<CoffeeOrder>(`${this.baseUrl}/orders/${id}`, { status });
  }

  // Event/Catering operations
  async createEvent(event: Omit<CoffeeEvent, 'id' | 'status'>): Promise<ApiResponse<CoffeeEvent>> {
    return apiClient.post<CoffeeEvent>(`${this.baseUrl}/events`, event);
  }

  async getEvents(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<CoffeeEvent>>> {
    return apiClient.get<PaginatedResponse<CoffeeEvent>>(`${this.baseUrl}/events`, {
      page,
      limit,
    });
  }

  async getEvent(id: string): Promise<ApiResponse<CoffeeEvent>> {
    return apiClient.get<CoffeeEvent>(`${this.baseUrl}/events/${id}`);
  }

  async updateEvent(id: string, event: Partial<CoffeeEvent>): Promise<ApiResponse<CoffeeEvent>> {
    return apiClient.put<CoffeeEvent>(`${this.baseUrl}/events/${id}`, event);
  }

  // Reservation operations
  async createReservation(
    reservation: Omit<CoffeeReservation, 'id' | 'status'>
  ): Promise<ApiResponse<CoffeeReservation>> {
    return apiClient.post<CoffeeReservation>(`${this.baseUrl}/reservations`, reservation);
  }

  async getReservations(date?: string): Promise<ApiResponse<CoffeeReservation[]>> {
    return apiClient.get<CoffeeReservation[]>(`${this.baseUrl}/reservations`, { date });
  }

  async getReservation(id: string): Promise<ApiResponse<CoffeeReservation>> {
    return apiClient.get<CoffeeReservation>(`${this.baseUrl}/reservations/${id}`);
  }

  async updateReservation(id: string, reservation: Partial<CoffeeReservation>): Promise<ApiResponse<CoffeeReservation>> {
    return apiClient.put<CoffeeReservation>(`${this.baseUrl}/reservations/${id}`, reservation);
  }

  async cancelReservation(id: string): Promise<ApiResponse<CoffeeReservation>> {
    return apiClient.put<CoffeeReservation>(`${this.baseUrl}/reservations/${id}/cancel`, {});
  }

  // Store info
  async getStoreInfo(): Promise<
    ApiResponse<{
      hours: Record<string, string>;
      location: string;
      phone: string;
      email: string;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/store-info`);
  }

  // Specialties/Recommendations
  async getSpecialties(): Promise<ApiResponse<MenuItem[]>> {
    return apiClient.get<MenuItem[]>(`${this.baseUrl}/specialties`);
  }
}

export const coffeeService = new CoffeeService();
export default coffeeService;
