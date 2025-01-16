import moment from "moment";
import dayjs from "dayjs";
import { SliderMenuItem } from "./global";
import { storage } from "./config-firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const isExpiredTimeToken = (loginDate: string, exp: number): boolean => {
  const tokenExpiredTime = moment(loginDate).add(exp, "minute").toDate();
  const currentDate = moment().toDate();
  return tokenExpiredTime > currentDate;
};

export const filterMenuByRole = (
  menu: SliderMenuItem[],
  roleId?: number
): SliderMenuItem[] => {
  if (roleId === undefined) return [];
  return menu.filter((item) => item.roles.includes(roleId));
};

export const handleLowerCaseNonAccentVietnamese = (str: string) => {
  str = str.toLowerCase();

  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
};

export const generateFallbackAvatar = (fullname: string): string => {
  const fallbackColor = "#FF9966";

  const initials = handleLowerCaseNonAccentVietnamese(
    fullname?.charAt(0).toUpperCase() || ""
  );

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
      <rect width="100%" height="100%" fill="${fallbackColor}" />
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="50">
        ${initials}
      </text>
    </svg>
  `;
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
  return dataUrl;
};

export const isExpiredTimeTokenSecondHandle = (iat: number, exp: number) => {
  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime > exp) {
    return true;
  } else {
    return false;
  }
};

export const handleUploadToFirebase = async (file: File, folder: string) => {
  const storageRef = ref(storage, `${folder}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  await uploadTask;
  return await getDownloadURL(storageRef);
};

export const formatPrice = (value: string | number) => {
  if (!value) return "";
  
  const numValue = Number(value);
  if (isNaN(numValue)) return "";
  
  const intValue = Math.floor(numValue);
  
  const numericString = intValue.toString().replace(/\./g, "");
  
  return numericString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const formatCurrencyToVND = (input: string | number): string => {
  const amount = typeof input === "string" ? parseFloat(input) : input;

  if (isNaN(amount)) {
    throw new Error(
      "Invalid input value. Please enter a number or string containing numbers."
    );
  }

  const formattedAmount = amount.toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formattedAmount;
};

export function formatDateTimeVN(inputDate: string): string {
  const date = new Date(inputDate);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; 
  const year = date.getUTCFullYear();

  const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

  return `${formattedTime} | ${formattedDate}`;
}