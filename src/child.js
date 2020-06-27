import React, { useState } from 'react'

export default function Child() {
  const [num, setNum] = useState(window.NUMBER)
  return <>
    <button onClick={() => setNum(num + 1)}>add</button>
    <p>{num}</p>
  </>
}