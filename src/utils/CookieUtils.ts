import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY as string;

export interface CookieOptions {
  expires?: number; // 일 단위
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export class CookieUtils {
  static setEncryptedCookie(
    name: string,
    value: string,
    options: CookieOptions = {}
  ): void {
    try {
      const encrypted = CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString();

      const {
        expires = 1,
        path = "/",
        domain,
        secure = window.location.protocol === "https:",
        sameSite = "lax",
      } = options;

      let cookieString = `${name}=${encodeURIComponent(encrypted)}`;

      if (expires) {
        const date = new Date();
        date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
        cookieString += `; expires=${date.toUTCString()}`;
      }

      cookieString += `; path=${path}`;

      if (domain) {
        cookieString += `; domain=${domain}`;
      }

      if (secure) {
        cookieString += `; secure`;
      }

      cookieString += `; samesite=${sameSite}`;

      document.cookie = cookieString;
    } catch (error) {
      console.error("Error setting encrypted cookie:", error);
      throw new Error("Failed to set encrypted cookie");
    }
  }

  static getEncryptedCookie(name: string): string | null {
    try {
      const cookies = document.cookie.split(";");

      for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split("=");

        if (cookieName === name && cookieValue) {
          const decryptedBytes = CryptoJS.AES.decrypt(
            decodeURIComponent(cookieValue),
            ENCRYPTION_KEY
          );
          return decryptedBytes.toString(CryptoJS.enc.Utf8);
        }
      }

      return null;
    } catch (error) {
      console.error("Error getting encrypted cookie:", error);
      return null;
    }
  }

  static deleteCookie(name: string, path: string = "/"): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  }

  static deleteAllCookies(): void {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      const cookieName = cookie.split("=")[0].trim();
      this.deleteCookie(cookieName);
    }
  }

  static hasCookie(name: string): boolean {
    return this.getEncryptedCookie(name) !== null;
  }

  static setAppPassword(password: string): void {
    this.setEncryptedCookie("naver_app_password", password, {
      expires: 1,
      secure: true,
      sameSite: "strict",
    });
  }

  static getAppPassword(): string | null {
    return this.getEncryptedCookie("naver_app_password");
  }

  static deleteAppPassword(): void {
    this.deleteCookie("naver_app_password");
  }

  static hasAppPassword(): boolean {
    return this.hasCookie("naver_app_password");
  }
}

export class AppPasswordManager {
  static async savePassword(password: string): Promise<boolean> {
    try {
      if (!password || password.trim().length === 0) {
        throw new Error("Invalid password");
      }

      CookieUtils.setAppPassword(password.trim());

      const saved = CookieUtils.getAppPassword();
      return saved === password.trim();
    } catch (error) {
      console.error("Error saving app password:", error);
      return false;
    }
  }

  static getPassword(): string | null {
    return CookieUtils.getAppPassword();
  }

  static deletePassword(): void {
    CookieUtils.deleteAppPassword();
  }

  static hasPassword(): boolean {
    return CookieUtils.hasAppPassword();
  }

  static validatePassword(password: string): {
    isValid: boolean;
    message: string;
  } {
    if (!password || password.trim().length === 0) {
      return { isValid: false, message: "비밀번호를 입력해주세요." };
    }

    if (password.length < 8) {
      return {
        isValid: false,
        message: "앱 비밀번호는 최소 8자 이상이어야 합니다.",
      };
    }

    if (password.length > 50) {
      return { isValid: false, message: "앱 비밀번호가 너무 깁니다." };
    }

    // 네이버 앱 비밀번호는 일반적으로 영문+숫자 조합
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) {
      return {
        isValid: false,
        message: "앱 비밀번호는 영문자와 숫자를 포함해야 합니다.",
      };
    }

    return { isValid: true, message: "" };
  }
}
