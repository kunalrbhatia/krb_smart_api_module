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
export type CREDENTIALS = {
  APIKEY: string;
  CLIENT_CODE: string;
  CLIENT_PIN: string;
  CLIENT_TOTP_PIN: string;
};
export const getStrikeDifference = (index: string) => {
  switch (index) {
    case INDICES.NIFTY:
      return 100;
    case INDICES.FINNIFTY:
    case INDICES.MIDCPNIFTY:
      return 50;
    case INDICES.SENSEX:
    case INDICES.BANKNIFTY:
      return 200;
    default:
      return 50;
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
export const hedgeCalculation = (index: string) => {
  switch (index) {
    case INDICES.NIFTY:
      return 500;
    case INDICES.FINNIFTY:
      return 400;
    case INDICES.MIDCPNIFTY:
      return 100;
    case INDICES.SENSEX:
    case INDICES.BANKNIFTY:
      return 1000;
    default:
      return 1000;
  }
};
