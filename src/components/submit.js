import React, {useState, useEffect} from 'react';
const axios = require('axios');

const Success = () => {
    const [data, updateData] = useState();
    useEffect(() => {
      const getData = async () => {
        const resp = await axios.get('http://api.giphy.com/v1/gifs/random?api_key=7ZZgflVH63sx6gqBELXagwW9uOpjFOYn&tag=barber')
        const json = await resp.data.data.images.downsized_large.url
        console.log(json);
        updateData(json);
      }
      getData();
    }, []);
  
return( 
<div>
<h2>Appointment successfully booked</h2>
<img src={data} alt="gif" />
</div>
);
}
export default Success;