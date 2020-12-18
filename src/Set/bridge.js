import axios from 'axios';
import { set } from './data';
import Light from './state-model';

let bridgeUser = "";
let bridgeIp = '';

export const getBridgeIP = () => {
    return axios.get('https://discovery.meethue.com').then(res => {
        bridgeIp = res.data[0].internalipaddress
        return res.data[0].internalipaddress
    });
}

const connectToBridge = async (ip, user) => {

  let connected = false;

  if(user) {
      await axios.get(`https://${ip}/api/${user}`).then(res => {
        connected = true;
      })
  } else {
      await createUser(ip).then(async (res) => {
        await axios.get(`https://${ip}/api/${res}`).then(() => {
          bridgeUser = res;
          connected = true;
        })
      });
  }

  return connected;

}

const createUser = (ip) => {

  let request = new Promise((resolve, reject) => {

    let requestsMade = 0;
    
    let bridgeRequest = setInterval(()=>{
      axios.post(`https://${ip}/api`, {devicetype: "hue-stage-wep-app"})
        .then(res => {
          if (!res.data[0].error) {
            resolve(res.data[0].success.username);
            requestsMade += 1;
            clearInterval(bridgeRequest);
          } else {
            console.log(res.data[0].error)
          }
      }).catch(err => {
        console.log(err);
      })
      if(requestsMade > 15) {
        reject('Unable to create user')
        clearInterval(bridgeRequest);
      }
      
    }, 2000);

  })

  return request;

}

const getLights = async (ip, user) => {

  let reachableLights = [];

  console.log('getting lights');
  console.log(ip, user);

  await axios.get(`https://${ip}/api/${user}/lights/`).then(res => {

      let lights = Object.entries(res.data);
      lights.forEach(light => {
          if(light[1].state.reachable) {
              reachableLights.push(light);
          }
      })
  })
  
  
  return reachableLights;
}

export const bridge = {
    connect: async (user) => {

      let connected = false;
      let ip = '';

      await getBridgeIP().then(async (resIp) => {
          ip = resIp;
          connected = await connectToBridge(ip, user);
      })

      return {connected: connected, bridgeUser: bridgeUser || user, bridgeIp: ip};
    },

    send(light, state, _bridgeIp, _bridgeUser) {
        axios.put(`https://${_bridgeIp}/api/${_bridgeUser}/lights/${light}/state`, state)
        .then(res => {
        })
    },

    loadLights: async (ip, user) => {

        let reachableLights = [] 
        return await getLights(ip, user).then(res => {
            reachableLights = res;
            reachableLights.map(light => {
                set.push(new Light(light[0], light[1].name, light[1].uniqueid, []));
                console.log(set);
                return null;
            })
            return true;
        })

        
    }


}
