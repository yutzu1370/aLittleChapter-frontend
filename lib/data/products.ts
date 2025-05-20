import { Product, ProductDetail, Review } from "../types/product";

// 商品列表頁假資料
export const products: Product[] = [
  {
    id: "1",
    name: "奇幻森林探險記",
    price: 350,
    originalPrice: 480,
    image: "/images/books/book1-main.jpg",
    description: "小狐狸露比的冒險旅程，探索勇氣與成長的意義，適合親子共讀。"
  },
  {
    id: "2",
    name: "彩虹河的守護者",
    price: 240,
    originalPrice: 300,
    image: "/images/other/book_10-1.png",
    description: "跟著小河貍莫莫一起守護彩虹河，學習環保與大自然共存的重要課題。"
  },
  {
    id: "3",
    name: "星星和小小孩的願望",
    price: 180,
    originalPrice: 280,
    image: "/images/other/book_10-2.png",
    description: "一個關於夢想與希望的溫馨故事，每個願望都能成真的奇幻世界。"
  },
  {
    id: "4",
    name: "小豬的藝術工坊",
    price: 190,
    originalPrice: 280,
    image: "/images/other/book_10-3.png",
    description: "跟著胖胖豬一起進入色彩繽紛的藝術世界，發掘創意無限可能。"
  },
  {
    id: "5",
    name: "貓頭鷹的秘密森林",
    price: 220,
    originalPrice: 300,
    image: "/images/other/book_10-4.png",
    description: "智慧的貓頭鷹帶你發現森林裡的奧秘，學習自然界的生態平衡。"
  },
  {
    id: "6",
    name: "雲朵糖果屋",
    price: 260,
    originalPrice: 320,
    image: "/images/other/book_10-1.png",
    description: "一個漂浮在空中的甜點王國，充滿驚奇與冒險的故事。"
  },
  {
    id: "7",
    name: "海底城堡歷險記",
    price: 280,
    originalPrice: 340,
    image: "/images/other/book_10-2.png",
    description: "跟著小海龜探索神秘的海底世界，認識海洋生物與環境保護。"
  },
  {
    id: "8",
    name: "恐龍樂園大冒險",
    price: 310,
    originalPrice: 380,
    image: "/images/other/book_10-3.png",
    description: "穿越時空回到恐龍時代，學習史前動物知識與科學常識。"
  }
];

// 分類選項
export const categories = ["全部作品", "熱門推薦", "新品上市", "特價優惠", "適合3-5歲", "適合6-8歲", "適合9歲以上"];

// 商品詳細頁假資料
export const productDetail: ProductDetail = {
  id: "1",
  name: "奇幻森林探險記",
  description: "這是一個關於小狐狸露比的冒險故事，透過奇幻森林的旅程，探索勇氣與成長的意義，適合親子共讀與孩子啟發想像力！",
  price: 350,
  originalPrice: 480,
  image: "/images/other/book_09.png",
  promotionEnd: "2025年6月30日",
  images: [
    "/images/other/book_09.png",
    "/images/other/book_09-1.png",
    "/images/other/book_09-2.png",
    "/images/other/book_09-3.png",
    "/images/other/book_09-1.png",
    "/images/other/book_09-2.png"
  ],
  author: {
    name: "陳美玲",
    description: "喜歡觀察小動物與大自然，擅長用溫暖筆觸編織勇氣與成長的小故事。"
  },
  translator: {
    name: "張嘉文",
    description: "擁有豐富中英雙語翻譯經驗，致力於讓每個故事都能跨越語言，觸動孩子的心靈。"
  },
  illustrator: {
    name: "林佳慧",
    description: "專攻粉蠟筆插畫，擅長打造溫柔夢幻的森林世界，讓每個故事都像童話般展開。"
  },
  aboutContent: `◎ 隨書附贈森林地圖，全新冒險角色登場！

小狐狸露比即將展開一場奇幻旅程！勇敢邁步，挑戰未知，結識森林夥伴，成長為真正的冒險家！露比一直嚮往森林深處的神秘世界，但村裡的長輩總是提醒她要小心陌生的道路。某天，一陣突如其來的狂風吹倒了大樹，露比決定鼓起勇氣，穿越森林尋找新的路徑。旅途中，她遇見了機智的松鼠、善良的貓頭鷹，還有愛惡作劇的小鼴鼠，每個夥伴都教會她不同的智慧與勇氣。然而，森林裡的挑戰才剛剛開始——突如其來的暴雨沖毀了回家的橋，露比和夥伴們能夠攜手合作，找到回家的方法嗎？這趟旅程不僅是一次冒險，更是一場關於友誼、成長與勇氣的考驗！

🔹 本書特色

寓教於樂：透過溫暖的故事，幫助孩子理解面對困難時的勇氣與解決問題的能力。

精美插畫：細膩生動的森林場景，讓孩子彷彿置身於奇幻世界之中。

啟發想像力：鼓勵孩子探索未知，培養獨立思考與團隊合作精神。

📖 適讀年齡
 📌 3～7歲親子共讀，8歲以上自行閱讀`
};

// 評論假資料
export const reviews: Review[] = [
  {
    id: 1,
    username: "貓頭鷹",
    level: 1,
    profilePic: "/images/user_icon/user_icon_1.png",
    rating: 5,
    date: "5 天前",
    content: "故事充滿奇幻與冒險，小狐狸露比的旅程讓孩子學習勇氣與探索的樂趣！🌲🦊\n插圖細膩，森林裡藏滿驚喜，讓親子共讀變得更加有趣。每晚睡前都指定要聽這個故事，真的太喜歡了！📖✨",
    likes: 0
  },
  {
    id: 2,
    username: "虎王",
    level: 2,
    profilePic: "/images/user_icon/user_icon_2.png",
    rating: 5,
    date: "2 週前",
    content: "畫風溫暖可愛，故事情節引人入勝！💛\n露比在森林中的冒險充滿勇氣與成長的意義，適合啟發孩子的想像力。\n讀完後，小朋友一直問：「還有其他故事嗎？」希望能看到更多系列作品！📚",
    likes: 5,
    isLiked: true
  },
  {
    id: 3,
    username: "羊咩咩",
    level: 1,
    profilePic: "/images/user_icon/user_icon_3.png",
    rating: 5,
    date: "1 個月前",
    content: "故事充滿奇幻與冒險，小狐狸露比的旅程讓孩子學習勇氣與探索的樂趣！🌲🦊\n插圖細膩，森林裡藏滿驚喜，讓親子共讀變得更加有趣。每晚睡前都指定要聽這個故事，真的太喜歡了！📖✨",
    likes: 2
  }
];

// 取得相關商品（這裡是從所有商品中排除目前產品）
export const getRelatedProducts = (currentProductId: string): Product[] => {
  return products.filter(product => product.id !== currentProductId).slice(0, 4);
};

// 查詢單一商品詳情（實際應用會從 API 獲取）
export const getProductById = (id: string): ProductDetail => {
  // 這裡暫時返回固定的產品詳情，實際應用中應根據 ID 查詢
  return productDetail;
}; 