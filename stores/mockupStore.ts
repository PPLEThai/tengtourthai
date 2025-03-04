import { defineStore } from 'pinia';

interface FieldworkItem {
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
        fieldworkData: [] as FieldworkItem[],
        scheduleData: [] as ScheduleItem[],
    }),
    actions: {
        async fetchData() {
            const timestamp = Math.floor(+(new Date()) / 1000 / 3600);
            const apiUrl = useRuntimeConfig().public.apiTengData + `?timestamp=${timestamp}`;
            try {
                const response = await fetch(apiUrl as string);
                const data = await response.json();
                this.fieldworkData = data.fieldwork;
                this.scheduleData = data.schedule.sort((a: ScheduleItem, b: ScheduleItem) => {
                    const dateA = new Date(a.date || "1970-01-01");
                    const dateB = new Date(b.date || "1970-01-01");
                    return dateA.getTime() - dateB.getTime();
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
    },
    getters: {
        groupedData: (state) => {
            if (!state.fieldworkData) return {};

            const sortedData = [...state.fieldworkData].sort((a, b) => {
                const dateA = new Date(a.date || "1970-01-01");
                const dateB = new Date(b.date || "1970-01-01");
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