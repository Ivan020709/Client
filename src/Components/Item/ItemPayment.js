import React,{useEffect,useState} from 'react';
import {useNavigate,useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import axios from 'axios';
import jaxios from '../../utils/jwtUtil';
import './ItemShop.css';
function ItemPayment(){
 const {itemId}=useParams();const navigate=useNavigate();const loginUser=useSelector(s=>s.user);const [item,setItem]=useState(null);const [quantity,setQuantity]=useState(1);
 useEffect(()=>{axios.get(`/api/item/view/${itemId}`).then(r=>setItem(r.data.item)).catch(()=>alert('상품을 불러오지 못했습니다.'));},[itemId]);
 const loadPortone=()=>new Promise((resolve,reject)=>{if(window.IMP)return resolve(window.IMP);const s=document.createElement('script');s.src='https://cdn.iamport.kr/v1/iamport.js';s.onload=()=>resolve(window.IMP);s.onerror=reject;document.head.appendChild(s);});
 const pay=async()=>{try{const ready=(await jaxios.post('/api/payment/ready',{userId:loginUser.userid,itemId:Number(itemId),quantity})).data;const IMP=await loadPortone();const code=process.env.REACT_APP_IAMPORT_CODE;if(!code)return alert('.env에 REACT_APP_IAMPORT_CODE를 입력해주세요.');IMP.init(code);IMP.request_pay({pg:'html5_inicis',pay_method:'card',merchant_uid:ready.merchantUid,name:ready.itemName,amount:ready.totalPrice,buyer_email:ready.buyerEmail},async response=>{if(!response.success)return navigate('/paymentResult',{state:{success:false,message:response.error_msg}});try{await jaxios.post('/api/payment/complete',{userId:loginUser.userid,merchantUid:ready.merchantUid,paymentUid:response.imp_uid});navigate('/paymentResult',{state:{success:true,merchantUid:ready.merchantUid,itemName:ready.itemName,totalPrice:ready.totalPrice}});}catch(e){navigate('/paymentResult',{state:{success:false,message:e.response?.data?.message||'결제 검증에 실패했습니다.'}});}});}catch(e){alert(e.response?.data?.message||'결제를 준비하지 못했습니다.');}};
 if(!item)return <main className="item-shop">상품을 불러오는 중입니다.</main>;
 return <main className="item-shop"><article className="item-card payment-card"><h1>{item.itemName}</h1><p>{item.itemDescription}</p><label>수량 <input type="number" min="1" max="99" value={quantity} onChange={e=>setQuantity(Math.max(1,Number(e.target.value)))}/></label><b>총 {(item.price*quantity).toLocaleString()}원</b><button onClick={pay}>결제하기</button></article></main>;
}export default ItemPayment;
