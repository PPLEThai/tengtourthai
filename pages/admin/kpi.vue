<template>
    <div class="p-6 bg-gray-50 min-h-full">
        <div class="max-w-7xl mx-auto">
            <h1 class="text-3xl font-bold mb-8 text-gray-800">KPI พรรคประชาชน</h1>

            <!-- สถิติรวม -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div v-for="(stat, index) in statistics" :key="index" 
                     class="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-lg font-semibold text-gray-700">{{ stat.title }}</h3>
                        <div class="text-blue-500">
                            <i :class="stat.icon" class="text-xl"></i>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <div class="flex items-baseline">
                            <span class="text-2xl font-bold text-blue-600">{{ stat.current }}</span>
                            <span class="text-xl font-bold text-gray-400 mx-2">/</span>
                            <span class="text-xl font-bold text-gray-600">{{ stat.target }}</span>
                        </div>
                        <p class="text-sm text-gray-500">{{ stat.unit }}</p>
                        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div class="bg-blue-600 h-2 rounded-full" :style="{ width: stat.percentage + '%' }"></div>
                        </div>
                        <p class="text-xs text-gray-600 mt-1">ความคืบหน้า {{ stat.percentage }}%</p>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="mb-6">
                <div role="tablist" class="tabs tabs-boxed w-fit">
                    <a role="tab" :class="['tab', tab === 'table' ? 'tab-active' : '']" @click="tab = 'table'">ตารางข้อมูล</a>
                    <a role="tab" :class="['tab', tab === 'map' ? 'tab-active' : '']" @click="tab = 'map'">แผนที่</a>
                </div>
            </div>

            <!-- ตารางข้อมูลรายจังหวัด -->
            <div v-if="tab === 'table'" class="bg-white rounded-xl shadow-md p-5 max-h-[70vh] overflow-auto">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold text-gray-800">ข้อมูลรายจังหวัด</h2>
                    <div class="flex space-x-3">
                        <button class="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                            <i class="fas fa-download mr-1"></i>Export
                        </button>
                        <div class="relative">
                            <input type="text" 
                                   placeholder="ค้นหาจังหวัด..." 
                                   class="pl-8 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                                   v-model="searchQuery">
                            <i class="fas fa-search absolute left-2.5 top-2 text-gray-400 text-sm"></i>
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead>
                            <tr class="bg-gray-50">
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    จังหวัด</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    กำนัน</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ผู้ใหญ่บ้าน</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ปธ.ชุมชน</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    นายก</th>
                                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    สมาชิกสภาท้องถิ่น</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="(province, index) in filteredProvinceData" :key="index"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{{ province.name
                                    }}</td>
                                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{{ province.kamnan }}/{{
                                    province.kamnanTarget }}</td>
                                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{{ province.phuyai }}/{{
                                    province.phuyaiTarget }}</td>
                                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{{ province.communityLeader
                                    }}/{{ province.communityLeaderTarget }}</td>
                                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{{ province.mayor }}/{{
                                    province.mayorTarget }}</td>
                                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{{ province.councilMember
                                    }}/{{ province.councilMemberTarget }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- แผนที่ (Mockup) -->
            <div v-if="tab === 'map'" class="bg-white rounded-xl shadow-md p-5 flex items-center justify-center max-h-[70vh] overflow-auto" style="min-height:400px;">
                <div class="text-center">
                    <div class="text-5xl mb-4">🗺️</div>
                    <div class="text-lg text-gray-600">(พื้นที่แสดงแผนที่ - สามารถนำ component แผนที่จริงมาใส่ได้ที่นี่)</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tab: 'table',
            searchQuery: '',
            statistics: [
                {
                    title: 'กำนัน',
                    current: '200',
                    target: '7,400',
                    unit: 'คน',
                    percentage: 2.7,
                    icon: 'fas fa-user-tie'
                },
                {
                    title: 'ผู้ใหญ่บ้าน',
                    current: '432',
                    target: '80,000',
                    unit: 'หมู่บ้าน',
                    percentage: 0.5,
                    icon: 'fas fa-home'
                },
                {
                    title: 'ประธานชุมชน',
                    current: '150',
                    target: '5,000',
                    unit: 'คน',
                    percentage: 3,
                    icon: 'fas fa-users'
                },
                {
                    title: 'นายก',
                    current: '45',
                    target: '2,000',
                    unit: 'คน',
                    percentage: 2.3,
                    icon: 'fas fa-user'
                },
                {
                    title: 'สมาชิกสภาท้องถิ่น',
                    current: '320',
                    target: '10,000',
                    unit: 'คน',
                    percentage: 3.2,
                    icon: 'fas fa-user-friends'
                },
                // {
                //     title: 'รวมทั้งหมด',
                //     current: '1,147',
                //     target: '104,400',
                //     unit: 'คน',
                //     percentage: 1.1,
                //     icon: 'fas fa-chart-pie'
                // }
            ],
            provinceData: [
                {
                    name: 'กรุงเทพมหานคร',
                    kamnan: 50,
                    kamnanTarget: 200,
                    phuyai: 100,
                    phuyaiTarget: 500,
                    communityLeader: 30,
                    communityLeaderTarget: 150,
                    mayor: 10,
                    mayorTarget: 50,
                    councilMember: 80,
                    councilMemberTarget: 300
                },
                {
                    name: 'เชียงใหม่',
                    kamnan: 40,
                    kamnanTarget: 180,
                    phuyai: 90,
                    phuyaiTarget: 450,
                    communityLeader: 25,
                    communityLeaderTarget: 130,
                    mayor: 8,
                    mayorTarget: 45,
                    councilMember: 70,
                    councilMemberTarget: 280
                }
            ]
        }
    },
    computed: {
        filteredProvinceData() {
            return this.provinceData.filter(province =>
                province.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            )
        }
    },
    mounted() {
        this.fetchData()
    },
    methods: {
        async fetchData() {
            try {
                // TODO: เรียก API เพื่อดึงข้อมูล
                // const response = await this.$axios.get('/api/kpi-data')
                // this.updateData(response.data)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        },
        updateData(data) {
            // TODO: อัพเดทข้อมูลจาก API
        }
    }
}
</script>

<style scoped>
/* เพิ่ม Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
</style>
