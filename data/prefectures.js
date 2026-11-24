// 日本全47都道府縣官方地理、人口與經濟數據（適用大學一年級日本地理課程）
// 人口來源：日本總務省統計局「人口推計」（2024年10月1日現在，全國1億2,380.2萬人）
// GDP來源：日本內閣府「縣民經濟計算」（最新全國統一確報基準，名目縣內總生產，單位：億日圓）

window.JP_REGIONS = {
  hokkaido: {
    id: 'hokkaido',
    name: '北海道地方',
    short: '北海道',
    emoji: '⛄',
    desc: '日本最北端與面積最大單一行政區，亞寒帶氣候、酪農業與雪國觀光聞名。',
    baseColor: '#CBEBFF',
    pinColor: '#2E9CF5',
    badgeBg: '#E1F3FF',
    badgeText: '#1A5F9E'
  },
  tohoku: {
    id: 'tohoku',
    name: '東北地方',
    short: '東北',
    emoji: '🌸',
    desc: '奧羽山脈縱貫本州北部，東西氣候分明，為日本重要稻米產區與溫泉寶庫。',
    baseColor: '#FFD6E4',
    pinColor: '#EC4899',
    badgeBg: '#FFE8F1',
    badgeText: '#A62163'
  },
  kanto: {
    id: 'kanto',
    name: '關東地方',
    short: '關東',
    emoji: '🗼',
    desc: '日本最大關東平原所在，首都圈高度集中全國逾三成人口與經濟產值。',
    baseColor: '#FFD4C2',
    pinColor: '#F97316',
    badgeBg: '#FFECE2',
    badgeText: '#B4450E'
  },
  chubu: {
    id: 'chubu',
    name: '中部地方',
    short: '中部',
    emoji: '🗻',
    desc: '涵蓋北陸、中央高地與東海三區，擁有日本阿爾卑斯、富士山與中京工業地帶。',
    baseColor: '#FFF0B5',
    pinColor: '#D99100',
    badgeBg: '#FFF7D6',
    badgeText: '#925B00'
  },
  kansai: {
    id: 'kansai',
    name: '近畿（關西）',
    short: '近畿',
    emoji: '⛩️',
    desc: '千年古都京都、奈良與商業重鎮大阪、神戶雲集，日本歷史文化核心。',
    baseColor: '#C7F2D9',
    pinColor: '#16A36A',
    badgeBg: '#E0F9EA',
    badgeText: '#146C48'
  },
  chugoku: {
    id: 'chugoku',
    name: '中國地方',
    short: '中國',
    emoji: '🍁',
    desc: '以中國山地分為北側山陰（多雪）與南側山陽（瀨戶內海少雨晴朗工業帶）。',
    baseColor: '#DFD3FF',
    pinColor: '#8B5CF6',
    badgeBg: '#EFE9FF',
    badgeText: '#5A32B8'
  },
  shikoku: {
    id: 'shikoku',
    name: '四國地方',
    short: '四國',
    emoji: '🍊',
    desc: '由瀨戶大橋等三條跨海通道連結本州，以四國遍路、讚岐烏龍與柑橘農業著稱。',
    baseColor: '#FFE2B5',
    pinColor: '#EA6B1F',
    badgeBg: '#FFF0D9',
    badgeText: '#A3420A'
  },
  kyushu: {
    id: 'kyushu',
    name: '九州・沖繩',
    short: '九州沖繩',
    emoji: '🌋',
    desc: '火山溫泉密布的「火之國」與熱帶琉球群島，近年躍升為日本「矽島」半導體重鎮。',
    baseColor: '#FFC9D4',
    pinColor: '#E11D48',
    badgeBg: '#FFE6EC',
    badgeText: '#9F1239'
  }
};

window.PREFECTURES = [
  {
    code: 'JP-01', fullName: '北海道', shortName: '北海道', kana: 'ほっかいどう', type: '道',
    oldProvince: '蝦夷地', capital: '札幌市', capitalDiffers: true, region: 'hokkaido',
    population: 504.3, gdp: 208893,
    terrain: '亞寒帶氣候（石狩平原、大雪山系、無梅雨季）',
    nameOrigin: '明治二年由探險家松浦武四郎提案改名「北海道」，日本唯一的「道」。',
    geoNote: '面積佔全日本約22%居冠！受亞寒帶氣候影響幾乎無梅雨，石狩平原與十勝平原是日本糧倉與酪農王國。',
    icon: '⛄', color: '#C6E9FF', coordsText: '43.06°N, 141.35°E'
  },
  {
    code: 'JP-02', fullName: '青森縣', shortName: '青森', kana: 'あおもりけん', type: '縣',
    oldProvince: '陸奧', capital: '青森市', capitalDiffers: false, region: 'tohoku',
    population: 116.5, gdp: 44391,
    terrain: '本州最北端（津輕半島、下北半島、十和田湖）',
    nameOrigin: '源自江戶時代開港時海濱茂密常綠的「青之森」松林地標。',
    geoNote: '三面環海（津輕海峽、日本海、太平洋），青函隧道連結北海道，蘋果產量佔全日本逾半穩居第一！',
    icon: '🍎', color: '#FFD2E2', coordsText: '40.82°N, 140.74°E'
  },
  {
    code: 'JP-03', fullName: '岩手縣', shortName: '岩手', kana: 'いわてけん', type: '縣',
    oldProvince: '陸中', capital: '盛岡市', capitalDiffers: true, region: 'tohoku',
    population: 114.5, gdp: 47971,
    terrain: '太平洋側氣候（北上高地、三陸谷灣海岸）',
    nameOrigin: '相傳盛岡三石神社巨岩留有鬼的手印（岩之手），故名「岩手」。',
    geoNote: '面積僅次於北海道為全日本第二大（縣級第一）！東部三陸海岸是教科書級的典型「谷灣式（Ria）海岸」。',
    icon: '🍜', color: '#FFE0EB', coordsText: '39.70°N, 141.15°E'
  },
  {
    code: 'JP-04', fullName: '宮城縣', shortName: '宮城', kana: 'みやぎけん', type: '縣',
    oldProvince: '陸前', capital: '仙台市', capitalDiffers: true, region: 'tohoku',
    population: 224.8, gdp: 96147,
    terrain: '太平洋側氣候（仙台平原、松島灣）',
    nameOrigin: '得名於古代多賀城一帶的「宮城郡」，中心仙台由伊達政宗建城。',
    geoNote: '東北地方唯一擁有政令指定都市（仙台）的縣，經濟與人口穩居東北第一，並擁有日本三景之一「松島」。',
    icon: '🎋', color: '#FFC7DC', coordsText: '38.27°N, 140.87°E'
  },
  {
    code: 'JP-05', fullName: '秋田縣', shortName: '秋田', kana: 'あきたけん', type: '縣',
    oldProvince: '羽後', capital: '秋田市', capitalDiffers: false, region: 'tohoku',
    population: 89.7, gdp: 36293,
    terrain: '日本海側氣候（秋田平原、田澤湖、白神山地）',
    nameOrigin: '古代稱為「齶田（あぎた）」，後轉寫為豐收意象的「秋田」。',
    geoNote: '冬季受西北季風影響多雪，擁有日本最深湖泊「田澤湖」（423.4米）與世界遺產白神山地，高齡化率亦居全國首位。',
    icon: '🐕', color: '#FFDAE8', coordsText: '39.72°N, 140.10°E'
  },
  {
    code: 'JP-06', fullName: '山形縣', shortName: '山形', kana: 'やまがたけん', type: '縣',
    oldProvince: '羽前', capital: '山形市', capitalDiffers: false, region: 'tohoku',
    population: 101.1, gdp: 43404,
    terrain: '日本海側氣候（最上川流域、山形盆地與庄內平原）',
    nameOrigin: '取「依山之形」建城之意，全縣四個主要盆地皆由最上川串聯。',
    geoNote: '全縣35個市町村皆有溫泉湧出，號稱「溫泉王國」，並盛產全日本約七成的櫻桃，藏王樹冰聞名全球。',
    icon: '🍒', color: '#FFCCE0', coordsText: '38.24°N, 140.36°E'
  },
  {
    code: 'JP-07', fullName: '福島縣', shortName: '福島', kana: 'ふくしまけん', type: '縣',
    oldProvince: '磐城・岩代', capital: '福島市', capitalDiffers: false, region: 'tohoku',
    population: 174.3, gdp: 78650,
    terrain: '三大縱向地帶（濱通沿海、中通盆地、會津豪雪區）',
    nameOrigin: '古稱信夫郡杉妻，戰國後改稱「福島」，寓意幸福之島。',
    geoNote: '面積居全日本第三！因山地阻隔自然形成濱通、中通、會津三大文化與氣候截然不同的地理帶，並擁有豬苗代湖。',
    icon: '🍑', color: '#FFE3EE', coordsText: '37.75°N, 140.47°E'
  },
  {
    code: 'JP-08', fullName: '茨城縣', shortName: '茨城', kana: 'いばらきけん', type: '縣',
    oldProvince: '常陸', capital: '水戶市', capitalDiffers: true, region: 'kanto',
    population: 280.6, gdp: 145856,
    terrain: '太平洋側氣候（關東平原東北部、霞浦湖）',
    nameOrigin: '見於《常陸國風土記》，傳說以荊棘（茨）築城防禦而得名。',
    geoNote: '擁有日本第二大湖「霞浦」，筑波科學城聚集眾多國家級科研機構，鹿島臨海工業地帶與首都圈近郊農業均極發達。',
    icon: '🔬', color: '#FFD9C7', coordsText: '36.34°N, 140.45°E'
  },
  {
    code: 'JP-09', fullName: '栃木縣', shortName: '栃木', kana: 'とちぎけん', type: '縣',
    oldProvince: '下野', capital: '宇都宮市', capitalDiffers: true, region: 'kanto',
    population: 188.5, gdp: 95962,
    terrain: '內陸性太平洋氣候（那須連山、關東平原北緣）',
    nameOrigin: '因古代神社建築屋頂的「千木（ちぎ）」眾多而演化為「栃木」。',
    geoNote: '內陸縣份，擁有世界遺產日光東照宮與華嚴瀑布；草莓產量長年全日本第一，宇都宮則是著名的餃子之都。',
    icon: '🍓', color: '#FFE3D4', coordsText: '36.57°N, 139.88°E'
  },
  {
    code: 'JP-10', fullName: '群馬縣', shortName: '群馬', kana: 'ぐんまけん', type: '縣',
    oldProvince: '上野', capital: '前橋市', capitalDiffers: true, region: 'kanto',
    population: 189.0, gdp: 97620,
    terrain: '內陸山地與關東平原西北緣（赤城山、利根川上游）',
    nameOrigin: '古代朝廷於此設置官營牧馬場「車郡」，後雅化為「群馬」。',
    geoNote: '坐擁草津、伊香保等日本頂級溫泉，冬季受乾冷焚風「空風（からっ風）」吹拂日照充足，為重要高麗菜產地與汽車製造基地。',
    icon: '♨️', color: '#FFCEBA', coordsText: '36.39°N, 139.06°E'
  },
  {
    code: 'JP-11', fullName: '埼玉縣', shortName: '埼玉', kana: 'さいたまけん', type: '縣',
    oldProvince: '武藏', capital: '埼玉市', capitalDiffers: false, region: 'kanto',
    population: 733.2, gdp: 246656,
    terrain: '內陸平原為主（關東平原中西部、荒川流域）',
    nameOrigin: '源自古行田地區的「前玉（さきたま）」郡名，意為幸福之魂。',
    geoNote: '全國人口第5大縣，也是近年極少數仍維持人口正成長的地區！作為東京北側重要衛星城，快晴日數名列日本前茅。',
    icon: '🚆', color: '#FFD6C2', coordsText: '35.86°N, 139.65°E'
  },
  {
    code: 'JP-12', fullName: '千葉縣', shortName: '千葉', kana: 'ちばけん', type: '縣',
    oldProvince: '下總・上總・安房', capital: '千葉市', capitalDiffers: false, region: 'kanto',
    population: 625.1, gdp: 214143,
    terrain: '太平洋側海洋性氣候（房總半島、利根川下游）',
    nameOrigin: '源自古代豪族千葉氏，意為草木繁茂如「千葉」之土。',
    geoNote: '受黑潮暖流調節冬季溫和，是全國平均海拔最低的平緩縣份之一；坐擁成田國際機場與京葉工業地域。',
    icon: '✈️', color: '#FFC8B0', coordsText: '35.60°N, 140.12°E'
  },
  {
    code: 'JP-13', fullName: '東京都', shortName: '東京', kana: 'とうきょうと', type: '都',
    oldProvince: '武藏', capital: '新宿區（東京都廳）', capitalDiffers: true, region: 'kanto',
    population: 1417.8, gdp: 1202199,
    terrain: '太平洋側氣候（武藏野台地、東京灣低地、西部多摩山地）',
    nameOrigin: '1868年將幕府所在地江戶更名為「東京」（意為東方之京），日本唯一的「都」。',
    geoNote: '人口（1,417.8萬）與GDP（逾120兆日圓，佔全國約兩成）雙料壓倒性第一！是研究「東京一極集中」城市地理的核心案例。',
    icon: '🗼', color: '#FFB79E', coordsText: '35.69°N, 139.69°E'
  },
  {
    code: 'JP-14', fullName: '神奈川縣', shortName: '神奈川', kana: 'かながわけん', type: '縣',
    oldProvince: '相模・武藏', capital: '橫濱市', capitalDiffers: true, region: 'kanto',
    population: 922.5, gdp: 351594,
    terrain: '太平洋側氣候（東京灣、相模灣、箱根火山）',
    nameOrigin: '源自東海道著名宿場町與開港前身「神奈川湊」。',
    geoNote: '人口高居全國第二（922.5萬），橫濱為日本最大市級行政區！與東京共同構成「京濱工業地帶」，兼具鐮倉古都與箱根溫泉。',
    icon: '⚓', color: '#FFDFCE', coordsText: '35.45°N, 139.64°E'
  },
  {
    code: 'JP-15', fullName: '新潟縣', shortName: '新潟', kana: 'にいがたけん', type: '縣',
    oldProvince: '越後・佐渡', capital: '新潟市', capitalDiffers: false, region: 'chubu',
    population: 209.9, gdp: 90429,
    terrain: '日本海側豪雪氣候（越後平原、信濃川、佐渡島）',
    nameOrigin: '因信濃川與阿賀野川河口沖積形成的新沙洲瀉湖（新潟）得名。',
    geoNote: '日本最長河流「信濃川」於此入海，肥沃越後平原孕育「越光米」全國產量第一！境內糸魚川更是東西日本地質界線起點。',
    icon: '🍚', color: '#FFF2BD', coordsText: '37.90°N, 139.02°E'
  },
  {
    code: 'JP-16', fullName: '富山縣', shortName: '富山', kana: 'とやまけん', type: '縣',
    oldProvince: '越中', capital: '富山市', capitalDiffers: false, region: 'chubu',
    population: 99.7, gdp: 49276,
    terrain: '日本海側氣候（立山連峰3,000m急降至富山灣深海1,000m）',
    nameOrigin: '古稱「外山」，意指立山群峰外側的丘陵之地，後改雅字「富山」。',
    geoNote: '地形高低落差高達4,000公尺堪稱世界奇觀！雪融水豐富造就廉價水力發電與鋁工業、醫藥業，自有住宅率與人均所得名列前茅。',
    icon: '🏔️', color: '#FFE8A1', coordsText: '36.70°N, 137.21°E'
  },
  {
    code: 'JP-17', fullName: '石川縣', shortName: '石川', kana: 'いしかわけん', type: '縣',
    oldProvince: '加賀・能登', capital: '金澤市', capitalDiffers: true, region: 'chubu',
    population: 109.8, gdp: 47173,
    terrain: '日本海側氣候（能登半島、金澤平原、白山）',
    nameOrigin: '因發源於白山、多礫石的手取川舊稱「石川」而得名。',
    geoNote: '能登半島優雅伸向日本海；金澤保留完整江戶加賀百萬石城下町風貌，兼六園名列日本三名園，金箔產量佔全國99%！',
    icon: '✨', color: '#FFF5CC', coordsText: '36.59°N, 136.63°E'
  },
  {
    code: 'JP-18', fullName: '福井縣', shortName: '福井', kana: 'ふくいけん', type: '縣',
    oldProvince: '越前・若狹', capital: '福井市', capitalDiffers: false, region: 'chubu',
    population: 73.9, gdp: 38035,
    terrain: '日本海側氣候（若狹灣谷灣海岸、九頭龍川平原）',
    nameOrigin: '江戶初期藩主松平忠昌取「福之井」吉祥之意由北之莊更名「福井」。',
    geoNote: '鯖江市生產全日本逾九成眼鏡框！同時為日本恐龍化石出土最豐富之地，幸福度排行榜長期位居全日本第一。',
    icon: '🦕', color: '#FFEBAD', coordsText: '36.07°N, 136.22°E'
  },
  {
    code: 'JP-19', fullName: '山梨縣', shortName: '山梨', kana: 'やまなしけん', type: '縣',
    oldProvince: '甲斐', capital: '甲府市', capitalDiffers: true, region: 'chubu',
    population: 79.1, gdp: 37150,
    terrain: '中央高地式氣候（甲府盆地、富士山北麓、富士五湖）',
    nameOrigin: '源自古甲斐國「山梨郡」，相傳因山間盛產野梨樹而得名。',
    geoNote: '四面環山的典型內陸盆地，日夜溫差大且日照長，造就葡萄、水蜜桃與日本葡萄酒產量全國第一，並與靜岡共享富士山！',
    icon: '🍇', color: '#FFE496', coordsText: '35.66°N, 138.57°E'
  },
  {
    code: 'JP-20', fullName: '長野縣', shortName: '長野', kana: 'ながのけん', type: '縣',
    oldProvince: '信濃', capital: '長野市', capitalDiffers: false, region: 'chubu',
    population: 198.7, gdp: 89226,
    terrain: '中央高地式氣候（日本屋脊：飛驒、木曾、赤石三山脈）',
    nameOrigin: '得名於善光寺門前町所在的「長野村」，古稱「信州」。',
    geoNote: '被譽為「日本屋脊」！與最多（8個）鄰縣接壤，海拔高、夏季涼爽，發展出高原避暑農業（萵苣全國第一）與精密光學工業。',
    icon: '⛷️', color: '#FFF0B8', coordsText: '36.65°N, 138.18°E'
  },
  {
    code: 'JP-21', fullName: '岐阜縣', shortName: '岐阜', kana: 'ぎふけん', type: '縣',
    oldProvince: '美濃・飛驒', capital: '岐阜市', capitalDiffers: false, region: 'chubu',
    population: 191.6, gdp: 82252,
    terrain: '北部飛驒山岳豪雪區＋南部濃尾平原（木曾三川）',
    nameOrigin: '織田信長進駐稻葉山城後，取周文王「岐山」與孔子「曲阜」改稱「岐阜」。',
    geoNote: '坐落日本列島人口重心附近，北部白川鄉合掌造是適應豪雪地理的建築典範，南部木曾三川「輪中」堤防則展現治水智慧。',
    icon: '🏘️', color: '#FFE79E', coordsText: '35.39°N, 136.72°E'
  },
  {
    code: 'JP-22', fullName: '靜岡縣', shortName: '靜岡', kana: 'しずおかけん', type: '縣',
    oldProvince: '駿河・遠江・伊豆', capital: '靜岡市', capitalDiffers: false, region: 'chubu',
    population: 352.7, gdp: 188590,
    terrain: '太平洋側溫暖氣候（富士山南麓、駿河灣、伊豆半島）',
    nameOrigin: '明治二年將「駿府」改稱「靜岡」，取賤機山之「靜」與丘陵之「岡」。',
    geoNote: '東海道大動脈核心！綠茶產量長期名列全國前茅，濱松則為機車與樂器製造之都；西緣亦是糸魚川—靜岡構造線的太平洋出口。',
    icon: '🗻', color: '#FFDF8A', coordsText: '34.98°N, 138.38°E'
  },
  {
    code: 'JP-23', fullName: '愛知縣', shortName: '愛知', kana: 'あいちけん', type: '縣',
    oldProvince: '尾張・三河', capital: '名古屋市', capitalDiffers: true, region: 'chubu',
    population: 746.0, gdp: 430831,
    terrain: '太平洋側氣候（濃尾平原、伊勢灣、渥美半島）',
    nameOrigin: '源於《萬葉集》歌詠的古郡名「年魚市（あゆち）」，後寫作「愛知」。',
    geoNote: '日本工業製造心臟！以豐田汽車為首的「中京工業地帶」製造品出貨額連年稱霸全日本，GDP約43.1兆日圓高居全國前三。',
    icon: '🚗', color: '#FFD77A', coordsText: '35.18°N, 136.91°E'
  },
  {
    code: 'JP-24', fullName: '三重縣', shortName: '三重', kana: 'みえけん', type: '縣',
    oldProvince: '伊勢・志摩・伊賀', capital: '津市', capitalDiffers: true, region: 'kansai',
    population: 171.1, gdp: 84906,
    terrain: '太平洋側氣候（伊勢平原、志摩半島谷灣海岸、紀伊山地）',
    nameOrigin: '古事記記載日本武尊感嘆「吾足如三重勾」之地，因而得名「三重」。',
    geoNote: '縣廳「津市」是全日本名字最短（僅1字）的城市！擁有伊勢神宮與志摩珍珠養殖，北部四日市屬中京臨海石化工業區。',
    icon: '🦪', color: '#BDEED1', coordsText: '34.73°N, 136.51°E'
  },
  {
    code: 'JP-25', fullName: '滋賀縣', shortName: '滋賀', kana: 'しがけん', type: '縣',
    oldProvince: '近江', capital: '大津市', capitalDiffers: true, region: 'kansai',
    population: 140.2, gdp: 70060,
    terrain: '近江盆地（日本第一大湖「琵琶湖」佔全縣面積約1/6）',
    nameOrigin: '得名於琵琶湖西南岸的古郡名「滋賀郡」。',
    geoNote: '琵琶湖是關西逾1,400萬人的生命水源！地處東西日本交通咽喉，近年因高鐵通勤便利與高科技廠群聚，平均年齡相對年輕。',
    icon: '💧', color: '#D4F6E2', coordsText: '35.00°N, 135.87°E'
  },
  {
    code: 'JP-26', fullName: '京都府', shortName: '京都', kana: 'きょうとふ', type: '府',
    oldProvince: '山城・丹波・丹後', capital: '京都市', capitalDiffers: false, region: 'kansai',
    population: 252.0, gdp: 111076,
    terrain: '京都盆地內陸型氣候（夏悶熱、冬底冷）＋北部日本海天橋立',
    nameOrigin: '794年桓武天皇遷都平安京，自古即稱「京之都」，日本兩大「府」之一。',
    geoNote: '逾千年古都與世界文化遺產寶庫！不僅觀光享譽全球，更孕育出任天堂、京瓷、村田製作所等眾多隱形冠軍高科技企業。',
    icon: '⛩️', color: '#C5F0D7', coordsText: '35.02°N, 135.76°E'
  },
  {
    code: 'JP-27', fullName: '大阪府', shortName: '大阪', kana: 'おおさかふ', type: '府',
    oldProvince: '攝津・河內・和泉', capital: '大阪市', capitalDiffers: false, region: 'kansai',
    population: 875.7, gdp: 431242,
    terrain: '瀨戶內海式氣候（大阪平原、淀川水系、大阪灣）',
    nameOrigin: '古稱難波、大坂（大坡道之意），明治維新後統一寫作「大阪」。',
    geoNote: '面積為全日本倒數第二小，人口（875.7萬）卻高居全國第三、GDP（43.1兆日圓）更位居全國第二，是西日本商業經濟核心！',
    icon: '🐙', color: '#AEEBC7', coordsText: '34.69°N, 135.52°E'
  },
  {
    code: 'JP-28', fullName: '兵庫縣', shortName: '兵庫', kana: 'ひょうごけん', type: '縣',
    oldProvince: '攝津・播磨・但馬・丹波・淡路', capital: '神戶市', capitalDiffers: true, region: 'kansai',
    population: 533.7, gdp: 234626,
    terrain: '橫跨日本海與瀨戶內海（六甲山、淡路島、明石海峽）',
    nameOrigin: '源自神戶古港「兵庫津」（昔日設置兵器倉庫而得名）。',
    geoNote: '因囊括五個截然不同的舊國與南北雙海岸，素有「日本縮影」之稱！東經135度日本標準時子午線正穿過明石市。',
    icon: '🏯', color: '#CCF4DD', coordsText: '34.69°N, 135.18°E'
  },
  {
    code: 'JP-29', fullName: '奈良縣', shortName: '奈良', kana: 'ならけん', type: '縣',
    oldProvince: '大和', capital: '奈良市', capitalDiffers: false, region: 'kansai',
    population: 128.5, gdp: 39579,
    terrain: '內陸盆地與紀伊山地（奈良盆地、吉野山）',
    nameOrigin: '相傳源於「平緩開墾之地（ならす）」，古代建平城京為大和朝廷發源地。',
    geoNote: '日本歷史與佛教文化起點，國寶建築數高居全國前列；南部紀伊山地森林茂密，北端奈良盆地則是大坂與京都的住宅衛星區。',
    icon: '🦌', color: '#B6ECCE', coordsText: '34.69°N, 135.83°E'
  },
  {
    code: 'JP-30', fullName: '和歌山縣', shortName: '和歌山', kana: 'わかやまけん', type: '縣',
    oldProvince: '紀伊', capital: '和歌山市', capitalDiffers: false, region: 'kansai',
    population: 88.0, gdp: 39961,
    terrain: '太平洋側多雨溫暖氣候（紀伊半島南西側、熊野古道）',
    nameOrigin: '豐臣秀吉築城時以和歌浦之「和歌」命名「和歌山」。',
    geoNote: '本州最南端潮岬所在！受黑潮暖流吹拂氣候溫濕，溫州蜜柑與梅子產量皆為全日本第一，並擁有高野山與熊野古道世界遺產。',
    icon: '🍊', color: '#DCFAE8', coordsText: '34.23°N, 135.17°E'
  },
  {
    code: 'JP-31', fullName: '鳥取縣', shortName: '鳥取', kana: 'とっとりけん', type: '縣',
    oldProvince: '因幡・伯耆', capital: '鳥取市', capitalDiffers: false, region: 'chugoku',
    population: 53.1, gdp: 19122,
    terrain: '日本海側氣候（鳥取砂丘、中國地方最高峰大山）',
    nameOrigin: '古時居民以捕捉湖沼水鳥貢奉朝廷的「鳥取部」為業而得名。',
    geoNote: '全日本人口最少的縣（約53.1萬人），但擁有壯闊海岸風成地貌「鳥取砂丘」與二十世紀梨，人文與自然環境悠閒純淨。',
    icon: '🐪', color: '#E4DAFF', coordsText: '35.50°N, 134.24°E'
  },
  {
    code: 'JP-32', fullName: '島根縣', shortName: '島根', kana: 'しまねけん', type: '縣',
    oldProvince: '出雲・石見・隱岐', capital: '松江市', capitalDiffers: true, region: 'chugoku',
    population: 64.2, gdp: 27527,
    terrain: '日本海側氣候（島根半島、宍道湖、隱岐群島）',
    nameOrigin: '源於《出雲國風土記》中出雲神話「國引」拉來的「島根半島」。',
    geoNote: '日本神話故鄉「出雲大社」所在！松江城與宍道湖交織出秀麗水都景觀，石見銀山曾是16世紀影響世界的白銀礦山。',
    icon: '⛩️', color: '#D7C8FF', coordsText: '35.47°N, 133.05°E'
  },
  {
    code: 'JP-33', fullName: '岡山縣', shortName: '岡山', kana: 'おかやまけん', type: '縣',
    oldProvince: '備前・備中・美作', capital: '岡山市', capitalDiffers: false, region: 'chugoku',
    population: 183.1, gdp: 73450,
    terrain: '典型瀨戶內海式氣候（日照長、降雨少、岡山平原）',
    nameOrigin: '戰國大名宇喜多直家於旭川畔小丘「岡山」建城而定名。',
    geoNote: '因南北均有山地阻擋季風水氣，全年晴天極多而獲譽「晴天之國」！盛產白桃與麝香葡萄，水島臨海工業區與瀨戶大橋為交通經濟樞紐。',
    icon: '🍑', color: '#CEBCFF', coordsText: '34.66°N, 133.93°E'
  },
  {
    code: 'JP-34', fullName: '廣島縣', shortName: '廣島', kana: 'ひろしまけん', type: '縣',
    oldProvince: '安藝・備後', capital: '廣島市', capitalDiffers: false, region: 'chugoku',
    population: 271.4, gdp: 124761,
    terrain: '瀨戶內海式氣候（太田川三角洲、瀨戶內眾多島嶼）',
    nameOrigin: '毛利輝元於太田川河口寬廣沙洲築城，取祖先名與地形合稱「廣島」。',
    geoNote: '中國地方最大人口與經濟中心（GDP逾12.4兆日圓）！擁有宮島嚴島神社與原爆圓頂兩大世界遺產，牡蠣與檸檬產量均為全日本第一。',
    icon: '🍁', color: '#E0D5FF', coordsText: '34.40°N, 132.46°E'
  },
  {
    code: 'JP-35', fullName: '山口縣', shortName: '山口', kana: 'やまぐちけん', type: '縣',
    oldProvince: '周防・長門', capital: '山口市', capitalDiffers: false, region: 'chugoku',
    population: 128.1, gdp: 63062,
    terrain: '本州最西端，三面環海（秋吉台喀斯特高原、關門海峽）',
    nameOrigin: '大內氏建城於群山環繞的盆地入口（「山之口」），故稱山口。',
    geoNote: '隔關門海峽與九州遙望，擁有日本最大喀斯特地形「秋吉台與秋芳洞」；歷史上作為長州藩故地，孕育多位日本首相。',
    icon: '🐡', color: '#D3C3FF', coordsText: '34.19°N, 131.47°E'
  },
  {
    code: 'JP-36', fullName: '德島縣', shortName: '德島', kana: 'とくしまけん', type: '縣',
    oldProvince: '阿波', capital: '德島市', capitalDiffers: false, region: 'shikoku',
    population: 68.5, gdp: 31489,
    terrain: '吉野川沖積平原、劍山山地、鳴門海峽漩渦',
    nameOrigin: '蜂須賀家政入主阿波國築城，取吉慶之意改稱「德島」。',
    geoNote: '鳴門海峽因瀨戶內海與太平洋潮差形成壯觀世界級大漩渦！阿波舞文化享譽國際，亦是LED藍光二極體與酸橘（すだち）之鄉。',
    icon: '🌀', color: '#FFE5BD', coordsText: '34.07°N, 134.56°E'
  },
  {
    code: 'JP-37', fullName: '香川縣', shortName: '香川', kana: 'かがわけん', type: '縣',
    oldProvince: '讚岐', capital: '高松市', capitalDiffers: true, region: 'shikoku',
    population: 91.7, gdp: 40576,
    terrain: '瀨戶內海式少雨氣候（讚岐平原、滿濃池等眾多灌溉溜池）',
    nameOrigin: '古時香東川流經長滿香木樺樹的河岸，因而名為「香川」。',
    geoNote: '全日本面積最小的縣（僅約1,877 km²）！因雨量少自古修築上萬座灌溉池塘，並發展出聞名世界的讚岐烏龍麵與瀨戶內國際藝術祭。',
    icon: '🍲', color: '#FFD89E', coordsText: '34.34°N, 134.04°E'
  },
  {
    code: 'JP-38', fullName: '愛媛縣', shortName: '愛媛', kana: 'えひめけん', type: '縣',
    oldProvince: '伊予', capital: '松山市', capitalDiffers: true, region: 'shikoku',
    population: 127.6, gdp: 51381,
    terrain: '瀨戶內海式氣候（石鎚山為西日本最高峰、宇和海谷灣）',
    nameOrigin: '源自《古事記》神話中伊予國的女神之名「愛比賣（えひめ）」。',
    geoNote: '四國人口與GDP第一大縣！擁有日本最古老道後溫泉與今治造船・毛巾產業，柑橘品種之多號稱「柑橘王國」。',
    icon: '🍊', color: '#FFE0AE', coordsText: '33.84°N, 132.77°E'
  },
  {
    code: 'JP-39', fullName: '高知縣', shortName: '高知', kana: 'こうちけん', type: '縣',
    oldProvince: '土佐', capital: '高知市', capitalDiffers: false, region: 'shikoku',
    population: 65.6, gdp: 24074,
    terrain: '太平洋側多雨溫暖氣候（四萬十川、森林覆蓋率全日本第一）',
    nameOrigin: '山內一豐築河中城時原名「河內」，後因避水患改吉字為「高知」。',
    geoNote: '森林覆蓋率高達84%居全日本之冠！受黑潮暖流影響冬季溫暖，利用溫室「促成栽培」茄子與青椒，並擁有「日本最後清流」四萬十川。',
    icon: '🐟', color: '#FFD394', coordsText: '33.56°N, 133.53°E'
  },
  {
    code: 'JP-40', fullName: '福岡縣', shortName: '福岡', kana: 'ふくおかけん', type: '縣',
    oldProvince: '筑前・筑後・豐前', capital: '福岡市', capitalDiffers: false, region: 'kyushu',
    population: 509.2, gdp: 201872,
    terrain: '博多灣平原、筑紫平原（九州最大河流筑後川）',
    nameOrigin: '黑田長政建城時以祖先故里備前「福岡」命名，並與商港「博多」共生。',
    geoNote: '九州唯一人口破500萬（509.2萬）且GDP破20兆日圓的區域核心！坐擁福岡與北九州兩大政令市，距東亞大陸最近，為亞洲門戶。',
    icon: '🍜', color: '#FFC0D0', coordsText: '33.61°N, 130.42°E'
  },
  {
    code: 'JP-41', fullName: '佐賀縣', shortName: '佐賀', kana: 'さがけん', type: '縣',
    oldProvince: '肥前', capital: '佐賀市', capitalDiffers: false, region: 'kyushu',
    population: 78.8, gdp: 31489,
    terrain: '佐賀平原、有明海廣闊潮間帶濕地',
    nameOrigin: '《肥前國風土記》記日本武尊讚歎此地樟樹繁茂「榮之國」，後轉為「佐賀」。',
    geoNote: '南瀕全日本潮差最大的「有明海」（可達6公尺），孕育頂級海苔產量全國第一；同時擁有有田燒、伊萬里燒瓷器與吉野里彌生遺跡。',
    icon: '🏺', color: '#FFD8E1', coordsText: '33.25°N, 130.30°E'
  },
  {
    code: 'JP-42', fullName: '長崎縣', shortName: '長崎', kana: 'ながさきけん', type: '縣',
    oldProvince: '肥前・壹岐・對馬', capital: '長崎市', capitalDiffers: false, region: 'kyushu',
    population: 125.2, gdp: 46536,
    terrain: '曲折半島與離島地形（全縣島嶼數全日本最多！）',
    nameOrigin: '得名於細長延伸入海的岬角地形「長岬（長崎）」。',
    geoNote: '擁有全國最多的島嶼與最曲折海岸線！江戶鎖國時期「出島」是日本唯一對歐貿易窗口，造就獨特的和華蘭多元港口文化。',
    icon: '⛵', color: '#FFCCD8', coordsText: '32.74°N, 129.87°E'
  },
  {
    code: 'JP-43', fullName: '熊本縣', shortName: '熊本', kana: 'くまもとけん', type: '縣',
    oldProvince: '肥後', capital: '熊本市', capitalDiffers: false, region: 'kyushu',
    population: 169.7, gdp: 65651,
    terrain: '阿蘇世界最大級破火山口（Caldera）＋豐富火山地下水',
    nameOrigin: '加藤清正築城時將古地名「隈本」改作更具威嚴的「熊本」。',
    geoNote: '被譽為「火之國」與「水之都」，阿蘇破火山口是教科書經典火山地形！近年因台積電（JASM）設廠，成為九州「矽島」成長最快的焦點。',
    icon: '🐻', color: '#FFB8C9', coordsText: '32.79°N, 130.74°E'
  },
  {
    code: 'JP-44', fullName: '大分縣', shortName: '大分', kana: 'おおいたけん', type: '縣',
    oldProvince: '豐後', capital: '大分市', capitalDiffers: false, region: 'kyushu',
    population: 108.5, gdp: 49007,
    terrain: '九重連山火山帶、別府灣與國東半島',
    nameOrigin: '《豐後國風土記》記景行天皇見當地平原廣闊稱為「碩田（おおきた）」。',
    geoNote: '溫泉源泉數與湧出量均為全日本壓倒性第一（「日本第一溫泉縣」）！擁有別府地獄與由布院，臨海則發展出大分鋼鐵石化工業。',
    icon: '♨️', color: '#FFD4DF', coordsText: '33.24°N, 131.61°E'
  },
  {
    code: 'JP-45', fullName: '宮崎縣', shortName: '宮崎', kana: 'みやざきけん', type: '縣',
    oldProvince: '日向', capital: '宮崎市', capitalDiffers: false, region: 'kyushu',
    population: 103.3, gdp: 37669,
    terrain: '太平洋側溫暖日照氣候（宮崎平原、日南海岸）',
    nameOrigin: '相傳源於神武天皇宮殿所在的岬角「宮之崎」。',
    geoNote: '日照時間與快晴日數常居全國前列，充滿南國椰林風情！以溫室促成栽培（小黃瓜、完熟芒果）及宮崎牛、地雞畜牧業聞名。',
    icon: '🥭', color: '#FFC4D3', coordsText: '31.91°N, 131.42°E'
  },
  {
    code: 'JP-46', fullName: '鹿兒島縣', shortName: '鹿兒島', kana: 'かごしまけん', type: '縣',
    oldProvince: '薩摩・大隅', capital: '鹿兒島市', capitalDiffers: false, region: 'kyushu',
    population: 153.2, gdp: 60486,
    terrain: '火山灰「白砂台地（シラス台地）」、櫻島活火山、屋久島',
    nameOrigin: '多種說法包含「神子島」或海灣如籠包圍之「籠島」演化而成。',
    geoNote: '擁有活火山櫻島與世界遺產屋久島（年雨量驚人），火山灰「白砂台地」排水極快，因此發展出全日本第一的番薯與黑豬畜牧農業！',
    icon: '🌋', color: '#FFD9E3', coordsText: '31.56°N, 130.56°E'
  },
  {
    code: 'JP-47', fullName: '沖繩縣', shortName: '沖繩', kana: 'おきなわけん', type: '縣',
    oldProvince: '琉球', capital: '那霸市', capitalDiffers: true, region: 'kyushu',
    population: 146.6, gdp: 44615,
    terrain: '日本唯一亞熱帶海洋性氣候（珊瑚礁島嶼群、琉球弧）',
    nameOrigin: '古為「琉球王國」，「沖繩」一詞源自海上浮繩般綿延的島弧景觀。',
    geoNote: '日本最南與最西端所在！常年溫暖、周圍環繞珊瑚礁與黑潮暖流，觀光業為核心支柱，且出生率長期位居全日本第一。',
    icon: '🌺', color: '#FFB0C6', coordsText: '26.21°N, 127.68°E'
  }
];

// 自動計算全日本47都道府縣人口排名、GDP排名與人均GDP（萬日圓/人）
(function computeRanks() {
  const byPop = [...window.PREFECTURES].sort((a, b) => b.population - a.population);
  const byGdp = [...window.PREFECTURES].sort((a, b) => b.gdp - a.gdp);
  byPop.forEach((p, i) => { p.popRank = i + 1; });
  byGdp.forEach((p, i) => { p.gdpRank = i + 1; });
  window.PREFECTURES.forEach(p => {
    // 億日圓 / 萬人 = 萬日圓/人
    p.gdpPerCapita = Math.round(p.gdp / p.population);
    p.gdpTrillion = (p.gdp / 10000).toFixed(2);
  });
})();
