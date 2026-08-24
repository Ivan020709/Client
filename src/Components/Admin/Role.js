import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function Role() {
    const loginUser = useSelector(state=>state.user)
    const [code, setCode] = useState('')
    function onsubmit(){}
    return (
        <div style={{height:'350px', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column', fontSize:'350%'}}>
            코드를 입력하세요
            <input type='text' value={code} onChange={e=>setCode(e.currentTarget.value)} placeholder='XXXX-XXXX-XXXX-XXXX' style={{width:'440px', height:'70px', fontSize:'40px'}}/>
            <button style={{width:'440px', height:'70px', fontSize:'40px'}} onClick={onsubmit()}>확인</button>
        </div>
    )
}

export default Role