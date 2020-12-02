// src/App.js

import { NaturePeopleOutlined } from '@material-ui/icons';
import React, { Component } from 'react';
import { actions } from '../../../../app/modules/Auth/_redux/authRedux';

class YupTokenmetrics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      supply: null,
      gecko: null,
      yupActions: null
    };
  }

  async componentDidMount() {
    let [supply, gecko, yupActions]= await Promise.all([this.getSupply(), this.getGeckoData(), this.getActionsCount()]);
    console.log(supply,gecko, yupActions)
    this.setState({
      isLoaded: true,
      gecko: gecko,
      supply: supply,
      yupActions: yupActions
    });
  }
  async getSupply(){
   return new Promise( (resolve, reject) =>{
      fetch("http://api.eosn.io/v1/chain/get_currency_stats",   {method: 'POST',
      headers: {
       'Content-Type': 'application/json;charset=utf-8'
     },
      body: JSON.stringify({
       "code" : "token.yup",
       "symbol": "YUP"
      })
       })
         .then(res => res.json())
         .then(
           (result) => {
             resolve(result)

           },
           // Note: it's important to handle errors here
           // instead of a catch() block so that we don't swallow
           // exceptions from actual bugs in components.
           (error) => {
             reject(error)
           }
         )
    })
  }
  async getGeckoData(){
    return new Promise( (resolve, reject) =>{ fetch("https://api.coingecko.com/api/v3/coins/yup")
    .then(res => res.json())
    .then(
      (result) => {
        resolve(result)

      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        reject(error)
      })
      })
      }

      async getActionsCount(){
        return new Promise( (resolve, reject) =>{ fetch("https://api.yup.io/accounts/actions-count")
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result)
            resolve(result)

          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            reject(error)
          })
          })
          }

  render() {

    const { error, isLoaded, supply, gecko, yupActions } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      console.log(gecko, supply)
      supply.YUP.supply =  parseInt(supply.YUP.supply.split(" ")[0])
      supply.YUP.max_supply =  parseInt(supply.YUP.max_supply.split(" ")[0])
      let priceChangeColor ='success';
      if ( gecko.market_data.price_change_24h <0) {
        priceChangeColor = 'danger';
      }
      return (
        <div className={`card card-custom card-stretch gutter-b`}>
          <div className="card-body p-4">
            <div className="tab-content">
              <div className="table-responsive"></div>
              <table className="table table-head-custom table-head-bg table-borderless table-vertical-center mb-0">

                <tbody>
                  <tr>
                    <td >
                      <div>
                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg">YUP price</span>
                      <h4 className="text-success d-block mb-0 pt-2 pb-2"> ${gecko.market_data.current_price.usd.toFixed(2)} <sup className={'text-'+ priceChangeColor +' font-size-sm'}>{Math.abs(gecko.market_data.price_change_24h).toFixed(2)}%</sup> </h4>
                      <span className="text-primary font-weight-bold">Mcap: ${(gecko.market_data.current_price.usd*supply.YUP.supply).toFixed(0)}</span>
                      </div>
                    </td>
                    <td >

                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg">Supply</span>
                      <h4 className="text-success d-block mb-0 pt-2 pb-2">{supply.YUP.supply} YUP</h4>
                      <span className="text-primary font-weight-bold">/{supply.YUP.max_supply} YUP Total</span>
                    </td>
                    <td>
                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg">Transactions</span>
                      <h4 className="text-success d-block mb-0 pt-2 pb-8">{yupActions}</h4>
                      <span className="text-primary font-weight-bold"></span>
                    </td>
                    <td>
                      <span className="text-dark-75 font-weight-bolder d-block font-size-lg">Daily distribution</span>
                      <h4 className="text-success d-block mb-0 pt-2 pb-2">{(supply.YUP.supply*0.0125).toFixed(0)} YUP</h4>
                      <span className="text-primary font-weight-bold">1.25%</span>
                    </td>

                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>


      );
    }
  }
}

export default YupTokenmetrics;
