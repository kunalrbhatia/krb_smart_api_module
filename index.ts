export const GET_MARGIN =
  'https://apiconnect.angelbroking.com/rest/secure/angelbroking/user/v1/getRMS';
import moment from 'moment';
const totp = require('totp-generator');
const axios = require('axios');
const ALGO = 'ALGO';
import { get as _get } from 'lodash';
let { SmartAPI } = require('smartapi-javascript');
export enum INDICES {
  NIFTY = 'NIFTY',
  MIDCPNIFTY = 'MIDCPNIFTY',
  FINNIFTY = 'FINNIFTY',
  BANKNIFTY = 'BANKNIFTY',
  SENSEX = 'SENSEX',
}
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
export type CREDENTIALS = {
  APIKEY: string;
  CLIENT_CODE: string;
  CLIENT_PIN: string;
  CLIENT_TOTP_PIN: string;
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
let credentails: CREDENTIALS | undefined;
export const setCredentials = ({
  APIKEY,
  CLIENT_CODE,
  CLIENT_PIN,
  CLIENT_TOTP_PIN,
}: CREDENTIALS) => {
  if (credentails) {
    throw new Error('Credentials have already been set.');
  }
  credentails = {
    APIKEY,
    CLIENT_CODE,
    CLIENT_PIN,
    CLIENT_TOTP_PIN,
  };
};
export const getCredentials = () => {
  if (!credentails) {
    throw new Error('Credentials have not been set.');
  }
  return credentails;
};
export interface ISmartApiData {
  jwtToken: string;
  refreshToken: string;
  feedToken: string;
}
let smartSession: ISmartApiData | undefined;
export const getSmartSession = async () => {
  if (smartSession) return smartSession;
  else {
    if (credentails) return await generateSmartSession(credentails);
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
        smartSession = _get(response, 'data');
        return smartSession;
      })
      .catch((ex: object) => {
        console.log(`${ALGO}: generateSmartSession failed error below`);
        console.log(ex);
        throw ex;
      });
  }
};
const getMarginDetails = async (): Promise<MarginAPIResponseType | null> => {
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
        return _get(response, 'data.data') as MarginAPIResponseType | undefined;
      })
      .catch(function (error: Response) {
        const errorMessage = `${ALGO}: getMarginDetails failed error below`;
        console.log(errorMessage);
        console.log(error);
        throw error;
      });
  } else {
    return null;
  }
};
export const hedgeCalculation = (index: string) => {
  switch (index) {
    case INDICES.NIFTY:
      return 400;
    case INDICES.FINNIFTY:
      return 400;
    case INDICES.MIDCPNIFTY:
      let date = new Date();
      if (date.getDay() === 5) return 150;
      else return 100;
    case INDICES.SENSEX:
    case INDICES.BANKNIFTY:
      return 1000;
    default:
      return 1000;
  }
};
export const roundToNearestHundred = (input: number): number => {
  return Math.ceil(input / 100) * 100;
};
export const isJson = (string: string) => {
  console.log(`${ALGO}: checking if json is proper.`);
  try {
    JSON.parse(string);
    return true;
  } catch (error) {
    return false;
  }
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
