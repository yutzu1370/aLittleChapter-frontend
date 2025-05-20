import React from 'react';

/**
 * 數字格式化工具，將每個數字字符用 Coiny 字體包裹
 */
export function FormatNumber({ children }: { children: React.ReactNode }) {
  if (typeof children === 'number' || (typeof children === 'string' && !isNaN(Number(children)))) {
    // 如果是純數字或可轉換為數字的字符串，直接使用 Coiny 字體
    return <span className="font-coiny">{children}</span>;
  } else if (typeof children === 'string') {
    // 如果是混合字符串，將數字部分單獨用 Coiny 字體包裹
    const parts = children.split(/(\d+)/).map((part, index) => {
      if (!isNaN(Number(part)) && part !== '') {
        return <span key={index} className="font-coiny">{part}</span>;
      }
      return part;
    });
    return <>{parts}</>;
  }
  
  // 其他類型原樣返回
  return <>{children}</>;
}

/**
 * 數字樣式化函數，返回帶有 Coiny 字體的數字
 */
export function formatPrice(price: number | string, showSymbol = true): JSX.Element {
  const formattedPrice = typeof price === 'number' 
    ? price.toLocaleString('zh-TW', { minimumFractionDigits: 0 }) 
    : price;
  
  return (
    <span className="price">
      {showSymbol && <span className="font-jf-openhuninn">$</span>}
      <span className="font-coiny">{formattedPrice}</span>
    </span>
  );
}

/**
 * CSS-in-JS 解決方案：將數字轉換為帶有 Coiny 字體的 JSX
 */
export function NumericText({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`numeric ${className}`}>
      {children}
    </span>
  );
}

/**
 * 為純數字添加 Coiny 字體
 */
export const coinyNumber = (num: number | string): JSX.Element => {
  return <span className="font-coiny">{num}</span>;
};

export default FormatNumber; 