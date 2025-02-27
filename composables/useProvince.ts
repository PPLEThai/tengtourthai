import { provinces } from "@/composables/provinces"; // นำเข้าข้อมูลจังหวัด

export const useProvinces = () => {
    const getProvinceId = (path: string) => {
        const province = provinces.find(p => p.path === path);
        return province?.id || "10";
    };

    const getProvincePath = (id: string) => {
        const province = provinces.find(p => p.id === id);
        return province?.path || "bangkok";
    };

    return {
        provinces,
        getProvinceId,
        getProvincePath,
    };
}; 