import { WeeklyStatus } from '../components/objects/weekly-status';
import { getApiEndpoint, API_FEATURES } from '../apiConfig';
import { API_VERSION } from '../../constant';
import { convertToWeeklyStatus } from '../components/converter/weeklyStatusConverter';

/**
 * Abstraction layer for all API interactions.
 * Handles fetching, error parsing, and data mapping to internal contracts.
 */
export class ApiService {
  /**
   * Fetches weekly status from the backend using a specified version.
   * Defaults to v1.
   */
  static async fetchWeeklyStatus(
    project_id: string, 
    currentUserId: string, 
    version: string = API_VERSION
  ): Promise<WeeklyStatus[]> {
    const endpoint = getApiEndpoint(version, API_FEATURES.WEEKLY_STATUS);
    
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: project_id, accepts: 'application/json' })
    };

    console.log(`[ApiService] Request: POST ${endpoint}`, {
      headers: requestParams.headers,
      body: JSON.parse(requestParams.body)
    });
    
    const response = await fetch(endpoint, requestParams);
    const data = await response.json();

    console.log(`[ApiService] Response: POST ${endpoint}`, data);

    if (!response.ok) {
      throw new Error(data.message || `Server Error ${response.status}`);
    }

    // Use the optimized converter for the specified raw JSON structure
    try {
      if (data && typeof data === 'object' && 'weekly_reports' in data) {
        return convertToWeeklyStatus(data);
      }
    } catch (e) {
      console.warn('[ApiService] Specialized converter failed, falling back to greedy mapper', e);
    }

    return this.mapToWeeklyStatus(data, currentUserId, project_id);
  }

  /**
   * Internal mapper to abstract the API contract from the UI contract.
   * Maps server response (greedy matching) to the internal WeeklyStatus object.
   */
  private static mapToWeeklyStatus(data: any, currentUserId: string, project_id: string): WeeklyStatus[] {
    let rawItems: any[] = [];
    
    // Greedy search for list containers in the response
    if (Array.isArray(data)) {
      rawItems = data;
    } else if (data && typeof data === 'object') {
      const dataContainers = ['data', 'reports', 'items', 'logs', 'result', 'status_logs'];
      const foundKey = dataContainers.find(key => Array.isArray(data[key]));
      
      if (foundKey) {
        rawItems = data[foundKey];
      } else if (Object.keys(data).length > 0) {
        // Single object fallback
        rawItems = [data];
      }
    }

    const mapped = rawItems.map((item: any, index: number) => {
      // Abstraction logic: map backend fields (greedy) to frontend types
      const itemDate = item.date || item.created_at || item.createdAt || "";
      const itemStart = item.startDate || item.start_date || item.start || itemDate || "";
      const itemEnd = item.endDate || item.end_date || item.end || "";
      
      const dateObj = new Date(itemStart || itemDate || Date.now());
      const isValidDate = !isNaN(dateObj.getTime());
      
      return {
        id: String(item.id || item.report_id || item._id || `ext-${Date.now()}-${index}`),
        date: itemDate,
        startDate: itemStart,
        endDate: itemEnd,
        progressText: item.progressText || item.summary || item.text || item.description || item.content || item.notes || "",
        photos: Array.isArray(item.photos) ? item.photos : [],
        auditMaterial: (item.auditMaterial || item.material_status || 'pending') as 'verified' | 'pending' | 'failed',
        auditSafety: (item.auditSafety || item.safety_status || 'pending') as 'certified' | 'pending' | 'failed',
        comments: Array.isArray(item.comments) ? item.comments : [],
        month: item.month || (isValidDate ? dateObj.toLocaleString('en-US', { month: 'long' }) : 'Unknown'),
        year: item.year || (isValidDate ? dateObj.getFullYear() : 0),
        userId: item.userId || item.user_id || currentUserId,
        project_id: item.project_id || project_id,
        source: 'external' as const 
      };
    });

    console.log('[ApiService] Converted Weekly Status items:', mapped);
    return mapped;
  }

  /**
   * Saves a quotation delta to the server.
   */
  static async saveQuotation(items: any[], version: string = API_VERSION): Promise<any> {
    const endpoint = getApiEndpoint(version, API_FEATURES.QUOTATION);
    
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    };

    console.log(`[ApiService] Request: POST ${endpoint}`, {
      headers: requestParams.headers,
      body: JSON.parse(requestParams.body)
    });

    const response = await fetch(endpoint, requestParams);
    const data = await response.json();
    console.log(`[ApiService] Response: POST ${endpoint}`, data);
    return data;
  }

  /**
   * Submits a new weekly status to the backend.
   */
  static async createWeeklyStatus(status: WeeklyStatus, version: string = API_VERSION): Promise<any> {
    const endpoint = getApiEndpoint(version, API_FEATURES.WEEKLY_STATUS); // Using same endpoint for now as it's a proxy
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'CREATE',
        data: status
      })
    };

    console.log(`[ApiService] New Entry Request: POST ${endpoint}`, {
      headers: requestParams.headers,
      body: JSON.parse(requestParams.body)
    });

    // In a real app, we'd wait for the fetch. For now, we simulate success for logging purposes
    // as the backend target might not support actual creation yet.
    // const response = await fetch(endpoint, requestParams);
    // const data = await response.json();
    // console.log(`[ApiService] New Entry Response: POST ${endpoint}`, data);
    const mockResponse = { status: 'logged', timestamp: new Date().toISOString() };
    console.log(`[ApiService] New Entry Response (Mock): POST ${endpoint}`, mockResponse);
    return mockResponse;
  }

  /**
   * Updates message star status.
   */
  static async toggleStar(logId: string, commentId: string, starred: boolean, version: string = API_VERSION): Promise<any> {
    const endpoint = getApiEndpoint(version, API_FEATURES.STAR);
    
    const requestParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logId, commentId, starred })
    };

    console.log(`[ApiService] Request: POST ${endpoint}`, {
      headers: requestParams.headers,
      body: JSON.parse(requestParams.body)
    });

    const response = await fetch(endpoint, requestParams);
    const data = await response.json();
    console.log(`[ApiService] Response: POST ${endpoint}`, data);
    return data;
  }
}
