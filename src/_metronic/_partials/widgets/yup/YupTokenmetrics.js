// src/App.js
import moment from "moment";
//import { NaturePeopleOutlined } from '@material-ui/icons';
import React, { Component } from 'react';
//import { actions } from '../../../../app/modules/Auth/_redux/authRedux';
import Skeleton from '@material-ui/lab/Skeleton';

// eslint-disable-next-line no-extend-native
String.prototype.numeral = function() {
  return this.replace(/(^|[^\w.])(\d{4,})/g, function(_$0, $1, $2) {
    return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, '$&,');
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
      yupActions: null,
      currentDailyEmission: null
    };

    this.getAllData = this.getAllData.bind(this);
    this.getSupply = this.getSupply.bind(this);
    this.getGeckoData = this.getGeckoData.bind(this);
    this.getActionsCount = this.getActionsCount.bind(this);
  }
  //Needs to be stored, no need to recalc that every time
  async currentDailyEmission(){       
    const json = [];
    let yupSuplyNow = 100000 ;
    let dayEm;
            
    let startDate = moment(new Date('24-October-2020'));
    for(let i =0; i<= 364; i++){
      dayEm = Math.round((1.25*yupSuplyNow)/100);
      yupSuplyNow += dayEm;
      json.push({ date:startDate.local().format('YYYY-MM-DD'), value:dayEm });
      startDate = startDate.add(1, 'd');
    }
    for(let i =0; i<= 1049; i++){
      dayEm-=100;
      json.push({ date:startDate.local().format('YYYY-MM-DD'), value:dayEm });
      startDate = startDate.add(1, 'd');
    }  
      const today = moment(new Date())
      const diff =today.diff( moment(new Date('24-October-2020')), 'days') 
     if(diff<=json.length) {
       this.setState({currentDailyEmission:json[diff].value})
      } else {
        this.setState({currentDailyEmission:10000})
      }
  }

  componentDidMount() {
    this.getAllData();
    this.currentDailyEmission()
    setInterval(this.getAllData, 30000);
  }
  async getAllData() {
    let [supply, gecko, yupActions] = await Promise.all([
      this.getSupply(),
      this.getGeckoData(),
      this.getActionsCount(),
    ]);
    this.setState({
      gecko: gecko,
      supply: supply,
      yupActions: yupActions,
      isLoaded: true,
    });
  }
  async getSupply() {
    return new Promise((resolve, reject) => {
      fetch('https://api.eosn.io/v1/chain/get_currency_stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({
          code: 'token.yup',
          symbol: 'YUP',
        }),
      })
        .then(res => res.json())
        .then(
          result => {
            resolve(result);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          error => {
            reject(error);
          },
        );
    });
  }
  async getGeckoData() {
    return new Promise((resolve, reject) => {
      fetch('https://api.coingecko.com/api/v3/coins/yup')
        .then(res => res.json())
        .then(
          result => {
            resolve(result);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          error => {
            reject(error);
          },
        );
    });
  }

  async getActionsCount() {
    return new Promise((resolve, reject) => {
      fetch('https://api.yup.io/metrics/total-votes')
        .then(res => res.json())
        .then(
          result => {
            resolve(result);
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          error => {
            reject(error);
          },
        );
    });
  }

  render() {
    const { error, isLoaded, supply, gecko, yupActions, currentDailyEmission } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div className={`card card-custom card-stretch gutter-b`}>
          <div className="card-body p-4">
            <div className="tab-content">
              <div className="table-responsive"></div>
              <table className="table table-head-custom table-head-bg table-borderless table-vertical-center mb-0">
                <tbody>
                  <tr>
                    <td>
                      <div>
                        <span className="text-dark-25 font-weight-bolder d-block font-size-lg">YUP price</span>
                        <h2 className="text-secondary d-block mb-0 pt-2 pb-2"> {!isLoaded ? <Skeleton /> : 'h2'} </h2>
                        <span className="text-dark-50 font-weight-bold"> {!isLoaded ? <Skeleton /> : 'h5'} </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-dark-25 font-weight-bolder d-block font-size-lg">Supply</span>
                      <h2 className="text-secondary d-block mb-0 pt-2 pb-2">{!isLoaded ? <Skeleton /> : 'h2'}</h2>
                      <span className="text-dark-50 font-weight-bold">{!isLoaded ? <Skeleton /> : 'h5'}</span>
                    </td>
                    <td>
                      <span className="text-dark-25 font-weight-bolder d-block font-size-lg">Transactions</span>
                      <h2 className="text-secondary d-block mb-0 pt-2 pb-2">{!isLoaded ? <Skeleton /> : 'h2'}</h2>
                      <span className="text-dark-50 font-weight-bold">{!isLoaded ? <Skeleton /> : 'h5'}</span>
                    </td>
                    <td>
                      <span className="text-dark-25 font-weight-bolder d-block font-size-lg">Daily distribution</span>
                      <h2 className="text-secondary d-block mb-0 pt-2 pb-2">{!isLoaded ? <Skeleton /> : 'h2'}</h2>
                      <span className="text-dark-50 font-weight-bold">{!isLoaded ? <Skeleton /> : 'h5'}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else {
      //console.log(gecko, supply);
      supply.YUP.supply = parseInt(supply.YUP.supply);
      supply.YUP.max_supply = parseInt(supply.YUP.max_supply);
      let priceChangeColor = 'success';
      if (gecko.market_data.price_change_24h < 0) {
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
                    <td>
                      <div>
                        <span className="text-dark-25 font-weight-bolder d-block font-size-lg">YUP price</span>
                        <h2 className="text-secondary d-block mb-0 pt-2 pb-2">
                          {' '}
                          ${gecko.market_data.current_price.usd?.toFixed(2)}{' '}
                          <sup className={'text-' + priceChangeColor + ' font-size-sm'}>
                            {Math.abs(gecko.market_data.price_change_24h * 100).toFixed(2)}%
                          </sup>{' '}
                        </h2>
                        <span className="text-dark-50 font-weight-bold">
                          Mcap: ${(gecko.market_data.current_price.usd * supply.YUP.supply)?.toFixed(0).numeral()}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-dark-25 font-weight-bolder d-block font-size-lg">Supply</span>
                      <h2 className="text-secondary d-block mb-0 pt-2 pb-2">
                        {supply.YUP.supply?.toFixed(0).numeral()} YUP
                      </h2>
                      <span className="text-dark-50 font-weight-bold">
                        /{supply.YUP.max_supply?.toFixed(0).numeral()} YUP Total
                      </span>
                    </td>
                    <td>
                      <span className="text-dark-25 font-weight-bolder d-block font-size-lg">Transactions</span>
                      <h2 className="text-secondary d-block mb-0 pt-2 pb-8">{yupActions?.toFixed(0).numeral()}</h2>
                      <span className="text-dark-50 font-weight-bold"></span>
                    </td>
                    <td>
                      <span className="text-dark-25 font-weight-bolder d-block font-size-lg">Daily distribution</span>
                      <h2 className="text-secondary d-block mb-0 pt-2 pb-2">
                        {currentDailyEmission?.toFixed(0).numeral()} YUP
                      </h2>
                      <span className="text-dark-50 font-weight-bold">
                        ${(gecko.market_data.current_price.usd * currentDailyEmission)?.toFixed(0).numeral()}
                      </span>
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
