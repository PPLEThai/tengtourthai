const fs = require('fs');
const path = require('path');

// Mapping จากไฟล์ TypeScript
const mpImageMappings = [
  { thaiName: "ณัฐพงษ์_พิพัฒน์ไชยศิริ", englishName: "nattapong_pipatpaisiri" },
  { thaiName: "สรพัช_ศรีปราชญ์", englishName: "saraphat_sriprach" },
  { thaiName: "ศิรสิทธิ์_สงนุ้ย", englishName: "sirisit_sangnui" },
  { thaiName: "ศิริโรจน์_ธนิกกุล", englishName: "siriroj_thanikkul" },
  { thaiName: "ณัฐพงษ์_สุมโนธรรม", englishName: "nattapong_sumnotham" },
  { thaiName: "อานุภาพ_ลิขิตอำนวยชัย", englishName: "anupap_likitamnuaychai" },
  { thaiName: "ตรัยวรรธน์_อิ่มใจ", englishName: "traiwat_imjai" },
  { thaiName: "บุญเลิศ_แสงพันธุ์", englishName: "bunlert_saengphan" },
  { thaiName: "วีรภัทร_คันธะ", englishName: "wirapat_kantha" },
  { thaiName: "นิตยา_มีศรี", englishName: "nittaya_misri" },
  { thaiName: "วุฒินันท์_บุญชู", englishName: "wuttinan_bunchu" },
  { thaiName: "พิชัย_แจ้งจรรยาวงศ์", englishName: "pichai_chaengjanyawong" },
  { thaiName: "รัชนก_สุขประเสริฐ", englishName: "ratchanok_sukprasert" },
  { thaiName: "พนิดา_มงคลสวัสดิ์", englishName: "panida_mongkolsawat" },
  { thaiName: "วิทวิสิทธิ์_ปันสวนปลูก", englishName: "witwisit_pansuanpluk" },
  { thaiName: "รภัสสรณ์_นิยะโมสถ", englishName: "raphatsorn_niyamot" },
  { thaiName: "ชลธานี_เชื้อน้อย", englishName: "chonthani_chueanoi" },
  { thaiName: "ทิพา_ปวีณาเสถียร", englishName: "thipa_pawina_sathian" },
  { thaiName: "สาธิต_ทวีผล", englishName: "sathit_thawiphon" },
  { thaiName: "สว่างจิตต์_เลาหะโรจนพันธ์", englishName: "sawangjit_laoharojanphan" },
  { thaiName: "ชุติพงศ์_พิภพภิญโญ", englishName: "chutiphong_pipphaphinnyo" },
  { thaiName: "พงศธร_ศรเพชรนรินทร์", englishName: "pongsathon_sornphetnarint" },
  { thaiName: "กฤช_ศิลปชัย", englishName: "krit_sinlapachai" },
  { thaiName: "กมนทรรศน์_กิตติสุนทรสกุล", englishName: "komonthot_kittisunthornsakul" },
  { thaiName: "ณกร_ชารีพันธ์", englishName: "nakorn_chareephan" },
  { thaiName: "ฐิติกันต์_ฐิติพฤฒิกุล", englishName: "thitikan_thitiphrutthikul" },
  { thaiName: "เฉลิมพงศ์_แสงดี", englishName: "chaloemphong_saengdi" },
  { thaiName: "สมชาติ_เตชถาวรเจริญ", englishName: "somchat_techathaworncharoen" },
  { thaiName: "ศุภปกรณ์_กิตยาธิคุณ", englishName: "suppakorn_kittayathikun" },
  { thaiName: "ชริน_วงศ์พันธ์เที่ยง", englishName: "charin_wongphanthiang" },
  { thaiName: "ทวิวงศ์_โตทวิวงศ์", englishName: "thawiwong_tothawiwong" },
  { thaiName: "ประสิทธิ์_ปัทมผดุงศักดิ์", englishName: "prasit_patamphadungsak" },
  { thaiName: "เชตวัน_เตือประโคน", englishName: "chetawan_tueaprakhon" },
  { thaiName: "สกล_สุนทรวาณิชย์กิจ", englishName: "sakon_sunthrawanitchakit" },
  { thaiName: "ชลธิชา_แจ้งเร็ว", englishName: "chonthicha_chaengreo" },
  { thaiName: "เจษฎา_ดนตรีเสนาะ", englishName: "chetsada_dontrisenor" },
  { thaiName: "สรวีย์_ศุภปณิตา", englishName: "sarawit_suppanita" },
  { thaiName: "นนท์_ไพศาลลิ้มเจริญกิจ", englishName: "non_phaisan_limcharoenkit" },
  { thaiName: "เกียรติคุณ_ต้นยาง", englishName: "kiattikhun_tonyang" },
  { thaiName: "คุณากร_มั่นนทีรัย", englishName: "khunakorn_manneethai" },
  { thaiName: "ปรีติ_เจริญศิลป์", englishName: "priti_charoensin" },
  { thaiName: "นพดล_ทิพยชล", englishName: "nopadon_thipayachon" },
  { thaiName: "อนุสรณ์_แก้ววิเชียร", englishName: "anusorn_kaewwichian" },
  { thaiName: "ปัญญารัตน์_นันทภูษิตานนท์", englishName: "panyarat_nanthaphusitanon" },
  { thaiName: "สุรพันธ์_ไวยากรณ์", englishName: "suraphan_waiyakon" },
  { thaiName: "กฤษฐ์หิรัญ_เลิศอุฤทธิ์ภักดี", englishName: "kritthiran_loeturutthipakdi" },
  { thaiName: "ศุทธสิทธิ์_พจน์ฐศักดิ์", englishName: "sutthasit_phonthasak" },
  { thaiName: "ปิยชาติ_รุจิพรวศิน", englishName: "piyachat_ruchipornwasin" },
  { thaiName: "ฉัตร_สุภัทรวณิชย์", englishName: "chat_supatrawanich" },
  { thaiName: "ชิษณุพงศ์_ตั้งเมธากุล", englishName: "chisanupong_tangmethakul" },
  { thaiName: "กิตติภณ_ปานพรหมมาศ", englishName: "kittipan_panphrommas" },
  { thaiName: "รัชต์พงศ์_สร้อยสุวรรณ", englishName: "ratchaphong_soisuwan" },
  { thaiName: "คริษฐ์_ปานเนียม", englishName: "krit_panniiam" },
  { thaiName: "ศักดินัย_นุ่มหนู", englishName: "sakdinan_numnu" },
  { thaiName: "ภัทรพงษ์_ลีลาภัทร์", englishName: "pattaraphong_leelaphat" },
  { thaiName: "สมดุลย์_อุตเจริญ", englishName: "somdun_utcharoen" },
  { thaiName: "อรพรรณ_จันตาเรือง", englishName: "oraphan_chantareung" },
  { thaiName: "พุธิตา_ชัยอนันต์", englishName: "phuthita_chai-anan" },
  { thaiName: "ณัฐพล_โตวิจักษณ์ชัยกุล", englishName: "nattaphon_towijakchaikul" },
  { thaiName: "การณิก_จันทดา", englishName: "karannik_chanthada" },
  { thaiName: "เพชรรัตน์_ใหม่ชมภู", englishName: "phetcharat_maichomphu" },
  { thaiName: "จุฬาลักษณ์_ขันสุธรรม", englishName: "chulalak_khansutham" },
  { thaiName: "ฐากูร_ยะแสง", englishName: "thakun_yasaeng" },
  { thaiName: "ชิตวัน_ชินอนุวัฒน์", englishName: "chitwan_chin-anuwat" },
  { thaiName: "ยอดชาย_พึ่งพร", englishName: "yotchai_phuengphon" },
  { thaiName: "จรัส_คุ้มไข่น้ำ", englishName: "charat_khumkhainam" },
  { thaiName: "สหัสวัต_คุ้มคง", englishName: "sahasawat_khumkhong" },
  { thaiName: "ชวาล_พลเมืองดี", englishName: "chawal_phonmuangdi" },
  { thaiName: "วรรณิดา_นพสิทธิ์", englishName: "wannida_nophasit" },
  { thaiName: "วรท_ศิริรักษ์", englishName: "worath_sirirak" },
  { thaiName: "จิรัฏฐ์_ทองสุวรรณ์", englishName: "jirath_thongsuwan" },
  { thaiName: "ญาณธิชา_บัวเผื่อน", englishName: "yannathicha_buapheuan" },
  { thaiName: "ปรัชญาวรรณ_ไชยสืบ", englishName: "prachayawan_chaiseup" },
  { thaiName: "วรายุทธ_ทองสุข", englishName: "worayut_thongsuk" },
  { thaiName: "ชัชวาล_อภิรักษ์มั่นคง", englishName: "chatchawan_aphirak_mankhong" },
  { thaiName: "อิทธิพล_ชลธราศิริ", englishName: "itthiphon_chontharasiri" },
  { thaiName: "วีรนันท์_ฮวดศรี", englishName: "wiranan_huatsri" },
  { thaiName: "พงศ์พันธ์_ยอดเมืองเจริญ", englishName: "pongphan_yotmuangcharoen" },
  { thaiName: "ปวิตรา_จิตตกิจ", englishName: "pawitra_chittakit" },
  { thaiName: "สิริน_สงวนสิน", englishName: "sirin_songwonsin" },
  { thaiName: "ธัญธร_ธนินวัฒนาธร", englishName: "thanthon_thaninwattanathorn" },
  { thaiName: "ทิสรัตน์_เลาหพล", englishName: "thisarat_laohaphon" },
  { thaiName: "รักชนก_ศรีนอก", englishName: "rakchanok_srinok" },
  { thaiName: "ณัฐชา_บุญไชยอินสวัสดิ์", englishName: "natcha_bunchai_insawat" },
  { thaiName: "แอนศิริ_วลัยกนก", englishName: "aensiri_walaikanok" },
  { thaiName: "เท่าพิภพ_ลิ้มจิตรกร", englishName: "thaophiphop_limchitrakorn" },
  { thaiName: "ปิยรัฐ_จงเทพ", englishName: "piyarat_chongthep" },
  { thaiName: "สุภกร_ตันติไพบูลย์ธนะ", englishName: "suphakon_tantiphaiboonthana" },
  { thaiName: "ณัฐพงศ์_เปรมพูลสวัสดิ์", englishName: "nattaphong_prempoonsawat" },
  { thaiName: "กันต์พงษ์_ประยูรศักดิ์", englishName: "kanphong_prayoonsak" },
  { thaiName: "ธีรัจชัย_พันธุมาศ", englishName: "thirachai_panthumas" },
  { thaiName: "วีรวุธ_รักเที่ยง", englishName: "wirawut_rakthiang" },
  { thaiName: "พิมพ์กาญจน์_กีรติวิราปกรณ์", englishName: "phimkan_kirawirapakorn" },
  { thaiName: "วิทวัส_ติชะวาณิชย์", englishName: "witwat_tichawanich" },
  { thaiName: "สิริลภัส_กองตระการ", englishName: "sirilapas_kongtrakan" },
  { thaiName: "ธนเดช_เพ็งสุข", englishName: "thanadech_phengsook" },
  { thaiName: "ภูริวรรธก์_ใจสำราญ", englishName: "phuriwat_chaisamran" },
  { thaiName: "ศศินันท์_ธรรมนิฐินันท์", englishName: "sasinun_thamnithinan" },
  { thaiName: "เอกราช_อุดมอำนวย", englishName: "ekkarat_udom-amnuay" },
  { thaiName: "ศุภณัฐ_มีนชัยนันท์", englishName: "suppanat_minchainan" }
];

const mpImagesDir = path.join(__dirname, '../public/images/mp');

function renameMPImages() {  
  // ตรวจสอบว่าโฟลเดอร์มีอยู่หรือไม่
  if (!fs.existsSync(mpImagesDir)) {
    console.error('ไม่พบโฟลเดอร์:', mpImagesDir);
    return;
  }

  // อ่านไฟล์ทั้งหมดในโฟลเดอร์
  const files = fs.readdirSync(mpImagesDir);
  let renamedCount = 0;
  let errorCount = 0;

  files.forEach(file => {
    if (file.endsWith('.png')) {
      const thaiName = file.replace('.png', '');
      const mapping = mpImageMappings.find(m => m.thaiName === thaiName);
      
      if (mapping) {
        const oldPath = path.join(mpImagesDir, file);
        const newPath = path.join(mpImagesDir, `${mapping.englishName}.png`);
        
        try {
          // ตรวจสอบว่าไฟล์ใหม่มีอยู่แล้วหรือไม่
          if (fs.existsSync(newPath)) {
            console.log(`⚠️  ไฟล์ ${mapping.englishName}.png มีอยู่แล้ว ข้ามการเปลี่ยนชื่อ ${file}`);
            return;
          }
          
          fs.renameSync(oldPath, newPath);
          // console.log(`✅ เปลี่ยนชื่อ: ${file} → ${mapping.englishName}.png`);
          renamedCount++;
        } catch (error) {
          console.error(`❌ เกิดข้อผิดพลาดในการเปลี่ยนชื่อ ${file}:`, error.message);
          errorCount++;
        }
      } else {
        console.log(`⚠️  ไม่พบ mapping สำหรับ: ${file}`);
      }
    }
  });

  console.log(`\nสรุปผลการทำงาน:`);
  console.log(`✅ เปลี่ยนชื่อสำเร็จ: ${renamedCount} ไฟล์`);
  console.log(`❌ เกิดข้อผิดพลาด: ${errorCount} ไฟล์`);
  console.log(`\nการเปลี่ยนชื่อเสร็จสิ้นแล้ว!`);
}

// รันฟังก์ชัน
renameMPImages(); 