// @flow

import React from 'react';
import WordCloud from 'react-d3-cloud';
 
const fontSizeMapper = word => Math.max(50,Math.min(word.value * 10, 250));
 
export default ({ logs }) => {
  const data = {}
  logs.filter(log => log.data.type === 'chat').forEach(log => {
    log.data.msg.split(' ').forEach(word => {
      data[word] = (data[word] || 0) + 1
    })
  })

  return(
    <div>
      <p>{logs.length} logs</p>
      <WordCloud
        data={[ ...Object.keys(data).map(word => ({ text: word, value: data[word]}))]}
        fontSizeMapper={fontSizeMapper}
      />
    </div>
  )
}
