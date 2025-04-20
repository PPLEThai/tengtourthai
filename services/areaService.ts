export interface AreaData {
    id: number;
    name: string;
    cat_id: number;
    sub_id: number;
    sub_name: string;
    detail: string;
    images: string[];
    geom: string;
    status: string;
    created: string;
    updated: string;
    stakeholder_id: number;
    province_id: number;
    ownership_id: number;
    extra_data: any;
    type: string;
    subdistrict: string;    
    district: string;
    province: string;
}

interface AreaResponse {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    data: AreaData[];
}

export const searchByArea = async (district: string, subdistrict: string, province: string): Promise<AreaData[]> => {
    try {
        const params = new URLSearchParams();
        if (district) params.append('district', district);
        if (subdistrict) params.append('subdistrict', subdistrict);
        if (province) params.append('province', province);
        
        const response = await fetch(`https://hackcity.pplethai.org/api/search-by-area?all=true&${params}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data: AreaResponse = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching area data:', error);
        return [];
    }
};

export interface FieldworkData {
    date: string;
    description: string | null;
    district: string;
    full_name: string;
    images: string[];
    latitude: number;
    location_name: string;
    longitude: number;
    province: string;
    role: string;
    subdistrict: string;
    tags: string | null;
}

interface FieldworkResponse {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    data: FieldworkData[];
}

export const searchFieldwork = async (district: string, subdistrict: string, province: string): Promise<FieldworkData[]> => {
    try {
        const params = new URLSearchParams();
        if (district) params.append('district', district);
        if (subdistrict) params.append('subdistrict', subdistrict);
        if (province) params.append('province', province);
        
        const response = await fetch(`https://hackcity.pplethai.org/api/kaitom-fieldwork?${params}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data: FieldworkResponse = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching fieldwork data:', error);
        return [];
    }
}; 