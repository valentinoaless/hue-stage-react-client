import axios from 'axios';
import { set } from './data';
import Light from './state-model';

let bridgeUser = "";
let bridgeIp = '';

const getBridgeIP = () => {
    return axios.get('https://discovery.meethue.com').then(res => {
        bridgeIp = res.data[0].internalipaddress
        return res.data[0].internalipaddress
    })
}

const connectToBridge = (ip, user) => {
  if(user) {
      axios.get(`http://${ip}/api/${user}`).then(res => {
      })
  } else {
      createUser(ip).then(res => {
        axios.get(`http://${ip}/api/${res}`).then(res => {
          console.log(res);
        })
      });
  }
}

const createUser = (ip) => {

  let request = new Promise((resolve, reject) => {

    let requestsMade = 0;
    
    let bridgeRequest = setInterval(()=>{
      axios.post(`http://${ip}/api`, {devicetype: "hue-stage-wep-app"})
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

export const bridge = {
    connect: async () => {
        await getBridgeIP().then(ip => {
            connectToBridge(ip, bridgeUser)
        })
    },

    send(light, state) {
        axios.put(`http://${bridgeIp}/api/${bridgeUser}/lights/${light}/state`, state)
        .then(res => {
        })
    },

    getLights: async () => {

        let reachableLights = [];

        await axios.get(`http://${bridgeIp}/api/${bridgeUser}/lights/`).then(res => {

            let lights = Object.entries(res.data);
            lights.map(light => {
                if(light[1].state.reachable) {
                    reachableLights.push(light);
                }
            })
        })
        
        
        return reachableLights;
    },

    loadLights() {

        let reachableLights = [] 
        return this.getLights().then(res => {
            reachableLights = res;
            reachableLights.map(light => {
                set.push(new Light(light[0], light[1].name, light[1].uniqueid, []))
                return null;
            })
            return true;
        })

        
    }


}
