import { Product, Review } from '@/lib/types/product';

// 模擬評論數據
export function getMockReviews(): Review[] {
  return [
    {
      id: 1,
      username: '林小明',
      level: 3,
      profilePic: '/images/user_icon/user1.jpg',
      rating: 5,
      date: '2024-02-15',
      content: '這本書太適合我家小孩了！插圖精美，故事也很有教育意義。我的孩子已經要求我連續讀了好幾天。',
      likes: 24,
      isLiked: false
    },
    {
      id: 2,
      username: '陳美玲',
      level: 2,
      profilePic: '/images/user_icon/user2.jpg',
      rating: 4,
      date: '2024-01-28',
      content: '故事情節簡單但深刻，適合低幼齡孩子閱讀。紙質和印刷都不錯，就是價格稍微高了點。',
      likes: 18,
      isLiked: true
    },
    {
      id: 3,
      username: '王大華',
      level: 4,
      profilePic: '/images/user_icon/user3.jpg',
      rating: 5,
      date: '2024-01-10',
      content: '作為幼兒園老師，我強烈推薦這本書！用來教導孩子們關於勇氣和自信的課程非常適合。',
      likes: 32,
      isLiked: false
    },
    {
      id: 4,
      username: '張小婷',
      level: 1,
      profilePic: '/images/user_icon/user4.jpg',
      rating: 5,
      date: '2023-12-25',
      content: '我的女兒非常喜歡這個故事，企鵝皮皮已經成為她的偶像了。插畫非常吸引孩子的注意力。',
      likes: 15,
      isLiked: false
    },
  ];
} 