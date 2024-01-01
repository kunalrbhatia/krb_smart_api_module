import moment from 'moment';
import { get as _get } from 'lodash';
const totp = require('totp-generator');
const ALGO = 'ALGO';
let { SmartAPI } = require('smartapi-javascript');
export enum INDICES {
  NIFTY = 'NIFTY',
  MIDCPNIFTY = 'MIDCPNIFTY',
  FINNIFTY = 'FINNIFTY',
  BANKNIFTY = 'BANKNIFTY',
  SENSEX = 'SENSEX',
}
export const getStrikeDifference = (index: string) => {
  switch (index) {
    case INDICES.NIFTY:
    case INDICES.FINNIFTY:
      return 0.01;
    case INDICES.MIDCPNIFTY:
    case INDICES.SENSEX:
    case INDICES.BANKNIFTY:
      return 0.006;
    default:
      return 0.01;
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
export type CREDENTAILS = {
  APIKEY: string;
  CLIENT_CODE: string;
  CLIENT_PIN: string;
  CLIENT_TOTP_PIN: string;
};
let credentails: CREDENTAILS;
export const setCredentials = ({
  APIKEY,
  CLIENT_CODE,
  CLIENT_PIN,
  CLIENT_TOTP_PIN,
}: CREDENTAILS) => {
  credentails.APIKEY = APIKEY;
  credentails.CLIENT_CODE = CLIENT_CODE;
  credentails.CLIENT_PIN = CLIENT_PIN;
  credentails.CLIENT_TOTP_PIN = CLIENT_TOTP_PIN;
};
export const getCredentials = () => {
  return credentails;
};
export interface ISmartApiData {
  jwtToken: string;
  refreshToken: string;
  feedToken: string;
}
export const generateSmartSession = async (): Promise<ISmartApiData | null> => {
  if (credentails) {
    const TOTP = totp(credentails.CLIENT_TOTP_PIN);
    const smart_api = new SmartAPI({
      api_key: credentails.APIKEY,
      totp: TOTP,
    });
    return smart_api
      .generateSession(credentails.CLIENT_CODE, credentails.CLIENT_PIN, TOTP)
      .then(async (response: object) => {
        return _get(response, 'data');
      })
      .catch((ex: object) => {
        console.log(`${ALGO}: generateSmartSession failed error below`);
        console.log(ex);
        throw ex;
      });
  } else {
    console.log(
      `${ALGO}: generateSmartSession failed as credentails not defined`
    );
  }
  return null;
};
export const hedgeCalculation = (index: string) => {
  switch (index) {
    case INDICES.NIFTY:
    case INDICES.FINNIFTY:
      return 500;
    case INDICES.MIDCPNIFTY:
      return 100;
    case INDICES.SENSEX:
    case INDICES.BANKNIFTY:
      return 1000;
    default:
      return 1000;
  }
};
