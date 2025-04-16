// Taiwan Pickleball Courts Data
const pickleballCourts = [
  // Taipei, Keelung, Yilan (Image 3)
  { id: 1, city: "基隆市", name: "培德小", address: "", hours: "三 18:00-21:00 五 18:00-21:00", indoor: "風雨", fee: "是", notes: "", lat: 25.1276, lng: 121.7391 },
  { id: 2, city: "宜蘭縣", name: "宜蘭大學體育館", address: "", hours: "六 09:00-12:00", indoor: "室內", fee: "是", notes: "", lat: 24.7507, lng: 121.7532 },
  { id: 3, city: "宜蘭縣", name: "宜蘭運動公園", address: "", hours: "未知", indoor: "風雨", fee: "未知", notes: "", lat: 24.7566, lng: 121.7533 },
  { id: 4, city: "宜蘭縣", name: "羅東運動公園", address: "", hours: "未知", indoor: "風雨", fee: "未知", notes: "", lat: 24.6780, lng: 121.7745 },
  { id: 5, city: "宜蘭縣", name: "頭城國中體育館", address: "", hours: "未知", indoor: "室內", fee: "未知", notes: "", lat: 24.8594, lng: 121.8227 },
  { id: 6, city: "台北市中山區", name: "濱江國小", address: "", hours: "四 19:00-21:00", indoor: "室內", fee: "是", notes: "有新手友會", lat: 25.0730, lng: 121.5429 },
  { id: 7, city: "台北市中山區", name: "長安國小", address: "", hours: "日 14:00-16:00", indoor: "室內", fee: "是", notes: "", lat: 25.0520, lng: 121.5339 },
  { id: 8, city: "台北市中正區", name: "東門國小", address: "", hours: "一 19:00-21:00", indoor: "室內", fee: "是", notes: "有新手友會", lat: 25.0341, lng: 121.5284 },
  { id: 9, city: "台北市信義區", name: "信義國小", address: "", hours: "日 非固定時段", indoor: "室內", fee: "是", notes: "", lat: 25.0326, lng: 121.5677 },
  { id: 10, city: "台北市信義區", name: "信義國小", address: "", hours: "六 14:30-16:30", indoor: "室內", fee: "是", notes: "有新手體驗, 自費教練課", lat: 25.0326, lng: 121.5677 },
  { id: 11, city: "台北市信義區", name: "信義運動中心", address: "", hours: "五 13:00-17:00", indoor: "室內", fee: "是", notes: "有新手體驗, 自費教練課", lat: 25.0326, lng: 121.5677 },
  { id: 12, city: "台北市信義區", name: "永吉國中", address: "", hours: "三 19:30-21:30", indoor: "室內", fee: "是", notes: "", lat: 25.0410, lng: 121.5764 },
  { id: 13, city: "台北市信義區", name: "永吉高中", address: "", hours: "四 19:30-21:30 五 18:30-20:30", indoor: "室內", fee: "是", notes: "週四有自費教練課", lat: 25.0410, lng: 121.5764 },
  { id: 14, city: "台北市內湖區", name: "南湖國小", address: "", hours: "二 19:00-21:00 日 18:00-22:00", indoor: "室內", fee: "是", notes: "有新手友會, 新手教學", lat: 25.0671, lng: 121.5942 },
  { id: 15, city: "台北市內湖區", name: "可否克內湖球俱樂部", address: "", hours: "12:00-22:00", indoor: "室內", fee: "是", notes: "", lat: 25.0671, lng: 121.5942 },
  
  // More entries from Image 3 (Taipei)
  { id: 16, city: "台北市內湖區", name: "安泰里活動中心", address: "", hours: "一、五 12:00-15:00 日18:00-22:00", indoor: "室內", fee: "是", notes: "", lat: 25.0671, lng: 121.5942 },
  { id: 17, city: "台北市內湖區", name: "明湖國小", address: "", hours: "六 10:00-12:30", indoor: "室內", fee: "是", notes: "", lat: 25.0671, lng: 121.5942 },
  { id: 18, city: "台北市內湖區", name: "明湖國中", address: "", hours: "二 19:00-21:00", indoor: "室內", fee: "是", notes: "", lat: 25.0671, lng: 121.5942 },
  { id: 19, city: "台北市內湖區", name: "潭美國小", address: "", hours: "六 13:30-16:00", indoor: "室內", fee: "是", notes: "", lat: 25.0671, lng: 121.5942 },
  
  // New Taipei, Taoyuan, Hsinchu (Image 2)
  { id: 41, city: "新北市三峽區", name: "輕鬆羽球俱樂部", address: "", hours: "二 9-12 五 14-17 日 18-21", indoor: "室內", fee: "是", notes: "", lat: 24.9347, lng: 121.3692 },
  { id: 42, city: "新北市三重區", name: "三重國民運動中心", address: "", hours: "一、四 13:00-16:00", indoor: "室內", fee: "是", notes: "", lat: 25.0724, lng: 121.4889 },
  { id: 43, city: "新北市三重區", name: "光興國小", address: "", hours: "日 09:30-11:30", indoor: "室內", fee: "是", notes: "", lat: 25.0724, lng: 121.4889 },
  
  // Taichung, Changhua, Nantou, Yunlin, Chiayi, Tainan, Kaohsiung, Pingtung, Hualien (Image 1)
  { id: 74, city: "台中市", name: "CXS羽毛球雅蘭館", address: "", hours: "六 12:00-15:00 日 14:00-17:00", indoor: "室內", fee: "是", notes: "DUPR比賽", lat: 24.1477, lng: 120.6736 },
  { id: 75, city: "台中市", name: "大莊區文昌路二段770號附近", address: "大莊區文昌路二段770號附近", hours: "全天", indoor: "室外", fee: "否", notes: "", lat: 24.1477, lng: 120.6736 },
  { id: 76, city: "台中市", name: "國際網球中心", address: "", hours: "三、五 19:00-21:00", indoor: "室外", fee: "是", notes: "", lat: 24.1477, lng: 120.6736 },
  
  // Add more entries as needed
];

// Extract unique cities for the filter dropdown
const cities = [...new Set(pickleballCourts.map(court => court.city.split('市')[0].split('縣')[0].split('區')[0]))];