import React, {useEffect, useState} from 'react';
import './App.css';

const getItems = async () => Array.from({length: 500}, (_, index) => ({
  id: Math.random().toString(36).slice(2),
  text: String(index + 1)
}));

const itemHeight = 40;
const containerHeight = 600;

function App() {


  const [itemsList, setItemsLits] = useState<any[]>([]);

  useEffect(() => {
    getItems().then((items) => {setItemsLits(items)});
  }, []);

  return (
    <div style={{ padding: '0 12px', backgroundColor: "black", color: 'white' }}>
    <h1>List</h1>
      <div style={{ marginBottom: 12, height: containerHeight, width: 600, overflowY: 'scroll', border: '1px solid white' }}>
        {itemsList.map((item) => (
          <div key={item.id} style={{padding: '10px 20px'}}>{item.text}</div>
        )) }
      </div>
    </div>
  );
}

export default App;
