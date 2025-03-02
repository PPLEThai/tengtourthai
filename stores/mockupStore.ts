import { defineStore } from 'pinia';

interface MockupItem {
    no: string;
    date: string;
    province: string;
    type: string;
    km: string | number;
    place: string;
    topic: string;
    post: string;
}

interface ScheduleItem {
    province: string;
    date: string;
    place: string;
    status: string;
}

interface GroupedProvinceData {
    visits: number;
    lastVisit: string;
    actions: string[];
    posts: string[];
}

export const useMockupStore = defineStore('mockup', {
    state: () => ({
        mockupData: [] as MockupItem[],
        scheduleData: [] as ScheduleItem[],
    }),
    actions: {
        async fetchData() {
            const apiUrl = useRuntimeConfig().public.apiTengData;
            try {
                const response = await fetch(apiUrl as string);
                const data = await response.json();
                this.mockupData = data.fieldwork;
                this.scheduleData = data.schedule;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    },
    getters: {
        groupedData: (state) => {
            if (!state.mockupData) return {};

            const sortedData = [...state.mockupData].sort((a, b) => {
                const [dayA, monthA, yearA] = (a.date || "01/01/1970").split("/").map(Number);
                const [dayB, monthB, yearB] = (b.date || "01/01/1970").split("/").map(Number);
                const dateA = new Date(yearA, monthA - 1, dayA);
                const dateB = new Date(yearB, monthB - 1, dayB);
                return dateB.getTime() - dateA.getTime();
            });

            return sortedData.reduce<Record<string, GroupedProvinceData>>((acc, item) => {
                const province = item.province;

                if (!acc[province]) {
                    acc[province] = {
                        visits: 0,
                        lastVisit: "",
                        actions: [],
                        posts: []
                    };
                }

                acc[province].visits += 1;

                if (item.date && (!acc[province].lastVisit || new Date(item.date) > new Date(acc[province].lastVisit))) {
                    acc[province].lastVisit = item.date;
                }

                if (item.type && !acc[province].actions.includes(item.type)) {
                    acc[province].actions.push(item.type);
                }
                if (item.post && !acc[province].posts.includes(item.post)) {
                    acc[province].posts.push(item.post);
                }
                return acc;
            }, {});
        }
    }
});