import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import './App.css';

const getItems = async () => Array.from({length: 10000}, (_, index) => ({
  id: Math.random().toString(36).slice(2),
  text: String(index)
}));

const itemHeight = 40;
const containerHeight = 600;
const overscan = 3;

function App() {
  const [itemsList, setItemsList] = useState<any[]>([]);
  const [scrollTop, setScrollTop] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scrollElement = scrollContainerRef.current;

    if (!scrollElement) {
      return;
    }

    const handleScroll = () => {
      const scrollTop = scrollElement.scrollTop;
      setScrollTop(scrollTop);
    }
    handleScroll();
    scrollElement.addEventListener('scroll', handleScroll);
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const virtualItems = useMemo(() => {
    const rangePXStart = scrollTop;
    const rangePXEnd = scrollTop + containerHeight;

    let rangeIndexStart = Math.ceil(rangePXStart / itemHeight);
    let rangeIndexEnd = Math.floor(rangePXEnd / itemHeight);

    rangeIndexStart = Math.max(0, rangeIndexStart - overscan);
    rangeIndexEnd = Math.min(itemsList.length - 1, rangeIndexEnd + overscan);

    const virtualItems = [];
    for (let index = rangeIndexStart; index <= rangeIndexEnd; index++) {
      virtualItems.push({index, offsetTop: index * itemHeight});
    }

    return virtualItems;
  }, [scrollTop, itemsList]);

  useEffect(() => {
    getItems().then((items) => {setItemsList(items)});
  }, []);

  const totalListHeight = useMemo(() =>
      itemsList.length * itemHeight,
    [itemsList.length])

  return (
    <div style={{ padding: '0 12px', backgroundColor: "black", color: 'white' }}>
      <h1>List</h1>

      <div ref={scrollContainerRef} style={{
        marginBottom: 12,
        height: containerHeight,
        width: 600,
        overflow: 'auto',
        border: '1px solid white',
        position: 'relative'
      }}>
        <div style={{height: totalListHeight}}>
          {virtualItems.map((virtualItem) => (
            <div
              key={itemsList[virtualItem.index].id}
              style={{
                padding: '10px 20px',
                position: 'absolute',
                top: 0,
                height: itemHeight,
                transform: `translateY(${virtualItem.offsetTop}px)`
            }}>
              {itemsList[virtualItem.index].text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
