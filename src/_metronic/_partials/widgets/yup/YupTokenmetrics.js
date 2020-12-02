// src/App.js

import { NaturePeopleOutlined } from '@material-ui/icons';
import React, { Component } from 'react';
import { actions } from '../../../../app/modules/Auth/_redux/authRedux';

String.prototype.numeral = function () {
    return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
    });
};

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
    
    this.getAllData = this.getAllData.bind(this);
    this.getSupply = this.getSupply.bind(this);
    this.getGeckoData = this.getGeckoData.bind(this);
    this.getActionsCount = this.getActionsCount.bind(this);
    
  }

   componentDidMount() {
    setInterval(this.getAllData, 30000);
  }
  async getAllData(){
    let [supply, gecko, yupActions]= await Promise.all([this.getSupply(), this.getGeckoData(), this.getActionsCount()]);    
    this.setState({
      gecko: gecko,
      supply: supply,
      yupActions: yupActions,
      isLoaded:true
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
      supply.YUP.supply =  parseInt(supply.YUP.supply)
      supply.YUP.max_supply =  parseInt(supply.YUP.max_supply)
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
                      <span className="text-dark-25 font-weight-bolder d-block font-size-lg">YUP price</span>
                      <h2 className="text-secondary d-block mb-0 pt-2 pb-2"> ${gecko.market_data.current_price.usd.toFixed(2)} <sup className={'text-'+ priceChangeColor +' font-size-sm'}>{Math.abs(gecko.market_data.price_change_24h).toFixed(2)}%</sup> </h2>
                      <span className="text-dark-50 font-weight-bold">Mcap: ${(gecko.market_data.current_price.usd*supply.YUP.supply).toFixed(0).numeral()}</span>
                      </div>
                    </td>
                    <td >

                      <span className="text-dark-25 font-weight-bolder d-block font-size-lg">Supply</span>
                      <h2 className="text-secondary d-block mb-0 pt-2 pb-2">{supply.YUP.supply.toFixed(0).numeral()} YUP</h2>
                      <span className="text-dark-50 font-weight-bold">/{supply.YUP.max_supply.toFixed(0).numeral()} YUP Total</span>
                    </td>
                    <td>
                    <span className="text-dark-25 font-weight-bolder d-block font-size-lg">Transactions</span>
                      <h2 className="text-secondary d-block mb-0 pt-2 pb-8">{yupActions.toFixed(0).numeral()}</h2>
                      <span className="text-dark-50 font-weight-bold"></span>
                    </td>
                    <td>
                      <span className="text-dark-25 font-weight-bolder d-block font-size-lg">Daily distribution</span>
                      <h2 className="text-secondary d-block mb-0 pt-2 pb-2">{(supply.YUP.supply*0.0125).toFixed(0).numeral()} YUP</h2>
                      <span className="text-dark-50 font-weight-bold">${(gecko.market_data.current_price.usd*supply.YUP.supply*0.0125).toFixed(0).numeral()}</span>
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
