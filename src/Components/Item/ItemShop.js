import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ItemShop.css';

function ItemShop(){
    const [items,setItems]=useState([]);
    const navigate=useNavigate();
    useEffect(()=>{axios.get('/api/item/list').then(r=>setItems(r.data.items||[])).catch(e=>console.error(e));},[]);
    return <main className="item-shop"><h1>친밀도 아이템 상점</h1><p>AI 친구에게 선물하고 친밀도를 올려보세요.</p>
        <div className="item-grid">{items.map(item=><article key={item.itemId} className="item-card">
            {item.itemImage?<img src={item.itemImage} alt={item.itemName}/>:<div className="item-placeholder">🎁</div>}
            <h2>{item.itemName}</h2><p>{item.itemDescription}</p><b>{item.price.toLocaleString()}원</b>
            <span>사용 시 +{item.expValue} EXP</span>
            <button onClick={()=>navigate(`/itemPayment/${item.itemId}`)}>구매하기</button>
        </article>)}</div></main>;
}
export default ItemShop;
