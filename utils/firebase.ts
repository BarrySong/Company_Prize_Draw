
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// 严格按照您的 Firebase 截图和最新配置更新
const firebaseConfig = {
  apiKey: "AIzaSyC5iFnCP1Trw0gEG4STqMdDu9dPHnE72EA",
  authDomain: "company-prize-draw.firebaseapp.com",
  projectId: "company-prize-draw",
  // 关键修改：根据您的截图，数据库位于新加坡 (asia-southeast1)
  // URL 格式必须包含区域后缀
  databaseURL: "https://company-prize-draw-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "company-prize-draw.firebasestorage.app",
  messagingSenderId: "410939862329",
  appId: "1:410939862329:web:de8e78f0d2919b6395cce8",
  measurementId: "G-B5CD6RPGBD"
};

const app = initializeApp(firebaseConfig);

/**
 * 导出数据库实例。
 * ⚠️ 重要：请务必在 Firebase 控制台的 [规则] 选项卡中，将 .read 和 .write 改为 true 并点击 [发布]
 * 规则内容应如下：
 * {
 *   "rules": {
 *     ".read": true,
 *     ".write": true
 *   }
 * }
 */
export const db = getDatabase(app, firebaseConfig.databaseURL);
