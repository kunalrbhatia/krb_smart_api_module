export const GET_MARGIN =
  'https://apiconnect.angelbroking.com/rest/secure/angelbroking/user/v1/getRMS';
export const SCRIPMASTER =
  'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json';
export const ORDER_API =
  'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/placeOrder';
export const GET_POSITIONS =
  'https://apiconnect.angelbroking.com/rest/secure/angelbroking/order/v1/getPosition';
export const HISTORIC_API =
  'https://apiconnect.angelbroking.com/rest/secure/angelbroking/historical/v1/getCandleData';
import moment from 'moment-timezone';
const totp = require('totp-generator');
const axios = require('axios');
export const ALGO = 'ALGO';
export const DELAY = 1000;
export const BIG_DELAY = 15000;
export const SHORT_DELAY = 500;
import { get as _get, isArray } from 'lodash';
let { SmartAPI } = require('smartapi-javascript');
export enum INDICES {
  NIFTY = 'NIFTY',
  MIDCPNIFTY = 'MIDCPNIFTY',
  FINNIFTY = 'FINNIFTY',
  BANKNIFTY = 'BANKNIFTY',
  SENSEX = 'SENSEX',
}
export type TimeComparisonType = { hours: number; minutes: number };
export type MarginAPIResponseType = {
  net: string | null;
  availablecash: string | null;
  availableintradaypayin: string | null;
  availablelimitmargin: string | null;
  collateral: string | null;
  m2munrealized: string | null;
  m2mrealized: string | null;
  utiliseddebits: string | null;
  utilisedspan: string | null;
  utilisedoptionpremium: string | null;
  utilisedholdingsales: string | null;
  utilisedexposure: string | null;
  utilisedturnover: string | null;
  utilisedpayout: string | null;
};
export type Position = {
  symboltoken: string;
  symbolname: string;
  instrumenttype: string;
  priceden: string;
  pricenum: string;
  genden: string;
  gennum: string;
  precision: string;
  multiplier: string;
  boardlotsize: string;
  exchange: string;
  producttype: string;
  tradingsymbol: string;
  symbolgroup: string;
  strikeprice: string;
  optiontype: 'CE' | 'PE';
  expirydate: string;
  lotsize: string;
  cfbuyqty: string;
  cfsellqty: string;
  cfbuyamount: string;
  cfsellamount: string;
  buyavgprice: string;
  sellavgprice: string;
  avgnetprice: string;
  netvalue: string;
  netqty: string;
  totalbuyvalue: string;
  totalsellvalue: string;
  cfbuyavgprice: string;
  cfsellavgprice: string;
  totalbuyavgprice: string;
  totalsellavgprice: string;
  netprice: string;
  buyqty: string;
  sellqty: string;
  buyamount: string;
  sellamount: string;
  pnl: string;
  realised: string;
  unrealised: string;
  ltp: string;
  close: string;
};
export const TRANSACTION_TYPE_BUY = 'BUY';
export const TRANSACTION_TYPE_SELL = 'SELL';
export type CREDENTIALS = {
  APIKEY: string;
  CLIENT_CODE: string;
  CLIENT_PIN: string;
  CLIENT_TOTP_PIN: string;
};
export interface HistoryInterface {
  exchange: string;
  symboltoken: string;
  interval: string;
  fromdate: string;
  todate: string;
}
export type getScripFutType = {
  scriptName: string;
};
export const getStrikeDifference = (index: string) => {
  switch (index) {
    case INDICES.NIFTY:
    case INDICES.FINNIFTY:
    case INDICES.MIDCPNIFTY:
      return 100;
    case INDICES.SENSEX:
    case INDICES.BANKNIFTY:
      return 200;
    default:
      return 100;
  }
};
export const getScripName = (expireDate: string) => {
  let scripName = '';
  const today = new Date(expireDate);
  if (today.getDay() === 1) {
    scripName = INDICES.MIDCPNIFTY;
  } else if (today.getDay() === 2) {
    scripName = INDICES.FINNIFTY;
  } else if (today.getDay() === 3) {
    scripName = INDICES.BANKNIFTY;
  } else if (today.getDay() === 4) {
    scripName = INDICES.NIFTY;
  } else if (today.getDay() === 5) {
    scripName = INDICES.MIDCPNIFTY;
  }
  return scripName;
};
export const getTodayExpiry = () => moment().format('DDMMMYYYY').toUpperCase();
export const isTradingHoliday = (): boolean => {
  const tradingHolidays = [
    '22-Jan-2024', // Jai Shree Ram
    '26-Jan-2024', // Republic Day
    '08-Mar-2024', // Mahashivratri
    '25-Mar-2024', // Holi
    '29-Mar-2024', // Good Friday
    '11-Apr-2024', // Id-Ul-Fitr (Ramzan Eid)
    '17-Apr-2024', // Ram Navmi
    '01-May-2024', // Maharashtra Day
    '17-Jun-2024', // Bakri Id
    '17-Jul-2024', // Muharram
    '15-Aug-2024', // Independence Day/Parsi New Year
    '02-Oct-2024', // Mahatma Gandhi Jayanti
    '01-Nov-2024', // Diwali Laxmi Pujan (Muhurat Trading)
    '15-Nov-2024', // Gurunanak Jayanti
    '25-Dec-2024', // Christmas
  ];
  // Get today's date
  const today = moment();
  // Check if today is in the array of trading holidays
  const isHoliday = tradingHolidays.some((holiday) => {
    const holidayDate = moment(holiday, 'DD-MMM-YYYY');
    return today.isSame(holidayDate, 'day');
  });
  return isHoliday;
};
let credentails: CREDENTIALS;
export const setCredentials = ({
  APIKEY,
  CLIENT_CODE,
  CLIENT_PIN,
  CLIENT_TOTP_PIN,
}: CREDENTIALS) => {
  if (!credentails) {
    credentails = {
      APIKEY,
      CLIENT_CODE,
      CLIENT_PIN,
      CLIENT_TOTP_PIN,
    };
  }
};
export const getCredentials = () => {
  return credentails;
};
export interface ISmartApiData {
  jwtToken: string;
  refreshToken: string;
  feedToken: string;
}
let smartSession: ISmartApiData;
export const getSmartSession = async () => {
  if (smartSession) return smartSession;
  else {
    return await generateSmartSession(credentails);
  }
};
export const generateSmartSession = async (
  credentails: CREDENTIALS
): Promise<ISmartApiData> => {
  if (smartSession) {
    return smartSession;
  } else {
    const TOTP = totp(credentails.CLIENT_TOTP_PIN);
    const smart_api = new SmartAPI({
      api_key: credentails.APIKEY,
      totp: TOTP,
    });
    return smart_api
      .generateSession(credentails.CLIENT_CODE, credentails.CLIENT_PIN, TOTP)
      .then(async (response: object) => {
        smartSession = _get(response, 'data', {}) as ISmartApiData;
        return smartSession;
      })
      .catch((ex: object) => {
        console.log(`${ALGO}: generateSmartSession failed error below`);
        console.log(ex);
        throw ex;
      });
  }
};
export const getMarginDetails =
  async (): Promise<MarginAPIResponseType | null> => {
    if (smartSession) {
      const jwtToken = smartSession.jwtToken;
      const cred = getCredentials();
      const config = {
        method: 'get',
        url: GET_MARGIN,
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-UserType': 'USER',
          'X-SourceID': 'WEB',
          'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
          'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
          'X-MACAddress': 'MAC_ADDRESS',
          'X-PrivateKey': cred.APIKEY,
        },
      };
      return axios(config)
        .then((response: Response) => {
          return _get(response, 'data.data') as
            | MarginAPIResponseType
            | undefined;
        })
        .catch((error: Response) => {
          const errorMessage = `${ALGO}: getMarginDetails failed error below`;
          console.log(errorMessage);
          console.log(error);
          throw error;
        });
    } else {
      return null;
    }
  };
export const roundToNearestHundred = (input: number): number => {
  return Math.ceil(input / 100) * 100;
};
export type delayType = {
  milliSeconds: number | undefined | string;
};
export const delay = ({ milliSeconds }: delayType) => {
  const FIVE_MINUTES = 5 * 60 * 1000;
  let delayInMilliseconds = 0;
  if (milliSeconds && typeof milliSeconds === 'number')
    delayInMilliseconds = milliSeconds;
  else if (milliSeconds && typeof milliSeconds === 'string')
    delayInMilliseconds = parseInt(milliSeconds);
  else delayInMilliseconds = FIVE_MINUTES;
  return new Promise((resolve) => {
    setTimeout(resolve, delayInMilliseconds);
  });
};
export type scripMasterResponse = {
  token: string;
  symbol: string;
  name: string;
  expiry: string;
  strike: string;
  lotsize: string;
  instrumenttype: string;
  exch_seg: string;
  tick_size: string;
};
export const findNearestStrike = (
  options: scripMasterResponse[],
  target: number
) => {
  let nearestStrike = Infinity;
  let nearestDiff = Infinity;
  for (const option of options) {
    const strike = parseInt(option.strike) / 100;
    const currentDiff = Math.abs(target - strike);
    if (currentDiff < nearestDiff) {
      nearestDiff = currentDiff;
      nearestStrike = strike;
    }
  }
  return nearestStrike;
};
export const getLastWednesdayOfMonth = () => {
  const today = moment();
  const lastDayOfMonth = today.endOf('month');
  while (lastDayOfMonth.day() !== 3) {
    lastDayOfMonth.subtract(1, 'days');
  }
  return lastDayOfMonth;
};
let scripMasterJson: scripMasterResponse[];
const setScripMasterJson = (data: scripMasterResponse[]) => {
  scripMasterJson = data;
};
const getScripMasterJson = async () => {
  if (scripMasterJson) {
    return scripMasterJson;
  } else {
    await delay({ milliSeconds: DELAY });
    const data = await fetchData();
    setScripMasterJson(data);
    return data;
  }
};
export const fetchData = async (): Promise<scripMasterResponse[]> => {
  const data = await getScripMasterJson();
  if (data.length > 0) {
    return data as scripMasterResponse[];
  } else {
    return await axios
      .get(SCRIPMASTER)
      .then((response: object) => {
        let acData: scripMasterResponse[] = _get(response, 'data', []) || [];
        setScripMasterJson(acData);
        return acData;
      })
      .catch((evt: object) => {
        console.log(`${ALGO}: fetchData failed error below`);
        console.log(evt);
        throw evt;
      });
  }
};
export const getLastThursdayOfCurrentMonth = () => {
  const today = moment();
  let lastDayOfMonth = moment().endOf('month');
  // Loop backward from the last day until we find a Thursday
  while (lastDayOfMonth.day() !== 4) {
    lastDayOfMonth.subtract(1, 'days');
  }
  if (lastDayOfMonth.isBefore(today)) {
    lastDayOfMonth = moment().endOf('month');
    lastDayOfMonth.add(1, 'month');
    // Loop backward from the last day until we find a Thursday
    while (lastDayOfMonth.day() !== 4) {
      lastDayOfMonth.subtract(1, 'days');
    }
  }
  return lastDayOfMonth.format('DDMMMYYYY').toUpperCase();
};
export const getAllFut = async () => {
  let scripMaster: scripMasterResponse[] = await getScripMasterJson();
  if (isArray(scripMaster) && scripMaster.length > 0) {
    const _expiry: string = getLastThursdayOfCurrentMonth();
    let filteredScrips = scripMaster.filter((scrip) => {
      return (
        _get(scrip, 'exch_seg') === 'NFO' &&
        _get(scrip, 'instrumenttype') === 'FUTSTK' &&
        _get(scrip, 'expiry') === _expiry
      );
    });
    if (filteredScrips.length > 0) return filteredScrips;
    else throw new Error('some error occurred');
  } else {
    throw new Error('some error occurred');
  }
};
export const closeParticularTrade = async (position: Position) => {
  if (smartSession) {
    const cred = getCredentials();
    const netQty = parseInt(position.netqty);
    const tradingsymbol = position.tradingsymbol;
    const transactionType =
      netQty < 0 ? TRANSACTION_TYPE_BUY : TRANSACTION_TYPE_SELL;
    const symboltoken = position.symboltoken;
    let data = JSON.stringify({
      exchange: 'NFO',
      tradingsymbol,
      symboltoken,
      quantity: Math.abs(netQty),
      disclosedquantity: Math.abs(netQty),
      transactiontype: transactionType,
      ordertype: 'MARKET',
      variety: 'NORMAL',
      producttype: 'CARRYFORWARD',
      duration: 'DAY',
    });
    // console.log(`${ALGO}: closeParticularTrade data `, data);
    let config = {
      method: 'post',
      url: ORDER_API,
      headers: {
        Authorization: `Bearer ${smartSession.jwtToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-PrivateKey': cred.APIKEY,
      },
      data: data,
    };
    try {
      const response = await axios(config);
      if (response.status >= 200 && response.status < 300) {
        return _get(response, 'data');
      } else {
        const errorMessage = `${ALGO}: closeParticularTrade failed. Symbol: ${tradingsymbol}. HTTP Status Code: ${response.status}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = `${ALGO}: closeParticularTrade failed. Symbol: ${tradingsymbol}. Error: `;
      console.error(errorMessage, error);
      throw error;
    }
  }
};
export const getPositions = async (
  smartSession: ISmartApiData,
  cred: CREDENTIALS
) => {
  let config = {
    method: 'get',
    url: GET_POSITIONS,
    headers: {
      Authorization: `Bearer ${smartSession.jwtToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-UserType': 'USER',
      'X-SourceID': 'WEB',
      'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
      'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
      'X-MACAddress': 'MAC_ADDRESS',
      'X-PrivateKey': cred.APIKEY,
    },
    data: '',
  };
  try {
    const response = await axios(config);
    if (response.status >= 200 && response.status < 300) {
      return _get(response, 'data.data', []) as Position[];
    } else {
      const errorMessage = `${ALGO}: getPositions failed. HTTP Status Code: ${response.status}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    const errorMessage = `${ALGO}: getPositions failed. Error: `;
    console.error(errorMessage, error);
    throw error;
  }
};
export const isCurrentTimeGreater = ({
  hours,
  minutes,
}: TimeComparisonType): boolean => {
  const currentTime = moment().tz('Asia/Kolkata');
  const targetTime = moment()
    .tz('Asia/Kolkata')
    .set({ hours, minutes, seconds: 0 });
  return currentTime.isAfter(targetTime);
};
export const getScripFut = async ({ scriptName }: getScripFutType) => {
  let scripMaster: scripMasterResponse[] = await fetchData();
  console.log(
    `${ALGO}: scriptName: ${scriptName}, is scrip master an array: ${isArray(
      scripMaster
    )}, its length is: ${scripMaster.length}`
  );
  if (scriptName && isArray(scripMaster) && scripMaster.length > 0) {
    console.log(`${ALGO}: all check cleared getScrip call`);
    console.log(`${ALGO}: expiry: ${getLastThursdayOfCurrentMonth()}`);
    let filteredScrip = scripMaster.filter((scrip) => {
      const _scripName: string = _get(scrip, 'name', '') || '';
      const _expiry: string = getLastThursdayOfCurrentMonth();
      return (
        (_scripName.includes(scriptName) || _scripName === scriptName) &&
        _get(scrip, 'exch_seg') === 'NFO' &&
        (_get(scrip, 'instrumenttype') === 'FUTSTK' ||
          _get(scrip, 'instrumenttype') === 'FUTIDX') &&
        _get(scrip, 'expiry') === _expiry
      );
    });
    if (filteredScrip.length === 1) return filteredScrip[0];
    else throw new Error('scrip not found');
  } else {
    throw new Error('scrip not found');
  }
};
export const getHistoricPrices = async (data: HistoryInterface) => {
  const smartApiData: ISmartApiData = await getSmartSession();
  const cred = getCredentials();
  const payload = JSON.stringify({
    exchange: data.exchange,
    symboltoken: data.symboltoken,
    interval: data.interval,
    fromdate: data.fromdate,
    todate: data.todate,
  });
  let config = {
    method: 'post',
    url: HISTORIC_API,
    headers: {
      Authorization: `Bearer ${smartApiData.jwtToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-UserType': 'USER',
      'X-SourceID': 'WEB',
      'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
      'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
      'X-MACAddress': 'MAC_ADDRESS',
      'X-PrivateKey': cred.APIKEY,
    },
    data: payload,
  };
  return await axios(config)
    .then(function (response: any) {
      return _get(response, 'data.data');
    })
    .catch(function (error: any) {
      return error;
    });
};
