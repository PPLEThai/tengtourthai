![Node.js](https://img.shields.io/badge/Node.js-v20.18.1+-green.svg)

# เว็บไซต์ติดตามภารกิจพรรคประชาชน

เว็บไซต์ที่ติดตามและบันทึกภารกิจการเข้าพื้นที่ขององคาพยพพรรคประชาชน เพื่อถ่ายทอดเนื้อหาสาระที่พบเจอทั่วประเทศไทย

![เท้งทั่วไทย](https://tengtourthai.vercel.app/images/thumbnail-teng.png)

## เท้งทั่วไทย
"เท้งทั่วไทย" เป็นบันทึกการเดินทางทั่วประเทศของ ณัฐพงษ์ เรืองปัญญาวุฒิ หัวหน้าพรรคประชาชน ที่มุ่งเน้นการสร้างความเข้าใจและการมีส่วนร่วมในทุกพื้นที่

## ส้มทั่วไทย
"ส้มทั่วไทย" แสดงถึงการเข้าพื้นที่ของทุกองคาพยพของพรรคประชาชน ไม่ว่าจะเป็นผู้ดำรงตำแหน่งทางการเมือง เช่น ส.ส., ส.ก., ส.อบจ. รวมถึงผู้ช่วย คณะทำงานจังหวัด และสมาชิกพรรคที่ร่วมขับเคลื่อนในเชิงประเด็น

## ขอบคุณผู้ร่วมออกแบบ UX/UI และ Dev อาสา
ขอขอบคุณอาสาจากกลุ่ม ก้าวGeek ได้แก่ คุณฟอร์ด คุณโน๊ต คุณมุก คุณฝ้าย คุณชม และทีมงานอาสาจาก [ก้าวGeek Discord](https://discord.gg/dpPrJ5sdtU) ทุกท่าน @FRD @jojoe @Chom @spy @Riff way @mukkaew @Packrrrrr @cerzzlive (โน้ต) @PanJ  @มาร์ท เอกภพ @Nu'tip ที่มีส่วนร่วมในการออกแบบ UX/UI และระบบของเว็บไซต์นี้

## สิทธิ์การใช้งาน (License)
ชุดโค้ดนี้เป็นสาธารณสมบัติ (Public Domain) ซึ่งหมายความว่าไม่มีลิขสิทธิ์ใดๆ ทั้งสิ้น คุณสามารถใช้งาน คัดลอก ดัดแปลง เผยแพร่ หรือทำอะไรก็ได้กับซอฟต์แวร์นี้โดยไม่มีข้อจำกัด ไม่จำเป็นต้องขออนุญาตหรืออ้างอิงแหล่งที่มา

เราได้สละสิทธิ์ทั้งหมดในงานนี้ทั่วโลกภายใต้กฎหมายลิขสิทธิ์ รวมถึงสิทธิ์ข้างเคียงและสิทธิ์ที่เกี่ยวข้องเท่าที่กฎหมายอนุญาต

## License
This code is released into the Public Domain, which means it has no copyright restrictions whatsoever. You are free to use, copy, modify, distribute, or do anything with this software without limitations. No permission or attribution is required.

We have waived all rights to this work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law.

# Teng Tour Thai Frontend

เว็บไซต์ติดตามการเดินทางของหัวหน้าพรรคประชาชน

## การติดตั้ง

```bash
npm install
```

## การตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลักของโปรเจค และเพิ่มค่าต่อไปนี้:

```env
# GraphQL API Configuration
GRAPHQL_API_TOKEN=your_access_token_here
GRAPHQL_API_URL=

# API Teng Data (ถ้ามี)
API_TENG_DATA=your_api_teng_data_url
```

### คำอธิบาย Environment Variables

- `GRAPHQL_API_TOKEN`: Token สำหรับการเข้าถึง GraphQL API
- `GRAPHQL_API_URL`: URL ของ GraphQL API (default: )
- `API_TENG_DATA`: URL สำหรับข้อมูลการเดินทางของเท้ง (ถ้ามี)

## การรันโปรเจค

```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## โครงสร้างโปรเจค

- `pages/mp/[name].vue` - หน้าแสดงข้อมูล MP แต่ละคน
- `composables/useGraphQL.ts` - Composable สำหรับเรียก GraphQL API
- `composables/useMPData.ts` - Composable สำหรับข้อมูล MP
- `composables/useKaitomMP.ts` - Composable สำหรับข้อมูล Kaitom MP
