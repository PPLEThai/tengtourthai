import { ref, computed } from 'vue';

interface MockupItem {
    date: string;
    province: string;
    type: string;
    km: string | number;
    place: string;
    topic: string;
    post: string;
}

interface GroupedProvinceData {
    visits: number;
    lastVisit: string;
    actions: string[];
    posts: string[]; // Added posts field
}

export const useMockupData = () => {
    const mockupData = ref<MockupItem[]>([
        {
            "date": "",
            "province": "ราชบุรี",
            "type": "หาเสียง",
            "km": "-",
            "place": "-",
            "topic": "-",
            "post": "-"
        },
        {
            "date": "",
            "province": "พิษณุโลก",
            "type": "หาเสียง",
            "km": "-",
            "place": "-",
            "topic": "-",
            "post": "-"
        },
        {
            "date": "29/9/24",
            "province": "กรุงเทพมหานคร",
            "type": "ททท.",
            "km": 0,
            "place": "- หมู่บ้านเศรษฐกิจ, หมู่บ้านสุขสันต์ 6, ท้ายซอยเพชรเกษม 66, ชุมชนรวมใจริมคลองหมู่ 3",
            "topic": "-",
            "post": "https://www.facebook.com/share/M4h54HgNqfYFSxLi/"
        },
        {
            "date": "12/10/2024",
            "province": "เชียงใหม่",
            "type": "ลงพื้นที่ภัยพิบัติ",
            "km": "-",
            "place": "-",
            "topic": "-",
            "post": "https://www.facebook.com/share/1Qxcwis68D/"
        },
        {
            "date": "12/10/2024",
            "province": "ลำพูน",
            "type": "ลงพื้นที่ภัยพิบัติ",
            "km": "-",
            "place": "-",
            "topic": "-",
            "post": "https://www.facebook.com/share/1Qxcwis68D/"
        },
        {
            "date": "20/10/24",
            "province": "นครนายก",
            "type": "ททท.",
            "km": 131,
            "place": "- อ่างเก็บน้ำคลองโบด",
            "topic": "https://docs.google.com/document/d/121cwooWtLQSGsFHAPmiK9plHsELAGL0Vs6DUQy3y9l0/edit",
            "post": "https://www.facebook.com/share/VJjRvxeSsCEgiJMt/"
        },
        {
            "date": "20/10/24",
            "province": "อยุธยา",
            "type": "ททท.",
            "km": 232,
            "place": "- อนุสาวรีย์นายขนมต้ม, บ้านบางชะนี, ประตูระบายน้ำคลองบางบาล",
            "topic": "https://docs.google.com/document/d/12JluCf33aWsCFmPRu4gH0fzU-ZlerXGzgUg1CQ0uB0c/edit",
            "post": "https://www.facebook.com/share/VJjRvxeSsCEgiJMt/"
        },
        {
            "date": "28/10/2024",
            "province": "สมุทรปราการ",
            "type": "ลงพื้นที่ทั่วไป",
            "km": "-",
            "place": "- พระสมุทรเจดีย์",
            "topic": "- เที่ยวงานพระสมุทรเจดีย์",
            "post": "https://www.facebook.com/nittaya.koys/posts/pfbid02cTNTkw3mSjNitALvmVBr9xieL7WHdW762qjg13Fs26V1GXRtjGMkCQNBcg8dNLd6l"
        },
        {
            "date": "31/10/2024",
            "province": "เชียงราย",
            "type": "ลงพื้นที่ภัยพิบัติ",
            "km": "-",
            "place": "-",
            "topic": "-",
            "post": "https://www.facebook.com/share/v/15SH9RrVjH/"
        },
        {
            "date": "",
            "province": "อุดรธานี",
            "type": "หาเสียง",
            "km": "-",
            "place": "-",
            "topic": "-",
            "post": "-"
        },
        {
            "date": "9/11/24",
            "province": "ขอนแก่น",
            "type": "ททท.",
            "km": 600,
            "place": "- ขอนแก่น (ก้าวเมือง), OPH ขอนแก่น",
            "topic": "",
            "post": "https://www.facebook.com/share/149TZjGUmp/"
        },
        {
            "date": "",
            "province": "อุบลราชธานี",
            "type": "หาเสียง",
            "km": "-",
            "place": "-",
            "topic": "-",
            "post": "-"
        },
        {
            "date": "11/11/24",
            "province": "ศรีสะเกษ",
            "type": "ลงพื้นที่ทั่วไป",
            "km": "-",
            "place": "-",
            "topic": "-",
            "post": "-"
        },
        {
            "date": "11/11/24",
            "province": "สุรินทร์",
            "type": "ลงพื้นที่ทั่วไป",
            "km": 811,
            "place": "-",
            "topic": "-",
            "post": "-"
        },
        {
            "date": "12/11/24",
            "province": "ร้อยเอ็ด",
            "type": "ททท.",
            "km": 909,
            "place": "- โรงสีศรีแสงดาว, เขื่อนร้อยเอ็ด",
            "topic": "- ขอนแก่นพัฒนาเมือง",
            "post": "https://www.facebook.com/share/1Dox8QjWm9/"
        },
        {
            "date": "16/11/2024",
            "province": "มุกดาหาร",
            "type": "ททท.",
            "km": "1,068",
            "place": "- ทบ.ต.หนองแคน",
            "topic": "-",
            "post": ""
        },
        {
            "date": "16/11/2024",
            "province": "มุกดาหาร",
            "type": "ผนค. พบ ปชช.",
            "km": "-",
            "place": "- ทบ.ต.หนองแคน",
            "topic": "- การพัฒนาการท่องเที่ยวและเศรษฐกิจชายแดนมุกดาหาร , Telemed",
            "post": "https://www.facebook.com/share/15pdzUvv5H/"
        },
        {
            "date": "17/11/2024",
            "province": "อุบลราชธานี",
            "type": "ผนค. พบ ปชช.",
            "km": "-",
            "place": "- ศูนย์เมล็ดพันธุ์ข้าวอุบลราชธานี",
            "topic": "- การพัฒนาระบบเกษตรก้าวหน้าและยั่งยืน",
            "post": "https://www.facebook.com/share/15pdzUvv5H/"
        },
        {
            "date": "24/11/2024",
            "province": "หนองคาย",
            "type": "ททท.",
            "km": "1,685",
            "place": "- ตลาดสดท่าบ่อ,บ้านไทยสามัคคี,ศูนย์วัฒนธรรมไทยพวนโพธิ์ตาก,วัดหายโศก",
            "topic": "- ประปา,ที่ดิน,ขนส่ง,สังคมผู้สูงวัย",
            "post": "https://www.facebook.com/share/p/18HdhTkze2/?mibextid=WC7FNe"
        },
        {
            "date": "28/11/2024",
            "province": "สุราษฎร์ธานี",
            "type": "ททท.",
            "km": "2,986",
            "place": "- ชุมชนโคบาล,ศูนย์ส่วนหน้า",
            "topic": "- ปัญหาที่อยู่อาศัย,น้ำท่วม",
            "post": "https://www.facebook.com/share/p/1Dj5krErWh/?mibextid=WC7FNe"
        },
        {
            "date": "28/11/2024",
            "province": "พังงา",
            "type": "ททท.",
            "km": "3,102",
            "place": "- เหมืองหินถ้ำทองหลาง,บ่อขยะ ทบ.เมืองพังงา",
            "topic": "- คัดค้านเหมืองหิน,บ่อขยะ",
            "post": "https://www.facebook.com/share/p/1Dj5krErWh/?mibextid=WC7FNe"
        },
        {
            "date": "29/11/2024",
            "province": "สงขลา",
            "type": "ลงพื้นที่ภัยพิบัติ",
            "km": "-",
            "place": "- แยกจะนะ,หาดใหญ่ใน",
            "topic": "-",
            "post": "https://www.facebook.com/share/p/1Dj5krErWh/?mibextid=WC7FNe"
        },
        {
            "date": "3/12/2024",
            "province": "ภูเก็ต",
            "type": "ททท.",
            "km": "3,209",
            "place": "- ประมงผู้เพาะเลี้ยงสัตว์น้ำในกระชัง",
            "topic": "- อุบัติเหตุ",
            "post": "https://www.facebook.com/share/15emVHcdqc/"
        },
        {
            "date": "10/12/2024",
            "province": "เชียงใหม่",
            "type": "ลงพื้นที่ทั่วไป",
            "km": "-",
            "place": "- มูลนิธิขาเทียมฯ",
            "topic": "-",
            "post": "https://www.facebook.com/share/18ktUkHEok/"
        },
        {
            "date": "16/12/2024",
            "province": "นครปฐม",
            "type": "ททท.",
            "km": "4,010",
            "place": "- อ่างเก็บน้ำประปาเทศบาล , ถนนรอบองค์พระ",
            "topic": "-",
            "post": "https://www.facebook.com/share/1KXoSMmKCY/"
        },
        {
            "date": "16/12/2024",
            "province": "สมุทรสาคร",
            "type": "ททท.",
            "km": "4,061",
            "place": "- สวนไพศาลมะพร้าวน้ำหอม , ตลาดกระทุ่มแบน",
            "topic": "-",
            "post": "https://www.facebook.com/share/1KXoSMmKCY/"
        },
        {
            "date": "17/12/2024",
            "province": "สมุทรสงคราม",
            "type": "ททท.",
            "km": "4,106",
            "place": "- สวนส้มโอเรือนปณาลี , งานปลาทู",
            "topic": "-",
            "post": "https://www.facebook.com/share/1KXoSMmKCY/"
        },
        {
            "date": "23/12/2024",
            "province": "นนทบุรี",
            "type": "หาเสียง",
            "km": "-",
            "place": "- สนามกีฬาจังหวัด",
            "topic": "- พาผู้สมัครจับเบอร์ / แห่หาเสียง",
            "post": "https://www.facebook.com/natthaphong.ruengpanyawut/posts/pfbid02e3DY8cRL3GeD4pWVkseCqhXv5cTueB4oGRiGNfyXcDzu5P7gmzpjjbmdv4duDH6Hl"
        },
        {
            "date": "28/12/2024",
            "province": "สมุทรสาคร",
            "type": "หาเสียง",
            "km": "-",
            "place": "- ตลาดมหาชัย",
            "topic": "-",
            "post": "https://www.facebook.com/natthaphong.ruengpanyawut/posts/pfbid02qY446sC6pz5xXL2Fah1ZrMD3HGQKSXvnKacjFAx1ZV5nCcPsnP2E5copFS9iQfPTl"
        },
        {
            "date": "28/12/2024",
            "province": "สมุทรสงคราม",
            "type": "หาเสียง",
            "km": "-",
            "place": "- ตลาดแม่กลอง\n- ตลาดน้ำอัมพวา",
            "topic": "-",
            "post": "https://www.facebook.com/natthaphong.ruengpanyawut/posts/pfbid02qY446sC6pz5xXL2Fah1ZrMD3HGQKSXvnKacjFAx1ZV5nCcPsnP2E5copFS9iQfPTl"
        },
        {
            "date": "29/12/2024",
            "province": "ตาก",
            "type": "ททท.",
            "km": "4,530",
            "place": "- อ่างเก็บน้ำแม่ท้อ (เหมืองหิน)\n- กากแคดเมียม (บ่อ 4 บ่อ 5)\n- น้ำบาดาล / ประปา บ.มาบป่าแฝก",
            "topic": "- อ่างเก็บน้ำแม่ท้อ (เหมืองหิน)\n- กากแคดเมียม (บ่อ 4 บ่อ 5)\n- น้ำบาดาล / ประปา บ.มาบป่าแฝก",
            "post": "https://www.facebook.com/natthaphong.ruengpanyawut/posts/pfbid0kQta3WhbcKH8Rh7bXeSKPyK9jfekwT5Ejg798WF1qJp6ritEhgQ4gY3aAQrA97Ypl"
        },
        {
            "date": "30/12/2024",
            "province": "ตาก",
            "type": "ททท.",
            "km": "4,613",
            "place": "- ปีใหม่ม้ง\n- รพ.แม่สอด",
            "topic": "- อ.พบพระ (ปีใหม่ม้ง): ที่ดิน + ราคาพืชผล + กัญชง\n- รพ.แม่สอด: การระบาด อหิวาต์",
            "post": "https://www.facebook.com/natthaphong.ruengpanyawut/posts/pfbid02abFRJQk5e5t9pRjNs5PqmYMqZbFDqdKHKsUwxSfFE326kV2mYsBCDNxjeStHDtUEl"
        },
        {
            "date": "5/1/2025",
            "province": "เชียงใหม่",
            "type": "หาเสียง",
            "km": "-",
            "place": "- ตลาดประตูเชียงใหม่\n- The Brick (คุยวง Startup)",
            "topic": "- เดินแจกใบปลิวหาเสียง\n- เชียงใหม่ Silicon Valley",
            "post": "https://www.facebook.com/natthaphong.ruengpanyawut/posts/pfbid02hAPvmbtLNKTYC5WfdekKG6VWFNc3WihkaF3vbWXfa8KUXjZEY7ADKBC1PpuYRY2cl"
        },
        {
            "date": "5/1/2025",
            "province": "ลำพูน",
            "type": "หาเสียง",
            "km": "-",
            "place": "- น้ำลี้กัดเซาะตลิ่ง\n- วิสาหกิจ พืช ผัก ผลไม้\n- ตลาดนัดบ้านดอนหลวง",
            "topic": "- หาเสียง\n- การแปรรูป Freeze Dry\n- ปราศรัยอย่อย",
            "post": "https://www.facebook.com/natthaphong.ruengpanyawut/posts/pfbid02BpTy9E6YerEpdAH9ALiAVWx4SkoTkYenPhETBokPxK3Xk63uBShyUKLaBfuCeqMKl"
        },
        {
            "date": "11/1/2025",
            "province": "ตราด",
            "type": "หาเสียง",
            "km": "-",
            "place": "- บ้านท่าเรือจ้าง + แห่รถ",
            "topic": "- ประมง ค้าชายแดน เกษตร ท่องเที่ยว",
            "post": "https://www.facebook.com/natthaphong.ruengpanyawut/posts/pfbid0ZNAGezGNTQZkqyRUoEPSbc1AW1QJFBxesssUT2BnuEix8cRmuEEzZ6p6C8KHxy3El"
        },
        {
            "date": "12/1/2025",
            "province": "จันทบุรี",
            "type": "หาเสียง",
            "km": "-",
            "place": "- ตลาดน้ำพุ + ม.ศิริการ",
            "topic": "- ภัยแล้ง ช้างป่า ของดีเมืองจันท์",
            "post": "https://www.facebook.com/natthaphong.ruengpanyawut/posts/pfbid0Fmoy7Tn2hYKYmEVyQb2bv1VEEdkMFTrjoABTgu9uKj5o1fvtV8556wSB2YXZRZAzl"
        },
        {
            "date": "12/1/2025",
            "province": "ระยอง",
            "type": "หาเสียง",
            "km": "-",
            "place": "- อ.บ้านฉาง + ตลาดเทพจินดา + แห่รถ",
            "topic": "- นโยบายเชิงพื้นที่ 8 อำเภอ",
            "post": "https://www.facebook.com/natthaphong.ruengpanyawut/posts/pfbid02644pAqJ9BiP8nNG8PyCbtRYWEJiydAQUMuuz6gZvDpqoYLd7XaQpVfHtJyuP8KZal"
        },
        {
            "date": "12/1/2025",
            "province": "ชลบุรี",
            "type": "หาเสียง",
            "km": "-",
            "place": "- ตลาดนัดนินจา",
            "topic": "- ชลบุรี ดีกว่านี้ได้",
            "post": "https://www.facebook.com/natthaphong.ruengpanyawut/posts/pfbid028TrbbUzmLW23bCDa6nNhRiyg7fJwZRww6YtcXXS11ArxcuFqz5sn9zxuSuVSpMvil"
        },
        {
            "date": "18/1/2025",
            "province": "ลำพูน",
            "type": "หาเสียง",
            "km": "-",
            "place": "-ตลาดจตุจักรลำพูน",
            "topic": "-หน้าที่ของรัฐ\n-GDP\n-งบประมาณเกษตร สาธารณสุข",
            "post": "https://www.facebook.com/share/p/15aCZqP8ED/"
        },
        {
            "date": "18/1/2025",
            "province": "เชียงใหม่",
            "type": "หาเสียง",
            "km": "-",
            "place": "-ลานกิจกรรมประเสริฐแลนด์",
            "topic": "-หน้าที่ของรัฐ\n-GDP\n-งบประมาณเกษตร สาธารณสุข",
            "post": "https://www.facebook.com/share/p/15aCZqP8ED/"
        },
        {
            "date": "19/1/2025",
            "province": "เชียงใหม่",
            "type": "หาเสียง",
            "km": "-",
            "place": "-ตลาดนัดเจริญเจริญเมืองงาย\n-อ.พร้าว\n-อ.ฝาง",
            "topic": "-หาเสียง\n-นโยบาย 4 อยู่: อยู่ได้ อยู่ดี อยู่เย็น อยู่อย่างยั่งยืน",
            "post": "https://www.facebook.com/share/p/197odtKZxD/"
        },
        {
            "date": "25/1/2025",
            "province": "นนทบุรี",
            "type": "หาเสียง",
            "km": "-",
            "place": "-ตลาดหมู่บ้านบัวทอง  \n-ตลาดน้ำไทรน้อย \n-พื้นที่ บางกรวย-ไทรน้อย",
            "topic": "-pm 2.5\n-6 นโยบายเพื่อนนทบุรีที่ดีกว่าเดิม",
            "post": "https://www.facebook.com/share/p/181Kxrrd9M/"
        },
        {
            "date": "26/1/2025",
            "province": "สงขลา",
            "type": "หาเสียง",
            "km": "-",
            "place": "สถานีรถไฟหาดใหญ่",
            "topic": "-งบประมาฯของจังหวัด\n-นโยบาย",
            "post": "https://www.facebook.com/share/p/15axFape1i/"
        },
        {
            "date": "28/1/2025",
            "province": "มุกดาหาร",
            "type": "หาเสียง",
            "km": "-",
            "place": "-วัดศรีจอมพล บ้านห้วยทราย\n-หนองแฝก ข้างวัดโพธิ์ศรี \n-เวทีปราศรัย บริเวณที่ว่าการอำเภอเมืองมุกดาหาร",
            "topic": "-4 ปัญหา ดิน น้ำ แดน เที่ยว\n-ความสำคัญของ การเลือกตั้ง สอบจ.",
            "post": "https://www.facebook.com/share/p/1Gq1PdiJNA/"
        },
        {
            "date": "31/1/2025",
            "province": "สมุทรสงคราม",
            "type": "หาเสียง",
            "km": "-",
            "place": "แห่รถปราศัย อบต ท่าคา ตลาดน้ำอัมพวา",
            "topic": "นโยบายเพิ่มคุณภาพและราคาสินค้าเกษตร, แก้ปัญหาเรื่องน้ำท่วม, สาธารณสุขปลอดภัย ดูแลสุขภาพผู้สูงอาย พร้อมการเพิ่มพื้นที่สร้างสรรค์ให้ทุกคนเข้าถึง",
            "post": "https://www.facebook.com/share/p/19zUGSCpfY/"
        },
        {
            "date": "31/1/2025",
            "province": "สมุทรสาคร",
            "type": "หาเสียง",
            "km": "-",
            "place": "แห่รถปราศัย บ้านแพ้ว วัดยกกระบัตร",
            "topic": "-9นโยบาย 3กลุ่มพัฒนา คน เมือง ขับเคลื่อนจังหวัด",
            "post": "https://www.facebook.com/share/p/19vFuX78xe/"
        },
        {
            "date": "11/02/2025",
            "province": "ยะลา",
            "type": "ททท.",
            "km": "1,047",
            "place": "-ศอบต กอรมน\n-เทศบาลนครยะลา",
            "topic": "-",
            "post": "https://www.facebook.com/share/p/1QRjX69BVt/"
        },
        {
            "date": "12/02/2025",
            "province": "ปัตตานี",
            "type": "ททท.",
            "km": "1,040",
            "place": "Barahom\nPatani art space",
            "topic": "-",
            "post": "https://www.facebook.com/share/p/14puvhzxB1/"
        },
        {
            "date": "15/02/2025",
            "province": "อยุธยา",
            "type": "ททท.",
            "km": 119,
            "place": "บางบาล\nอำเภอท่าเรือ",
            "topic": "-follow up น้ำท่วม\n-ตลิ่งพัง",
            "post": "https://www.facebook.com/share/p/15giD9uzg9/"
        },
        {
            "date": "15/02/2025",
            "province": "ปทุมธานี",
            "type": "ททท.",
            "km": 42.2,
            "place": "วัดเจดีย์ทอง",
            "topic": "น้ำท่วม",
            "post": "https://www.facebook.com/share/p/15giD9uzg9/"
        },
        {
            "date": "22/02/2025",
            "province": "กาญจนบุรี",
            "type": "ททท.",
            "km": 375,
            "place": "ทองผาภูมิ\nสังขละบุรี",
            "topic": "ช้างป่า\nแนวกันไฟ",
            "post": "https://www.facebook.com/share/p/1DxS7MtifM/"
        }
    ])

    // Compute grouped data dynamically
    const groupedData = computed<Record<string, GroupedProvinceData>>(() => {
        // Sort mockupData by date before reducing
        const sortedData = [...mockupData.value].sort((a, b) => {
            const [dayA, monthA, yearA] = (a.date || "01/01/1970").split("/").map(Number);
            const [dayB, monthB, yearB] = (b.date || "01/01/1970").split("/").map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            return dateB.getTime() - dateA.getTime();
        });

        return sortedData.reduce<Record<string, GroupedProvinceData>>((acc, item) => {
            const province = item.province;

            // Ensure the province key exists in the accumulator
            if (!acc[province]) {
                acc[province] = {
                    visits: 0,
                    lastVisit: "",
                    actions: [],
                    posts: []
                };
            }

            // Increment visit count
            acc[province].visits += 1;

            // Update last visit date if applicable
            if (item.date && (!acc[province].lastVisit || new Date(item.date) > new Date(acc[province].lastVisit))) {
                acc[province].lastVisit = item.date;
            }
            
            // Add action type
            if (item.type && !acc[province].actions.includes(item.type)) {
                acc[province].actions.push(item.type);
            }
            if (item.post && !acc[province].posts.includes(item.post)) {
                acc[province].posts.push(item.post);
            }
            return acc;
        }, {});
    });

    return {
        mockupData,
        groupedData
    };
};